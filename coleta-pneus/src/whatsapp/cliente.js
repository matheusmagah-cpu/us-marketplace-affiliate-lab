// Conexão com o WhatsApp Web (biblioteca não oficial whatsapp-web.js).
import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright';

export { variacoesDoNumero } from '../telefone.js';

const { Client, LocalAuth } = pkg;
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

// Usa o Chromium do Playwright (funciona também em servidor ARM, como o da Oracle grátis).
function caminhoDoNavegador() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const doPlaywright = chromium.executablePath();
  return existsSync(doPlaywright) ? doPlaywright : undefined;
}

// aoMudar(estado, qr) é chamado com 'aguardando_qr' (e o texto do QR), 'conectado' e 'desconectado'.
export async function criarCliente({ aoMudar = () => {}, mostrarQrNoTerminal = true } = {}) {
  const client = new Client({
    authStrategy: new LocalAuth({ dataPath: 'dados/sessao-whatsapp' }),
    puppeteer: { headless: true, executablePath: caminhoDoNavegador(), args: ['--no-sandbox', '--disable-dev-shm-usage'] },
  });
  client.on('qr', (qr) => {
    aoMudar('aguardando_qr', qr);
    if (mostrarQrNoTerminal) {
      console.log('Escaneie o QR code com o WhatsApp (Aparelhos conectados > Conectar aparelho):');
      qrcode.generate(qr, { small: true });
    }
  });
  client.on('disconnected', (motivo) => {
    console.warn('WhatsApp desconectado:', motivo);
    aoMudar('desconectado', null);
  });
  const pronto = new Promise((resolve) => client.once('ready', resolve));
  await client.initialize();
  await pronto;
  aoMudar('conectado', null);
  console.log('WhatsApp conectado.');
  return client;
}

// Retorna o id do WhatsApp (ex.: 552498765432@c.us) ou null se o número não tem WhatsApp.
export async function verificarNumero(client, numero) {
  const id = await client.getNumberId(numero);
  return id ? id._serialized : null;
}

// Resolve o id @c.us (telefone) de quem escreveu de um id @lid.
export async function telefoneDoLid(client, lid) {
  try {
    const [r] = await client.getContactLidAndPhone([lid]);
    return r?.pn ?? null;
  } catch {
    return null;
  }
}

// Envia simulando digitação. Só lança erro se a mensagem em si falhar;
// falhas de "digitando" e de limpeza depois do envio são ignoradas para não reenviar.
export async function enviar(client, whatsappId, texto, { msPorCaractere = 40 } = {}) {
  if (!whatsappId) throw new Error('contato sem id do WhatsApp');
  let chat = null;
  try {
    chat = await client.getChatById(whatsappId);
    await chat.sendStateTyping();
  } catch {
    // segue sem "digitando"
  }
  await esperar(Math.min(15000, msPorCaractere * texto.length));
  await client.sendMessage(whatsappId, texto, { sendSeen: false });
  try {
    await chat?.clearState();
  } catch {
    // mensagem já foi enviada
  }
}

