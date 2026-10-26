// Testes que reproduzem os problemas apontados na revisão.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cidadeDoEndereco, enderecoEhDaCidade } from '../src/mapeamento/endereco.js';
import {
  abrirBanco, salvarEstabelecimento, atualizarEstabelecimento, listarEstabelecimentos,
  marcarOptout, encontrarPorContato,
} from '../src/db.js';
import { proximaTarefa, respostasManuaisPendentes } from '../src/whatsapp/fila.js';
import { montarMensagem } from '../config/mensagens.js';

test('Piraí não aceita endereço de Barra do Piraí', () => {
  const end = 'R. Tiradentes, 100 - Centro, Barra do Piraí - RJ, 27123-000';
  assert.equal(cidadeDoEndereco(end), 'Barra do Piraí');
  assert.ok(!enderecoEhDaCidade(end, 'Piraí'));
  assert.ok(enderecoEhDaCidade(end, 'Barra do Piraí'));
  assert.ok(enderecoEhDaCidade('Av. Brasil, 5 - Piraí - RJ, 27175-000', 'Piraí'));
  assert.ok(!enderecoEhDaCidade('Rua X, 1 - Retiro, Volta Redonda - RJ, 27275-000', 'Pinheiral'));
});

test('mesmo telefone em cidades diferentes vira um só cadastro', () => {
  const db = abrirBanco(':memory:');
  const a = salvarEstabelecimento(db, { nome: 'Pneus X', cidade: 'Piraí', telefone: '5524998765401', tipoTelefone: 'celular', fonte: 'maps' });
  const b = salvarEstabelecimento(db, { nome: 'Pneus X', cidade: 'Barra do Piraí', telefone: '5524998765401', tipoTelefone: 'celular', fonte: 'maps' });
  assert.equal(b.id, a.id);
  assert.equal(listarEstabelecimentos(db).length, 1);
});

test('opt-out vale para todos os cadastros do mesmo número', () => {
  const db = abrirBanco(':memory:');
  const a = salvarEstabelecimento(db, { nome: 'A', cidade: 'Quatis', telefone: '5524998765401', tipoTelefone: 'celular', fonte: 'maps' }).id;
  // cadastro antigo duplicado (inserido direto, como num banco de versão anterior)
  db.prepare("INSERT INTO estabelecimentos (nome, cidade, telefone, tipo_telefone, status, whatsapp_id) VALUES ('A2', 'Resende', '5524998765401', 'celular', 'pronto', 'x@c.us')").run();
  atualizarEstabelecimento(db, a, { whatsapp_id: 'x@c.us' });
  marcarOptout(db, { telefone: '5524998765401', whatsapp_id: 'x@c.us' });
  assert.ok(listarEstabelecimentos(db).every((e) => e.optout === 1 && e.status === 'optout'));
});

test('não contata de novo um número já contatado em outro cadastro', () => {
  const db = abrirBanco(':memory:');
  db.prepare("INSERT INTO estabelecimentos (nome, cidade, telefone, tipo_telefone, status, tem_whatsapp) VALUES ('A', 'Quatis', '5524998765401', 'celular', 'enviado', 1)").run();
  db.prepare("INSERT INTO estabelecimentos (nome, cidade, telefone, tipo_telefone, status, tem_whatsapp) VALUES ('A2', 'Resende', '5524998765401', 'celular', 'pronto', 1)").run();
  assert.equal(proximaTarefa(db, new Date('2026-11-03T10:00:00-03:00')), null);
});

test('acha o contato pelo id do WhatsApp, LID ou telefone (com e sem 9º dígito)', () => {
  const db = abrirBanco(':memory:');
  const id = salvarEstabelecimento(db, { nome: 'A', cidade: 'Quatis', telefone: '5524998765401', tipoTelefone: 'celular', fonte: 'maps' }).id;
  atualizarEstabelecimento(db, id, { whatsapp_id: '552498765401@c.us' });
  assert.equal(encontrarPorContato(db, { ids: ['552498765401@c.us'] })?.id, id);
  assert.equal(encontrarPorContato(db, { ids: ['999@lid'], numeros: ['552498765401'] })?.id, id);
  atualizarEstabelecimento(db, id, { lid: '999@lid' });
  assert.equal(encontrarPorContato(db, { ids: ['999@lid'] })?.id, id);
  assert.equal(encontrarPorContato(db, { ids: ['123@lid'], numeros: ['123'] }), undefined);
});

test('respostas manuais não vão para quem pediu para sair nem passam do limite de tentativas', () => {
  const db = abrirBanco(':memory:');
  const a = salvarEstabelecimento(db, { nome: 'A', cidade: 'Quatis', telefone: '5524998765401', tipoTelefone: 'celular', fonte: 'maps' }).id;
  const b = salvarEstabelecimento(db, { nome: 'B', cidade: 'Quatis', telefone: '5524998765402', tipoTelefone: 'celular', fonte: 'maps' }).id;
  db.prepare("INSERT INTO fila_envio (estabelecimento_id, campanha, texto) VALUES (?, 'manual', 'oi')").run(a);
  db.prepare("INSERT INTO fila_envio (estabelecimento_id, campanha, texto, tentativa) VALUES (?, 'manual', 'oi', 3)").run(b);
  marcarOptout(db, { telefone: '5524998765401' });
  assert.equal(respostasManuaisPendentes(db).length, 0);
});

test('preço da mensagem vem da configuração', () => {
  const cfg = { empresa: { nome: 'Remold VR', cidadeBase: 'Volta Redonda' }, ofertaRemold: 'x', precoPorPneu: 2 };
  assert.ok(montarMensagem('coleta', { nome: 'A', cidade: 'Quatis' }, cfg, () => 0).includes('R$ 2,00') || montarMensagem('coleta', { nome: 'A', cidade: 'Quatis' }, cfg, () => 0).includes('R$2,00'));
});

test('painel recusa resposta para contato que pediu para sair e para id inexistente', async () => {
  const { criarApp } = await import('../src/painel/servidor.js');
  const db = abrirBanco(':memory:');
  const a = salvarEstabelecimento(db, { nome: 'A', cidade: 'Quatis', telefone: '5524998765401', tipoTelefone: 'celular', fonte: 'maps' }).id;
  marcarOptout(db, { telefone: '5524998765401' });
  const srv = criarApp(db).listen(0);
  await new Promise((r) => srv.once('listening', r));
  const base = `http://127.0.0.1:${srv.address().port}`;
  const post = (p) => fetch(base + p, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ texto: 'oi' }) });
  assert.equal((await post(`/api/estabelecimentos/${a}/responder`)).status, 409);
  assert.equal((await post('/api/estabelecimentos/999/responder')).status, 404);
  srv.close();
});
