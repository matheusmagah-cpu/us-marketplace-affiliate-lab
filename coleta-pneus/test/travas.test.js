import { test } from 'node:test';
import assert from 'node:assert/strict';
import { abrirBanco, salvarEstabelecimento, atualizarEstabelecimento, registrarMensagem, obterEstabelecimento } from '../src/db.js';
import { podeResponder } from '../src/atendente/travas.js';
import { ehOptout } from '../src/optout.js';

const agora = new Date('2026-11-03T12:00:00-03:00');
function novo() {
  const db = abrirBanco(':memory:');
  const id = salvarEstabelecimento(db, { nome: 'A', cidade: 'Quatis', telefone: '5524998765401', tipoTelefone: 'celular', fonte: 'maps' }).id;
  return { db, id, est: () => obterEstabelecimento(db, id) };
}
const msg = (db, id, direcao, texto, campanha, dataHora) => registrarMensagem(db, { estabelecimentoId: id, direcao, texto, campanha, dataHora });

test('só responde quem foi prospectado', () => {
  const { db, id, est } = novo();
  msg(db, id, 'recebida', 'oi, tudo bem?', null, '2026-11-03T14:00:00.000Z');
  assert.deepEqual(podeResponder(db, est(), agora), { ok: false, motivo: 'nao_prospectado' });
  msg(db, id, 'enviada', 'Bom dia...', 'coleta', '2026-11-03T13:00:00.000Z');
  assert.deepEqual(podeResponder(db, est(), agora), { ok: true, motivo: null });
});

test('pausa quando o dono assumiu', () => {
  const { db, id, est } = novo();
  msg(db, id, 'enviada', 'Bom dia...', 'coleta', '2026-11-03T13:00:00.000Z');
  atualizarEstabelecimento(db, id, { pausado_ate: '2026-11-04T00:00:00.000Z' });
  assert.equal(podeResponder(db, est(), agora).motivo, 'dono_assumiu');
  assert.equal(podeResponder(db, est(), new Date('2026-11-04T10:00:00-03:00')).ok, true);
});

test('teto de 8 respostas em 24 h', () => {
  const { db, id, est } = novo();
  msg(db, id, 'enviada', 'Bom dia...', 'coleta', '2026-11-02T13:00:00.000Z');
  for (let i = 0; i < 8; i++) msg(db, id, 'enviada', `r${i}`, 'atendente', `2026-11-03T1${i}:00:00.000Z`.replace('T18', 'T08').replace('T19', 'T09'));
  assert.equal(podeResponder(db, est(), new Date('2026-11-03T15:00:00-03:00')).motivo, 'teto');
});

test('para quando o outro lado repete a mesma mensagem (robô)', () => {
  const { db, id, est } = novo();
  msg(db, id, 'enviada', 'Bom dia...', 'coleta', '2026-11-03T13:00:00.000Z');
  msg(db, id, 'recebida', 'Olá! Nosso horário de atendimento é das 8h às 18h.', null, '2026-11-03T13:01:00.000Z');
  msg(db, id, 'enviada', 'Obrigado!', 'atendente', '2026-11-03T13:02:00.000Z');
  msg(db, id, 'recebida', 'Olá! Nosso horário de atendimento é das 8h às 18h.', null, '2026-11-03T13:03:00.000Z');
  assert.equal(podeResponder(db, est(), agora).motivo, 'repeticao');
});

test('"não" solto não é opt-out; pedido explícito é', () => {
  assert.ok(!ehOptout('Não'));
  assert.ok(!ehOptout('nao'));
  assert.ok(ehOptout('sair'));
  assert.ok(ehOptout('não quero receber'));
});
