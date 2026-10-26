import { test } from 'node:test';
import assert from 'node:assert/strict';
import { abrirBanco, salvarEstabelecimento, listarEstabelecimentos, atualizarEstabelecimento, registrarMensagem, listarMensagens } from '../src/db.js';

test('duplicado mescla e preenche telefone vazio', () => {
  const db = abrirBanco(':memory:');
  const r1 = salvarEstabelecimento(db, { nome: 'Borracharia do Zé', cidade: 'Quatis', lat: -22.5, lng: -44.1, fonte: 'osm' });
  const r2 = salvarEstabelecimento(db, { nome: 'Borracharia do Ze', cidade: 'Quatis', lat: -22.5002, lng: -44.1, telefone: '5524998765432', tipoTelefone: 'celular', fonte: 'maps' });
  assert.equal(r1.novo, true);
  assert.equal(r2.id, r1.id);
  assert.equal(r2.novo, false);
  const todos = listarEstabelecimentos(db);
  assert.equal(todos.length, 1);
  assert.equal(todos[0].telefone, '5524998765432');
  assert.equal(todos[0].status, 'pronto');
});

test('status inicial depende do tipo de telefone', () => {
  const db = abrirBanco(':memory:');
  salvarEstabelecimento(db, { nome: 'Fixo', cidade: 'Piraí', telefone: '552433221100', tipoTelefone: 'fixo', fonte: 'maps' });
  salvarEstabelecimento(db, { nome: 'Sem tel', cidade: 'Piraí', fonte: 'osm' });
  const st = listarEstabelecimentos(db, { cidade: 'Piraí' }).map((e) => e.status).sort();
  assert.deepEqual(st, ['sem_whatsapp', 'sem_whatsapp']);
});

test('filtros, atualização e mensagens', () => {
  const db = abrirBanco(':memory:');
  const { id } = salvarEstabelecimento(db, { nome: 'A', cidade: 'Resende', telefone: '5524998765432', tipoTelefone: 'celular', fonte: 'maps' });
  atualizarEstabelecimento(db, id, { status: 'enviado', trabalha_remold: 'sim' });
  assert.equal(listarEstabelecimentos(db, { status: 'enviado' }).length, 1);
  assert.equal(listarEstabelecimentos(db, { remold: 'sim' }).length, 1);
  registrarMensagem(db, { estabelecimentoId: id, direcao: 'enviada', texto: 'oi', campanha: 'coleta' });
  assert.equal(listarMensagens(db, id).length, 1);
});
