// Conexão com o WhatsApp Web (biblioteca não oficial whatsapp-web.js).
import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

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

export async function enviar(client, whatsappId, texto) {
  const chat = await client.getChatById(whatsappId);
  await chat.sendStateTyping();
  await esperar(Math.min(15000, 40 * texto.length));
  await client.sendMessage(whatsappId, texto);
  await chat.clearState();
}

// Variações do número para achar o contato (com e sem o 9º dígito).
export function variacoesDoNumero(numero) {
  const d = String(numero || '').replace(/\D/g, '');
  const vars = new Set([d]);
  if (d.length === 13 && d[4] === '9') vars.add(d.slice(0, 4) + d.slice(5));
  if (d.length === 12) vars.add(d.slice(0, 4) + '9' + d.slice(4));
  return [...vars];
}
