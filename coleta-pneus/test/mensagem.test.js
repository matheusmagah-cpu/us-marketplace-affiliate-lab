import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extrairMensagem, numeroDoJid } from '../src/whatsapp/mensagem.js';
import { abrirBanco, registrarWhatsapp, conversasRecentes, lerChat } from '../src/db.js';

const base = (msg, key = {}) => ({ key: { remoteJid: '5524998765401@s.whatsapp.net', fromMe: false, id: 'ABC', ...key }, messageTimestamp: 1793000000, message: msg });

test('texto simples, texto estendido e legenda', () => {
  assert.equal(extrairMensagem(base({ conversation: 'oi' })).texto, 'oi');
  assert.equal(extrairMensagem(base({ extendedTextMessage: { text: 'link aqui' } })).texto, 'link aqui');
  assert.equal(extrairMensagem(base({ imageMessage: { caption: 'foto dos pneus' } })).texto, 'foto dos pneus');
  assert.equal(extrairMensagem(base({ imageMessage: {} })).texto, '[mídia]');
  assert.equal(extrairMensagem(base({ ephemeralMessage: { message: { conversation: 'some' } } })).texto, 'some');
});

test('campos principais e LID com telefone alternativo', () => {
  const m = extrairMensagem(base({ conversation: 'oi' }, { remoteJid: '12345@lid', remoteJidAlt: '5524998765401@s.whatsapp.net', fromMe: true, id: 'X1' }));
  assert.deepEqual(m, { jid: '12345@lid', jidAlt: '5524998765401@s.whatsapp.net', deMim: true, texto: 'oi', id: 'X1', quando: new Date(1793000000 * 1000).toISOString() });
});

test('ignora grupos, status, reações e mensagens de protocolo', () => {
  assert.equal(extrairMensagem(base({ conversation: 'x' }, { remoteJid: '123@g.us' })), null);
  assert.equal(extrairMensagem(base({ conversation: 'x' }, { remoteJid: 'status@broadcast' })), null);
  assert.equal(extrairMensagem(base({ reactionMessage: { text: '👍' } })), null);
  assert.equal(extrairMensagem(base({ protocolMessage: {} })), null);
  assert.equal(extrairMensagem(base(null)), null);
});

test('número a partir do jid', () => {
  assert.equal(numeroDoJid('5524998765401@s.whatsapp.net'), '5524998765401');
  assert.equal(numeroDoJid('5524998765401:12@s.whatsapp.net'), '5524998765401');
  assert.equal(numeroDoJid('123@lid'), null);
});

test('registro de conversas é idempotente e consultável', () => {
  const db = abrirBanco(':memory:');
  const m = { jid: '5524998765401@s.whatsapp.net', jidAlt: null, deMim: false, texto: 'oi', id: 'A1', quando: '2026-11-03T13:00:00.000Z' };
  registrarWhatsapp(db, m);
  registrarWhatsapp(db, m);
  registrarWhatsapp(db, { ...m, id: 'A2', deMim: true, texto: 'olá', quando: '2026-11-03T13:01:00.000Z' }, { peloRobo: true });
  assert.equal(lerChat(db, '5524998765401').length, 2);
  const [c] = conversasRecentes(db);
  assert.equal(c.numero, '5524998765401');
  assert.equal(c.ultima_mensagem, 'olá');
  assert.equal(c.total, 2);
});
