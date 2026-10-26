import { test } from 'node:test';
import assert from 'node:assert/strict';
import { abrirBanco, salvarEstabelecimento, atualizarEstabelecimento, obterEstabelecimento, listarMensagens, listarColetas } from '../src/db.js';
import { criarRobo } from '../src/whatsapp/robo.js';

function cenario(anthropic) {
  const db = abrirBanco(':memory:');
  const id = salvarEstabelecimento(db, { nome: 'Borracharia do Zé', cidade: 'Quatis', telefone: '5524998765401', tipoTelefone: 'celular', fonte: 'maps' }).id;
  atualizarEstabelecimento(db, id, { tem_whatsapp: 1, whatsapp_id: '5524998765401@c.us', status: 'enviado' });
  const enviados = [];
  const client = {
    getNumberId: async (n) => ({ _serialized: n + '@c.us' }),
    getChatById: async () => ({ sendStateTyping: async () => {}, clearState: async () => {} }),
    sendMessage: async (para, texto) => { enviados.push({ para, texto }); },
    getState: async () => 'CONNECTED',
  };
  const silencioso = { log() {}, warn() {} };
  const robo = criarRobo({ db, client, anthropic, donoWhatsapp: '5524999990000', log: silencioso, esperaAgruparMs: 0, msPorCaractere: 0 });
  const msg = (body) => ({ from: '5524998765401@c.us', body, fromMe: false, getContact: async () => ({ id: { user: '5524998765401' } }) });
  return { db, id, robo, enviados, msg };
}

const espera = () => new Promise((r) => setTimeout(r, 50));

test('"sair" vira opt-out sem chamar a IA', async () => {
  let chamou = false;
  const { db, id, robo, enviados, msg } = cenario({ messages: { parse: async () => { chamou = true; } } });
  await robo.aoReceber(msg('SAIR'));
  await espera();
  assert.equal(obterEstabelecimento(db, id).optout, 1);
  assert.equal(chamou, false);
  assert.ok(enviados[0].texto.includes('não enviaremos'));
});

test('resposta aceitando vira coleta agendada e confirmação', async () => {
  const anthropic = { messages: { parse: async () => ({ stop_reason: 'end_turn', parsed_output: {
    intencao: 'aceitou', qtd_pneus: 30, data_coleta: null, trabalha_remold: 'desconhecido', resposta: 'ok', precisa_dono: false, motivo_dono: null,
  } }) } };
  const { db, id, robo, enviados, msg } = cenario(anthropic);
  await robo.aoReceber(msg('pode vir, tenho uns 30'));
  await espera();
  assert.equal(listarColetas(db, { estabelecimentoId: id }).length, 1);
  assert.ok(enviados.at(-1).texto.startsWith('Combinado!'));
  assert.equal(listarMensagens(db, id).length, 2);
});

test('falha da IA avisa o dono e não responde o contato', async () => {
  const { robo, enviados, msg } = cenario({ messages: { parse: async () => { throw new Error('sem crédito'); } } });
  await robo.aoReceber(msg('quanto custa?'));
  await espera();
  assert.equal(enviados.length, 1);
  assert.equal(enviados[0].para, '5524999990000@c.us');
  assert.ok(enviados[0].texto.includes('falhou'));
});

test('mensagem de quem não está na lista é ignorada', async () => {
  const { robo, enviados } = cenario(null);
  await robo.aoReceber({ from: '5521999999999@c.us', body: 'oi', fromMe: false, getContact: async () => ({ id: { user: '5521999999999' } }) });
  assert.equal(enviados.length, 0);
});
