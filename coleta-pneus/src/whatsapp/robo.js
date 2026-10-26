// O robô completo: verifica números, envia campanhas, atende respostas com IA e avisa o dono.
import config from '../../config/config.js';
import { montarMensagem } from '../../config/mensagens.js';
import {
  listarEstabelecimentos, atualizarEstabelecimento, registrarMensagem, listarMensagens,
  encontrarPorContato, marcarOptout, lerAjuste, gravarAjuste, obterEstabelecimento,
} from '../db.js';
import { dentroDaJanela, limiteDoDia, proximoEnvio } from '../agenda.js';
import { ehOptout } from '../optout.js';
import { proximaTarefa, enviadosNoDia, respostasManuaisPendentes, MAX_TENTATIVAS_MANUAL } from './fila.js';
import { proximaTarefaRemold } from '../remold.js';
import { enviar, telefoneDoLid } from './cliente.js';
import { verificarEstabelecimento } from './verificacao.js';
import { interpretar } from '../atendente/ia.js';
import { aplicarDecisao } from '../atendente/decisao.js';

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
const ESPERA_AGRUPAR_MS = 20000; // junta mensagens seguidas do mesmo contato antes de responder

export function criarRobo({ db, client, anthropic = null, donoWhatsapp = null, log = console, esperaAgruparMs = ESPERA_AGRUPAR_MS, msPorCaractere = 40 }) {
  const envio = { msPorCaractere };
  let donoId = null;
  const pendentes = new Map(); // estabelecimento_id -> timer

  async function avisarDono(texto) {
    if (!donoWhatsapp) return;
    try {
      donoId ??= (await client.getNumberId(donoWhatsapp))?._serialized;
      if (donoId) await client.sendMessage(donoId, texto, { sendSeen: false });
    } catch (e) {
      log.warn('Não consegui avisar o dono:', e.message);
    }
  }

  async function responderComIa(estId) {
    pendentes.delete(estId);
    const est = obterEstabelecimento(db, estId);
    if (!est || est.optout || !anthropic) return;
    const destino = est.whatsapp_id || est.lid;
    try {
      const decisao = await interpretar(anthropic, { est, historico: listarMensagens(db, estId).slice(-20), hoje: new Date() });
      const { resposta, avisarDono: aviso } = aplicarDecisao(db, est, decisao, new Date());
      if (resposta) {
        await enviar(client, destino, resposta, envio);
        registrarMensagem(db, { estabelecimentoId: estId, direcao: 'enviada', texto: resposta, campanha: 'atendente' });
      }
      if (aviso) await avisarDono(aviso);
      log.log(`Atendente: ${est.nome} (${est.cidade}) -> ${decisao.intencao}`);
    } catch (e) {
      log.warn(`Atendente falhou para ${est.nome}: ${e.message}`);
      await avisarDono(`O atendimento automático falhou para ${est.nome} (${est.cidade}). Responda pelo painel. Erro: ${e.message}`);
    }
  }

  async function aoReceber(msg) {
    try {
      if (msg.fromMe || msg.from.endsWith('@g.us') || msg.from === 'status@broadcast') return;
      const ids = [msg.from];
      const numeros = [];
      if (msg.from.endsWith('@lid')) {
        const pn = await telefoneDoLid(client, msg.from);
        if (pn) { ids.push(pn); numeros.push(pn.split('@')[0]); }
      } else {
        numeros.push(msg.from.split('@')[0]);
      }
      try {
        const contato = await msg.getContact();
        if (contato?.id?.user) numeros.push(contato.id.user);
      } catch {
        // segue com o que já temos
      }
      const est = encontrarPorContato(db, { ids, numeros });
      if (!est) return; // conversa normal da empresa: o robô não mexe
      if (msg.from.endsWith('@lid') && !est.lid) atualizarEstabelecimento(db, est.id, { lid: msg.from });

      registrarMensagem(db, { estabelecimentoId: est.id, direcao: 'recebida', texto: msg.body || '[mídia]', campanha: null });

      if (ehOptout(msg.body)) {
        marcarOptout(db, { telefone: est.telefone, whatsapp_id: est.whatsapp_id, lid: msg.from.endsWith('@lid') ? msg.from : est.lid });
        const confirmacao = 'Certo, não enviaremos mais mensagens. Obrigado!';
        await client.sendMessage(msg.from, confirmacao, { sendSeen: false });
        registrarMensagem(db, { estabelecimentoId: est.id, direcao: 'enviada', texto: confirmacao, campanha: 'sistema' });
        return;
      }
      if (est.optout || est.status === 'invalido') return;

      if (anthropic) {
        clearTimeout(pendentes.get(est.id));
        pendentes.set(est.id, setTimeout(() => responderComIa(est.id), esperaAgruparMs));
      } else if (est.status === 'enviado') {
        atualizarEstabelecimento(db, est.id, { status: 'respondeu' });
        await avisarDono(`${est.nome} (${est.cidade}) respondeu: "${msg.body}". Veja no painel.`);
      }
    } catch (e) {
      log.warn('Erro ao processar mensagem recebida:', e.message);
    }
  }

  async function verificarNovos() {
    const aVerificar = listarEstabelecimentos(db).filter((e) => e.telefone && e.tem_whatsapp == null && !e.optout && e.status !== 'invalido');
    for (const e of aVerificar) {
      try {
        atualizarEstabelecimento(db, e.id, await verificarEstabelecimento(client, e));
      } catch (err) {
        log.warn(`Falha ao verificar ${e.nome}: ${err.message}`);
      }
      await esperar(1500 + Math.random() * 2500);
    }
  }

  async function enviarManuais() {
    for (const r of respostasManuaisPendentes(db)) {
      try {
        await enviar(client, r.whatsapp_id || r.lid, r.texto, envio);
        registrarMensagem(db, { estabelecimentoId: r.estabelecimento_id, direcao: 'enviada', texto: r.texto, campanha: 'manual' });
        db.prepare("UPDATE fila_envio SET status = 'enviada' WHERE id = ?").run(r.id);
      } catch (e) {
        const tentativa = r.tentativa + 1;
        db.prepare('UPDATE fila_envio SET tentativa = ?, status = ? WHERE id = ?')
          .run(tentativa, tentativa >= MAX_TENTATIVAS_MANUAL ? 'falhou' : 'pendente', r.id);
        log.warn(`Falha na resposta manual ${r.id}: ${e.message}`);
      }
    }
  }

  let proximoHorario = new Date();
  let falhas = 0;

  async function passoDeEnvio() {
    const agora = new Date();
    if (lerAjuste(db, 'envios_pausados') === '1') return;
    await enviarManuais();
    const inicio = new Date(`${config.envio.inicioCampanha}T08:30:00-03:00`);
    if (!dentroDaJanela(agora) || agora < proximoHorario || enviadosNoDia(db, agora) >= limiteDoDia(inicio, agora)) return;

    const tarefa = proximaTarefa(db, agora) || proximaTarefaRemold(db, agora);
    if (!tarefa) return;
    const { tipo, estabelecimento: e } = tarefa;
    const texto = montarMensagem(tipo, e, config);
    try {
      await enviar(client, e.whatsapp_id, texto, envio);
      registrarMensagem(db, { estabelecimentoId: e.id, direcao: 'enviada', texto, campanha: tipo });
      if (tipo === 'coleta') atualizarEstabelecimento(db, e.id, { status: 'enviado' });
      log.log(`[${agora.toLocaleString('pt-BR')}] ${tipo} -> ${e.nome} (${e.cidade})`);
      falhas = 0;
    } catch (err) {
      falhas++;
      // Só culpa o número se o WhatsApp está conectado; senão é problema de conexão.
      const estado = await client.getState().catch(() => null);
      if (estado === 'CONNECTED') atualizarEstabelecimento(db, e.id, { status: 'invalido' });
      log.warn(`Falha ao enviar para ${e.nome}: ${err.message}${estado === 'CONNECTED' ? ' (número marcado como inválido)' : ''}`);
      if (falhas >= config.envio.falhasParaParar) {
        gravarAjuste(db, 'envios_pausados', '1');
        await avisarDono(`${falhas} falhas seguidas no envio: os envios foram PAUSADOS. Confira o WhatsApp e retome pelo painel.`);
      }
    }
    proximoHorario = proximoEnvio(new Date());
  }

  return { aoReceber, verificarNovos, passoDeEnvio, avisarDono, responderComIa };
}
