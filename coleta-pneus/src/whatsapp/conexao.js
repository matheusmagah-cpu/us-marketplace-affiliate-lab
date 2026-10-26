// Conexão com o WhatsApp via Baileys (WebSocket direto, sem navegador).
// Reconecta sozinha; só pede QR de novo se o aparelho for desconectado no celular.
import { rmSync } from 'node:fs';
import makeWASocket, { useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason, Browsers } from 'baileys';
import pino from 'pino';
import { extrairMensagem } from './mensagem.js';

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

export function criarConexao({
  pastaSessao = 'dados/sessao-baileys',
  aoMudar = () => {},
  aoMensagem = () => {},
  log = console,
  fabricaSocket = makeWASocket,
  carregarSessao = useMultiFileAuthState,
  versaoWhatsapp = async () => (await fetchLatestBaileysVersion().catch(() => ({}))).version,
} = {}) {
  let sock = null;
  let geracao = 0;
  let conectado = false;
  let parado = false;
  let tentativas = 0;
  const idsDoRobo = new Set();

  async function iniciar() {
    const minha = ++geracao;
    if (sock) {
      sock.ev.removeAllListeners();
      try { sock.end(undefined); } catch { /* já fechado */ }
    }
    const { state, saveCreds } = await carregarSessao(pastaSessao);
    const version = await versaoWhatsapp();
    sock = fabricaSocket({
      auth: state,
      ...(version ? { version } : {}),
      logger: pino({ level: 'warn' }),
      browser: Browsers.macOS('Desktop'),
      markOnlineOnConnect: false, // o celular continua recebendo notificações
      syncFullHistory: false,
    });
    const atual = sock;
    const ehAtual = () => minha === geracao && atual === sock;

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
      if (!ehAtual()) return;
      if (qr) aoMudar('aguardando_qr', qr);
      if (connection === 'open') {
        conectado = true;
        tentativas = 0;
        aoMudar('conectado', null);
        log.log('WhatsApp conectado.');
      }
      if (connection === 'close') {
        conectado = false;
        if (parado) return;
        const codigo = lastDisconnect?.error?.output?.statusCode;
        if (codigo === DisconnectReason.loggedOut) {
          log.warn('Aparelho desconectado no celular: será preciso ler o QR code de novo.');
          rmSync(pastaSessao, { recursive: true, force: true });
          aoMudar('desconectado', null);
        } else {
          aoMudar('reconectando', null);
        }
        tentativas++;
        await esperar(Math.min(60000, 2000 * tentativas));
        if (ehAtual() && !parado) iniciar().catch((e) => log.error('Falha ao reconectar:', e.message));
      }
    });

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
      if (!ehAtual()) return;
      for (const bruta of messages) {
        const m = extrairMensagem(bruta);
        if (!m) continue;
        try {
          await aoMensagem({ ...m, peloRobo: idsDoRobo.has(m.id), tempoReal: type === 'notify' });
        } catch (e) {
          log.warn('Erro ao tratar mensagem:', e.message);
        }
      }
    });
  }

  function exigirConexao() {
    if (!conectado || !sock) throw new Error('WhatsApp desconectado');
  }

  return {
    iniciar,
    estaConectado: () => conectado,

    // { existe, jid, ehBusiness } — existe=false só quando o WhatsApp confirma que o número não existe.
    async numeroNoWhatsapp(numero) {
      exigirConexao();
      const [r] = (await sock.onWhatsApp(numero)) || [];
      if (!r?.exists) return { existe: false, jid: null, ehBusiness: false };
      const perfil = await sock.getBusinessProfile(r.jid).catch(() => null);
      return { existe: true, jid: r.jid, ehBusiness: Boolean(perfil) };
    },

    async enviarTexto(jid, texto, { msPorCaractere = 40 } = {}) {
      exigirConexao();
      try {
        await sock.presenceSubscribe(jid);
        await sock.sendPresenceUpdate('composing', jid);
      } catch { /* segue sem "digitando" */ }
      await esperar(Math.min(12000, msPorCaractere * texto.length));
      try { await sock.sendPresenceUpdate('paused', jid); } catch { /* ignore */ }
      const enviada = await sock.sendMessage(jid, { text: texto });
      if (enviada?.key?.id) idsDoRobo.add(enviada.key.id);
      return enviada?.key?.id ?? null;
    },

    async telefoneDoLid(lid) {
      try {
        return (await sock?.signalRepository?.lidMapping?.getPNForLID(lid)) || null;
      } catch {
        return null;
      }
    },

    parar() {
      parado = true;
      sock?.ev.removeAllListeners();
      try { sock?.end(undefined); } catch { /* ignore */ }
    },
  };
}
