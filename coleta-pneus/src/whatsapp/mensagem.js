// Converte uma mensagem do Baileys num registro simples. Ignora grupos, status e mensagens de sistema.

const IGNORADAS = ['protocolMessage', 'reactionMessage', 'senderKeyDistributionMessage', 'pollUpdateMessage', 'messageContextInfo'];

export function numeroDoJid(jid) {
  const m = /^(\d+)(?::\d+)?@s\.whatsapp\.net$/.exec(jid || '');
  return m ? m[1] : null;
}

function conteudo(message) {
  let m = message;
  for (const casca of ['ephemeralMessage', 'viewOnceMessage', 'viewOnceMessageV2', 'documentWithCaptionMessage']) {
    if (m?.[casca]?.message) m = m[casca].message;
  }
  return m;
}

function textoDe(m) {
  if (m.conversation) return m.conversation;
  if (m.extendedTextMessage?.text) return m.extendedTextMessage.text;
  for (const tipo of ['imageMessage', 'videoMessage', 'documentMessage']) {
    if (m[tipo]) return m[tipo].caption || '[mídia]';
  }
  if (m.audioMessage) return '[áudio]';
  if (m.stickerMessage) return '[figurinha]';
  if (m.locationMessage) return '[localização]';
  if (m.contactMessage) return '[contato]';
  return null;
}

export function extrairMensagem(bruta) {
  const jid = bruta?.key?.remoteJid;
  if (!jid || jid.endsWith('@g.us') || jid === 'status@broadcast' || jid.endsWith('@newsletter')) return null;
  const m = conteudo(bruta.message);
  if (!m || Object.keys(m).every((k) => IGNORADAS.includes(k))) return null;
  const texto = textoDe(m);
  if (texto == null) return null;
  const ts = Number(bruta.messageTimestamp?.low ?? bruta.messageTimestamp ?? Date.now() / 1000);
  return {
    jid,
    jidAlt: bruta.key.remoteJidAlt || null,
    deMim: Boolean(bruta.key.fromMe),
    texto,
    id: bruta.key.id,
    quando: new Date(ts * 1000).toISOString(),
  };
}
