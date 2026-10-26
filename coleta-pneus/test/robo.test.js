import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  abrirBanco, salvarEstabelecimento, atualizarEstabelecimento, obterEstabelecimento, listarMensagens, listarColetas, registrarMensagem, lerChat,
} from '../src/db.js';
import { criarRobo } from '../src/whatsapp/robo.js';

const JID = '5524998765401@s.whatsapp.net';
const base = { qtd_pneus: null, data_coleta: null, trabalha_remold: 'desconhecido', resposta: 'ok', precisa_dono: false, motivo_dono: null };

function cenario({ decidir = async () => ({ ...base, intencao: 'outro', resposta: '' }), prospectado = true } = {}) {
  const db = abrirBanco(':memory:');
  const id = salvarEstabelecimento(db, { nome: 'Borracharia do Zé', cidade: 'Quatis', telefone: '5524998765401', tipoTelefone: 'celular', fonte: 'maps' }).id;
  atualizarEstabelecimento(db, id, { tem_whatsapp: 1, whatsapp_id: JID, status: 'enviado' });
  if (prospectado) registrarMensagem(db, { estabelecimentoId: id, direcao: 'enviada', texto: 'Bom dia...', campanha: 'coleta' });
  const enviados = [];
  const conexao = {
    estaConectado: () => true,
    numeroNoWhatsapp: async (n) => ({ existe: true, jid: n + '@s.whatsapp.net', ehBusiness: false }),
    enviarTexto: async (jid, texto) => { enviados.push({ jid, texto }); return 'id' + enviados.length; },
    telefoneDoLid: async () => null,
  };
  let chamadas = 0;
  const robo = criarRobo({
    db, conexao, decidir: async (a) => { chamadas++; return decidir(a); }, donoNumero: '5524999990000',
    log: { log() {}, warn() {} }, esperaAgruparMs: 0, msPorCaractere: 0,
  });
  const msg = (texto, extra = {}) => ({ jid: JID, jidAlt: null, deMim: false, texto, id: 'M' + Math.random(), quando: new Date().toISOString(), tempoReal: true, peloRobo: false, ...extra });
  return { db, id, robo, enviados, msg, chamadas: () => chamadas };
}
const espera = () => new Promise((r) => setTimeout(r, 30));

test('aceite agenda coleta e confirma; tudo fica no rastreamento', async () => {
  const { db, id, robo, enviados, msg } = cenario({ decidir: async () => ({ ...base, intencao: 'aceitou', qtd_pneus: 30 }) });
  await robo.aoMensagem(msg('pode vir, tenho 30'));
  await espera();
  assert.equal(listarColetas(db, { estabelecimentoId: id }).length, 1);
  assert.ok(enviados.at(-1).texto.startsWith('Combinado!'));
  assert.equal(lerChat(db, '5524998765401').length, 1);
  assert.equal(obterEstabelecimento(db, id).status, 'coleta_agendada');
});

test('cliente normal (não prospectado) não recebe resposta', async () => {
  const { robo, enviados, msg, chamadas } = cenario({ prospectado: false });
  await robo.aoMensagem(msg('bom dia, tem pneu 175/70 aro 13?'));
  await espera();
  assert.equal(enviados.length, 0);
  assert.equal(chamadas(), 0);
});

test('contato fora da lista é só registrado', async () => {
  const { db, robo, enviados, msg } = cenario();
  await robo.aoMensagem(msg('oi', { jid: '5521999999999@s.whatsapp.net' }));
  await espera();
  assert.equal(enviados.length, 0);
  assert.equal(lerChat(db, '5521999999999').length, 1);
});

test('dono escreveu pelo celular: atendente pausa o contato', async () => {
  const { db, id, robo, enviados, msg, chamadas } = cenario({ decidir: async () => ({ ...base, intencao: 'pergunta', resposta: 'Claro!' }) });
  await robo.aoMensagem(msg('Fala Zé, aqui é o dono, passo aí amanhã', { deMim: true }));
  await robo.aoMensagem(msg('beleza'));
  await espera();
  assert.ok(obterEstabelecimento(db, id).pausado_ate);
  assert.equal(chamadas(), 0);
  assert.equal(enviados.length, 0);
});

test('mensagem enviada pelo próprio robô não pausa nada', async () => {
  const { db, id, robo, msg } = cenario();
  await robo.aoMensagem(msg('Bom dia...', { deMim: true, peloRobo: true }));
  assert.equal(obterEstabelecimento(db, id).pausado_ate, null);
});

test('"sair" vira opt-out sem chamar o Claude', async () => {
  const { db, id, robo, enviados, msg, chamadas } = cenario();
  await robo.aoMensagem(msg('SAIR'));
  await espera();
  assert.equal(obterEstabelecimento(db, id).optout, 1);
  assert.equal(chamadas(), 0);
  assert.ok(enviados[0].texto.includes('não enviaremos'));
});

test('resposta vazia (ex.: "ok") não envia nada', async () => {
  const { robo, enviados, msg } = cenario();
  await robo.aoMensagem(msg('ok'));
  await espera();
  assert.equal(enviados.length, 0);
});

test('robô do outro lado repetindo: para e avisa o dono uma vez', async () => {
  const { robo, enviados, msg, chamadas } = cenario({ decidir: async () => ({ ...base, intencao: 'outro', resposta: 'Obrigado!' }) });
  const auto = 'Olá! Nosso horário de atendimento é das 8h às 18h.';
  await robo.aoMensagem(msg(auto)); await espera();
  await robo.aoMensagem(msg(auto)); await espera();
  await robo.aoMensagem(msg(auto)); await espera();
  assert.equal(chamadas(), 1);
  const avisos = enviados.filter((e) => e.jid === '5524999990000@s.whatsapp.net');
  assert.equal(avisos.length, 1);
});

test('falha do Claude avisa o dono e não inventa resposta', async () => {
  const { robo, enviados, msg } = cenario({ decidir: async () => { throw new Error('limite da assinatura'); } });
  await robo.aoMensagem(msg('quanto custa?'));
  await espera();
  assert.equal(enviados.length, 1);
  assert.equal(enviados[0].jid, '5524999990000@s.whatsapp.net');
  assert.ok(enviados[0].texto.includes('limite da assinatura'));
});

test('"sair" enquanto o Claude decide: a resposta não é enviada', async () => {
  let liberar;
  const { db, id, robo, enviados, msg } = cenario({
    decidir: () => new Promise((r) => { liberar = () => r({ ...base, intencao: 'aceitou', qtd_pneus: 10 }); }),
  });
  await robo.aoMensagem(msg('oi'));
  await espera();
  await robo.aoMensagem(msg('sair'));
  liberar();
  await espera();
  assert.equal(obterEstabelecimento(db, id).optout, 1);
  assert.equal(listarColetas(db, { estabelecimentoId: id }).length, 0);
  assert.ok(enviados.every((e) => !e.texto.startsWith('Combinado')));
});

test('mensagem nova durante a decisão: decide de novo e responde uma vez só', async () => {
  const liberar = [];
  const { robo, enviados, msg, chamadas } = cenario({
    decidir: () => new Promise((r) => liberar.push(() => r({ ...base, intencao: 'pergunta', resposta: 'Claro!' }))),
  });
  await robo.aoMensagem(msg('oi'));
  await espera();
  await robo.aoMensagem(msg('quanto paga?'));
  await espera();
  liberar.shift()();
  await espera();
  liberar.shift()();
  await espera();
  assert.equal(chamadas(), 2);
  assert.equal(enviados.length, 1);
});

test('contato que já saiu não recebe confirmação de novo (sem loop com resposta automática)', async () => {
  const { db, id, robo, enviados, msg } = cenario();
  atualizarEstabelecimento(db, id, { optout: 1 });
  await robo.aoMensagem(msg('sair'));
  await espera();
  assert.equal(enviados.length, 0);
});

test('falha ao enviar a resposta deixa ela na fila para reenviar', async () => {
  const { db, msg } = cenario();
  const r2 = criarRobo({
    db, decidir: async () => ({ ...base, intencao: 'aceitou', qtd_pneus: 5 }), log: { log() {}, warn() {} }, esperaAgruparMs: 0, msPorCaractere: 0,
    conexao: { estaConectado: () => true, telefoneDoLid: async () => null, numeroNoWhatsapp: async () => ({}), enviarTexto: async () => { throw new Error('caiu'); } },
  });
  await r2.aoMensagem(msg('pode vir'));
  await espera();
  const fila = db.prepare("SELECT texto FROM fila_envio WHERE status = 'pendente'").all();
  assert.equal(fila.length, 1);
  assert.ok(fila[0].texto.startsWith('Combinado!'));
});
