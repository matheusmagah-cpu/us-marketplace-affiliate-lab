// Conexão com o WhatsApp Web (biblioteca não oficial whatsapp-web.js).
import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

export { variacoesDoNumero } from '../telefone.js';

const { Client, LocalAuth } = pkg;
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

export async function criarCliente() {
  const client = new Client({
    authStrategy: new LocalAuth({ dataPath: 'dados/sessao-whatsapp' }),
    puppeteer: { headless: true },
  });
  client.on('qr', (qr) => {
    console.log('Escaneie o QR code com o WhatsApp do chip da coleta (Aparelhos conectados > Conectar aparelho):');
    qrcode.generate(qr, { small: true });
  });
  const pronto = new Promise((resolve) => client.once('ready', resolve));
  await client.initialize();
  await pronto;
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
export async function enviar(client, whatsappId, texto) {
  if (!whatsappId) throw new Error('contato sem id do WhatsApp');
  let chat = null;
  try {
    chat = await client.getChatById(whatsappId);
    await chat.sendStateTyping();
  } catch {
    // segue sem "digitando"
  }
  await esperar(Math.min(15000, 40 * texto.length));
  await client.sendMessage(whatsappId, texto, { sendSeen: false });
  try {
    await chat?.clearState();
  } catch {
    // mensagem já foi enviada
  }
}

