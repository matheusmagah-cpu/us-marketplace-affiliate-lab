import { test } from 'node:test';
import assert from 'node:assert/strict';
import { abrirBanco, salvarEstabelecimento, atualizarEstabelecimento, obterEstabelecimento, listarColetas } from '../src/db.js';
import { aplicarDecisao, proximoDiaUtil } from '../src/atendente/decisao.js';
import { interpretar, ErroAtendente } from '../src/atendente/ia.js';

const agora = new Date('2026-11-06T10:00:00-03:00'); // sexta
const base = { qtd_pneus: null, data_coleta: null, trabalha_remold: 'desconhecido', resposta: 'Ok!', precisa_dono: false, motivo_dono: null };

function novo() {
  const db = abrirBanco(':memory:');
  const id = salvarEstabelecimento(db, { nome: 'Borracharia do Zé', cidade: 'Quatis', telefone: '5524998765401', tipoTelefone: 'celular', fonte: 'maps' }).id;
  atualizarEstabelecimento(db, id, { status: 'enviado', tem_whatsapp: 1 });
  return { db, est: obterEstabelecimento(db, id) };
}

test('próximo dia útil pula fim de semana', () => {
  assert.equal(proximoDiaUtil(agora), '2026-11-09');
  assert.equal(proximoDiaUtil(new Date('2026-11-03T10:00:00-03:00')), '2026-11-04');
});

test('aceitou com data agenda e confirma com valor', () => {
  const { db, est } = novo();
  const r = aplicarDecisao(db, est, { ...base, intencao: 'aceitou', qtd_pneus: 40, data_coleta: '2026-11-11' }, agora);
  const [c] = listarColetas(db, { estabelecimentoId: est.id });
  assert.equal(c.data_prevista, '2026-11-11');
  assert.equal(c.qtd_pneus_prevista, 40);
  assert.equal(obterEstabelecimento(db, est.id).status, 'coleta_agendada');
  assert.ok(r.resposta.includes('11/11'));
  assert.ok(r.resposta.includes('R$1,50'));
  assert.equal(r.avisarDono, null);
});

test('aceitou sem data, com data passada ou num domingo vai para o próximo dia útil', () => {
  for (const data of [null, '2026-11-01', '2026-11-08', 'amanhã']) {
    const { db, est } = novo();
    aplicarDecisao(db, est, { ...base, intencao: 'aceitou', data_coleta: data }, agora);
    assert.equal(listarColetas(db, { estabelecimentoId: est.id })[0].data_prevista, '2026-11-09', String(data));
  }
});

test('aceitar de novo atualiza a coleta em vez de duplicar', () => {
  const { db, est } = novo();
  aplicarDecisao(db, est, { ...base, intencao: 'aceitou', qtd_pneus: 10, data_coleta: '2026-11-11' }, agora);
  aplicarDecisao(db, obterEstabelecimento(db, est.id), { ...base, intencao: 'aceitou', qtd_pneus: 25, data_coleta: '2026-11-12' }, agora);
  const coletas = listarColetas(db, { estabelecimentoId: est.id });
  assert.equal(coletas.length, 1);
  assert.equal(coletas[0].qtd_pneus_prevista, 25);
  assert.equal(coletas[0].data_prevista, '2026-11-12');
});

test('recusou, opt-out e número errado', () => {
  let { db, est } = novo();
  aplicarDecisao(db, est, { ...base, intencao: 'recusou' }, agora);
  assert.equal(obterEstabelecimento(db, est.id).status, 'recusou');
  ({ db, est } = novo());
  const r = aplicarDecisao(db, est, { ...base, intencao: 'optout' }, agora);
  assert.equal(obterEstabelecimento(db, est.id).optout, 1);
  assert.ok(r.resposta);
  ({ db, est } = novo());
  aplicarDecisao(db, est, { ...base, intencao: 'numero_errado' }, agora);
  assert.equal(obterEstabelecimento(db, est.id).status, 'invalido');
});

test('pergunta que precisa do dono avisa e marca respondeu; remold é gravado', () => {
  const { db, est } = novo();
  const r = aplicarDecisao(db, est, { ...base, intencao: 'pergunta', trabalha_remold: 'sim', resposta: 'Vou confirmar e te retorno!', precisa_dono: true, motivo_dono: 'Quer saber se recolhe pneu de caminhão' }, agora);
  assert.equal(r.resposta, 'Vou confirmar e te retorno!');
  assert.ok(r.avisarDono.includes('caminhão'));
  assert.ok(r.avisarDono.includes('Borracharia do Zé'));
  const e = obterEstabelecimento(db, est.id);
  assert.equal(e.status, 'respondeu');
  assert.equal(e.trabalha_remold, 'sim');
});

test('interpretar usa o modelo barato e devolve a decisão', async () => {
  let pedido;
  const cliente = { messages: { parse: async (p) => { pedido = p; return { stop_reason: 'end_turn', parsed_output: { ...base, intencao: 'aceitou' } }; } } };
  const d = await interpretar(cliente, { est: { nome: 'A', cidade: 'Quatis' }, historico: [{ direcao: 'recebida', texto: 'pode vir' }], hoje: agora });
  assert.equal(d.intencao, 'aceitou');
  assert.equal(pedido.model, 'claude-haiku-5-5');
  assert.ok(pedido.messages[0].content.includes('pode vir'));
});

test('interpretar lança erro quando a API falha ou recusa', async () => {
  const falha = { messages: { parse: async () => { throw new Error('rede'); } } };
  await assert.rejects(interpretar(falha, { est: { nome: 'A', cidade: 'Q' }, historico: [], hoje: agora }), ErroAtendente);
  const recusa = { messages: { parse: async () => ({ stop_reason: 'refusal', parsed_output: null }) } };
  await assert.rejects(interpretar(recusa, { est: { nome: 'A', cidade: 'Q' }, historico: [], hoje: agora }), ErroAtendente);
});

test('coleta pedida para sábado vai para o próximo dia útil (a rota só cobre seg–sex)', () => {
  const { db, est } = novo();
  aplicarDecisao(db, est, { ...base, intencao: 'aceitou', qtd_pneus: 10, data_coleta: '2026-11-07' }, agora);
  assert.equal(listarColetas(db, { estabelecimentoId: est.id })[0].data_prevista, '2026-11-09');
});
