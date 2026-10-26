import { test } from 'node:test';
import assert from 'node:assert/strict';
import { elegivelRemold, proximaTarefaRemold } from '../src/remold.js';
import { abrirBanco, salvarEstabelecimento, atualizarEstabelecimento, registrarMensagem } from '../src/db.js';

test('elegibilidade da campanha remold', () => {
  assert.ok(elegivelRemold({ status: 'recolhido', optout: 0 }, false));
  assert.ok(elegivelRemold({ status: 'aceitou', optout: 0 }, false));
  assert.ok(elegivelRemold({ status: 'coleta_agendada', optout: 0 }, false));
  for (const s of ['enviado', 'respondeu', 'recusou', 'pronto']) assert.ok(!elegivelRemold({ status: s, optout: 0 }, false), s);
  assert.ok(!elegivelRemold({ status: 'recolhido', optout: 1 }, false));
  assert.ok(!elegivelRemold({ status: 'recolhido', optout: 0 }, true));
});

test('próxima tarefa remold pula quem já recebeu', () => {
  const db = abrirBanco(':memory:');
  const a = salvarEstabelecimento(db, { nome: 'A', cidade: 'Piraí', telefone: '5524998765401', tipoTelefone: 'celular', fonte: 'maps' }).id;
  const b = salvarEstabelecimento(db, { nome: 'B', cidade: 'Piraí', telefone: '5524998765402', tipoTelefone: 'celular', fonte: 'maps' }).id;
  atualizarEstabelecimento(db, a, { status: 'recolhido', tem_whatsapp: 1, whatsapp_id: 'a@c.us' });
  atualizarEstabelecimento(db, b, { status: 'aceitou', tem_whatsapp: 1, whatsapp_id: 'b@c.us' });
  registrarMensagem(db, { estabelecimentoId: a, direcao: 'enviada', texto: 'x', campanha: 'remold' });
  const t = proximaTarefaRemold(db);
  assert.equal(t.tipo, 'remold');
  assert.equal(t.estabelecimento.id, b);
});
