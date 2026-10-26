import { test } from 'node:test';
import assert from 'node:assert/strict';
import { criarApp } from '../src/painel/servidor.js';
import { abrirBanco, salvarEstabelecimento, lerAjuste } from '../src/db.js';

async function iniciar() {
  const db = abrirBanco(':memory:');
  const a = salvarEstabelecimento(db, { nome: 'Borracharia A', cidade: 'Quatis', lat: -22.40, lng: -44.26, telefone: '5524998765401', tipoTelefone: 'celular', fonte: 'maps' }).id;
  salvarEstabelecimento(db, { nome: 'Auto Center B', cidade: 'Resende', lat: -22.47, lng: -44.45, fonte: 'osm' });
  const servidor = criarApp(db).listen(0);
  await new Promise((r) => servidor.once('listening', r));
  const base = `http://127.0.0.1:${servidor.address().port}`;
  const api = async (caminho, metodo = 'GET', corpo) => {
    const r = await fetch(base + caminho, { method: metodo, headers: { 'Content-Type': 'application/json' }, body: corpo ? JSON.stringify(corpo) : undefined });
    return { status: r.status, json: await r.json() };
  };
  return { db, a, servidor, api };
}

test('funil por cidade', async () => {
  const { servidor, api } = await iniciar();
  const { json } = await api('/api/funil');
  assert.equal(json.Quatis.mapeados, 1);
  assert.equal(json.Resende.mapeados, 1);
  servidor.close();
});

test('agenda coleta, monta rota e marca recolhido', async () => {
  const { a, servidor, api } = await iniciar();
  const c = await api('/api/coletas', 'POST', { estabelecimentoId: a, dataPrevista: '2026-11-10', qtdPrevista: 20 });
  assert.equal(c.status, 201);
  assert.equal((await api(`/api/estabelecimentos/${a}`)).json.status, 'coleta_agendada');
  const rota = (await api('/api/rotas?data=2026-11-10')).json;
  assert.equal(rota.rotas.length, 1);
  assert.equal(rota.totalValor, 30);
  await api(`/api/coletas/${c.json.id}`, 'PATCH', { qtdReal: 30, status: 'feita' });
  const est = (await api(`/api/estabelecimentos/${a}`)).json;
  assert.equal(est.status, 'recolhido');
  assert.equal(est.coletas[0].valor, 45);
  servidor.close();
});

test('resposta manual vai para a fila e pausa grava ajuste', async () => {
  const { db, a, servidor, api } = await iniciar();
  assert.equal((await api(`/api/estabelecimentos/${a}/responder`, 'POST', { texto: 'Passamos quinta!' })).status, 201);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM fila_envio WHERE campanha = 'manual'").get().n, 1);
  await api('/api/pausar', 'POST');
  assert.equal(lerAjuste(db, 'envios_pausados'), '1');
  await api('/api/retomar', 'POST');
  assert.equal(lerAjuste(db, 'envios_pausados'), '0');
  servidor.close();
});

test('atualiza remold e rejeita status inválido', async () => {
  const { a, servidor, api } = await iniciar();
  await api(`/api/estabelecimentos/${a}`, 'PATCH', { trabalha_remold: 'sim' });
  assert.equal((await api(`/api/estabelecimentos?remold=sim`)).json.length, 1);
  assert.equal((await api(`/api/estabelecimentos/${a}`, 'PATCH', { status: 'qualquer' })).status, 400);
  servidor.close();
});
