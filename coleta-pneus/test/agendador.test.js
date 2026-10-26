import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tarefasDevidas, textoRota } from '../src/agendador.js';
import { abrirBanco, salvarEstabelecimento, atualizarEstabelecimento, salvarColeta, atualizarColeta, registrarMensagem } from '../src/db.js';
import { proximaTarefaRemold } from '../src/remold.js';

const d = (s) => new Date(s);

test('rota diária às 17h de segunda a sexta, uma vez por dia', () => {
  assert.deepEqual(tarefasDevidas(d('2026-11-04T16:59:00-03:00'), {}), []);
  assert.deepEqual(tarefasDevidas(d('2026-11-04T17:00:00-03:00'), {}), ['rota_diaria']);
  assert.deepEqual(tarefasDevidas(d('2026-11-04T19:00:00-03:00'), { rota_diaria: '2026-11-04' }), []);
  assert.deepEqual(tarefasDevidas(d('2026-11-07T17:30:00-03:00'), {}), []); // sábado
});

test('remapeamento segunda a partir das 6h, uma vez', () => {
  assert.deepEqual(tarefasDevidas(d('2026-11-09T06:30:00-03:00'), {}), ['remapeamento']);
  assert.deepEqual(tarefasDevidas(d('2026-11-09T07:00:00-03:00'), { remapeamento: '2026-11-09' }), []);
  assert.deepEqual(tarefasDevidas(d('2026-11-10T06:30:00-03:00'), {}), []);
});

test('texto da rota com links, paradas e total', () => {
  const rota = {
    rotas: [{ link: 'https://maps/1', paradas: [{ nome: 'Pneus A', cidade: 'Quatis', endereco: 'Rua A, 1', qtd_pneus_prevista: 30, telefone: '5524998765401' }] }],
    semCoordenadas: [{ nome: 'Pneus B', cidade: 'Piraí', endereco: null, qtd_pneus_prevista: 10 }],
    totalPneus: 40,
    totalValor: 60,
  };
  const t = textoRota(rota, '2026-11-11');
  for (const parte of ['11/11', 'https://maps/1', 'Pneus A', 'Quatis', '30 pneus', 'R$60,00', 'Pneus B']) assert.ok(t.includes(parte), parte);
  assert.ok(textoRota({ rotas: [], semCoordenadas: [], totalPneus: 0, totalValor: 0 }, '2026-11-11').includes('Nenhuma coleta'));
});

test('remold automático só 3 dias depois da coleta feita', () => {
  const db = abrirBanco(':memory:');
  const a = salvarEstabelecimento(db, { nome: 'A', cidade: 'Quatis', telefone: '5524998765401', tipoTelefone: 'celular', fonte: 'maps' }).id;
  atualizarEstabelecimento(db, a, { tem_whatsapp: 1, status: 'recolhido' });
  const c = salvarColeta(db, { estabelecimentoId: a, dataPrevista: '2026-11-04', qtdPrevista: 10 });
  atualizarColeta(db, c, { status: 'feita', qtdReal: 10 });
  assert.equal(proximaTarefaRemold(db, d('2026-11-06T10:00:00-03:00')), null);
  assert.equal(proximaTarefaRemold(db, d('2026-11-07T10:00:00-03:00')).estabelecimento.id, a);
  registrarMensagem(db, { estabelecimentoId: a, direcao: 'enviada', texto: 'x', campanha: 'remold' });
  assert.equal(proximaTarefaRemold(db, d('2026-11-10T10:00:00-03:00')), null);
});
