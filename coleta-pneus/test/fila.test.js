import { test } from 'node:test';
import assert from 'node:assert/strict';
import { abrirBanco, salvarEstabelecimento, atualizarEstabelecimento, registrarMensagem } from '../src/db.js';
import { proximaTarefa, enviadosNoDia } from '../src/whatsapp/fila.js';

function novoBanco() {
  const db = abrirBanco(':memory:');
  const a = salvarEstabelecimento(db, { nome: 'A', cidade: 'Quatis', telefone: '5524998765401', tipoTelefone: 'celular', fonte: 'maps' }).id;
  const b = salvarEstabelecimento(db, { nome: 'B', cidade: 'Quatis', telefone: '5524998765402', tipoTelefone: 'celular', fonte: 'maps' }).id;
  atualizarEstabelecimento(db, a, { tem_whatsapp: 1 });
  atualizarEstabelecimento(db, b, { tem_whatsapp: 1 });
  return { db, a, b };
}

const agora = new Date('2026-11-11T10:00:00-03:00');

test('nunca escolhe quem pediu para sair', () => {
  const { db, a, b } = novoBanco();
  atualizarEstabelecimento(db, a, { optout: 1, status: 'optout' });
  assert.equal(proximaTarefa(db, agora).estabelecimento.id, b);
  atualizarEstabelecimento(db, b, { optout: 1, status: 'optout' });
  assert.equal(proximaTarefa(db, agora), null);
});

test('não escolhe sem WhatsApp confirmado', () => {
  const { db, a, b } = novoBanco();
  atualizarEstabelecimento(db, a, { tem_whatsapp: 0 });
  atualizarEstabelecimento(db, b, { tem_whatsapp: null });
  assert.equal(proximaTarefa(db, agora), null);
});

test('lembrete após 3 dias úteis sem resposta, só uma vez', () => {
  const { db, a, b } = novoBanco();
  atualizarEstabelecimento(db, b, { optout: 1, status: 'optout' });
  atualizarEstabelecimento(db, a, { status: 'enviado' });
  registrarMensagem(db, { estabelecimentoId: a, direcao: 'enviada', texto: 'x', campanha: 'coleta', dataHora: '2026-11-06T13:00:00.000Z' });
  const t = proximaTarefa(db, agora);
  assert.equal(t.tipo, 'lembrete');
  registrarMensagem(db, { estabelecimentoId: a, direcao: 'enviada', texto: 'y', campanha: 'lembrete', dataHora: agora.toISOString() });
  assert.equal(proximaTarefa(db, new Date('2026-11-25T10:00:00-03:00')), null);
});

test('conta só envios de campanha do dia', () => {
  const { db, a } = novoBanco();
  registrarMensagem(db, { estabelecimentoId: a, direcao: 'enviada', texto: 'x', campanha: 'coleta', dataHora: '2026-11-11T12:00:00.000Z' });
  registrarMensagem(db, { estabelecimentoId: a, direcao: 'enviada', texto: 'x', campanha: 'manual', dataHora: '2026-11-11T12:10:00.000Z' });
  registrarMensagem(db, { estabelecimentoId: a, direcao: 'enviada', texto: 'x', campanha: 'coleta', dataHora: '2026-11-10T12:00:00.000Z' });
  assert.equal(enviadosNoDia(db, agora), 1);
});
