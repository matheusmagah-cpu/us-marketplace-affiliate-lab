import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { criarConexao } from '../src/whatsapp/conexao.js';

function fabricaFalsa() {
  const sockets = [];
  const fabrica = () => {
    const ev = new EventEmitter();
    const s = {
      ev,
      fechado: false,
      end() { this.fechado = true; },
      onWhatsApp: async (n) => (n === '5524000000000' ? [{ exists: false }] : [{ exists: true, jid: n + '@s.whatsapp.net' }]),
      getBusinessProfile: async () => ({ description: 'loja' }),
      presenceSubscribe: async () => {},
      sendPresenceUpdate: async () => {},
      sendMessage: async () => ({ key: { id: 'MSG' + sockets.length } }),
    };
    sockets.push(s);
    return s;
  };
  return { fabrica, sockets };
}

const opcoes = (fabrica, extra = {}) => ({
  fabricaSocket: fabrica,
  carregarSessao: async () => ({ state: {}, saveCreds: () => {} }),
  versaoWhatsapp: async () => undefined,
  log: { log() {}, warn() {}, error() {} },
  pastaSessao: '/tmp/claude-0/sessao-teste-inexistente',
  ...extra,
});
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

test('reconecta com um único socket ativo', async () => {
  const { fabrica, sockets } = fabricaFalsa();
  const estados = [];
  const c = criarConexao(opcoes(fabrica, { aoMudar: (e) => estados.push(e) }));
  await c.iniciar();
  sockets[0].ev.emit('connection.update', { connection: 'open' });
  assert.ok(c.estaConectado());
  sockets[0].ev.emit('connection.update', { connection: 'close', lastDisconnect: { error: { output: { statusCode: 428 } } } });
  sockets[0].ev.emit('connection.update', { connection: 'close', lastDisconnect: { error: { output: { statusCode: 428 } } } });
  await espera(2200);
  assert.equal(sockets.length, 2);
  assert.ok(sockets[0].fechado);
  assert.equal(sockets[0].ev.listenerCount('messages.upsert'), 0);
  assert.deepEqual(estados, ['conectado', 'reconectando', 'reconectando']);
  c.parar();
});

test('número verificado e envio registra id do robô', async () => {
  const { fabrica, sockets } = fabricaFalsa();
  const recebidas = [];
  const c = criarConexao(opcoes(fabrica, { aoMensagem: (m) => recebidas.push(m) }));
  await c.iniciar();
  await assert.rejects(c.numeroNoWhatsapp('5524998765401'), /desconectado/);
  sockets[0].ev.emit('connection.update', { connection: 'open' });
  assert.deepEqual(await c.numeroNoWhatsapp('5524998765401'), { existe: true, jid: '5524998765401@s.whatsapp.net', ehBusiness: true });
  assert.equal((await c.numeroNoWhatsapp('5524000000000')).existe, false);
  const id = await c.enviarTexto('5524998765401@s.whatsapp.net', 'oi', { msPorCaractere: 0 });
  sockets[0].ev.emit('messages.upsert', { type: 'notify', messages: [
    { key: { remoteJid: '5524998765401@s.whatsapp.net', fromMe: true, id }, messageTimestamp: 1, message: { conversation: 'oi' } },
    { key: { remoteJid: '5524998765401@s.whatsapp.net', fromMe: true, id: 'MANUAL' }, messageTimestamp: 2, message: { conversation: 'do dono' } },
  ] });
  await espera(10);
  assert.deepEqual(recebidas.map((m) => [m.peloRobo, m.tempoReal]), [[true, true], [false, true]]);
  c.parar();
});
