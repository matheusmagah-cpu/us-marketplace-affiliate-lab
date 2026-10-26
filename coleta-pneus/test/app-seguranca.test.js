import { test } from 'node:test';
import assert from 'node:assert/strict';
import { criarApp } from '../src/painel/servidor.js';
import { abrirBanco, salvarEstabelecimento, gravarAjuste } from '../src/db.js';

async function iniciar() {
  const db = abrirBanco(':memory:');
  salvarEstabelecimento(db, { nome: 'Borracharia A', cidade: 'Quatis', telefone: '5524998765401', tipoTelefone: 'celular', fonte: 'maps' });
  const srv = criarApp(db, { usuario: 'dono', senha: 's3nha', mcpToken: 'tok123' }).listen(0);
  await new Promise((r) => srv.once('listening', r));
  return { db, srv, base: `http://127.0.0.1:${srv.address().port}` };
}
const basic = (u, s) => 'Basic ' + Buffer.from(`${u}:${s}`).toString('base64');

test('painel exige usuário e senha', async (t) => {
  const { srv, base } = await iniciar();
  t.after(() => srv.close());
  assert.equal((await fetch(base + '/api/funil')).status, 401);
  assert.equal((await fetch(base + '/', {})).status, 401);
  assert.equal((await fetch(base + '/api/funil', { headers: { Authorization: basic('dono', 'errada') } })).status, 401);
  assert.equal((await fetch(base + '/api/funil', { headers: { Authorization: basic('dono', 's3nha') } })).status, 200);
});

test('QR code do WhatsApp aparece no painel', async (t) => {
  const { db, srv, base } = await iniciar();
  t.after(() => srv.close());
  gravarAjuste(db, 'whatsapp_status', 'aguardando_qr');
  gravarAjuste(db, 'whatsapp_qr', '2@abcdef');
  const r = await (await fetch(base + '/api/whatsapp', { headers: { Authorization: basic('dono', 's3nha') } })).json();
  assert.equal(r.status, 'aguardando_qr');
  assert.ok(r.qr.startsWith('data:image/png;base64,'));
});

const rpc = (base, token, corpo) => fetch(base + '/mcp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
  body: JSON.stringify(corpo),
});

test('MCP exige token e lista as ferramentas', async (t) => {
  const { srv, base } = await iniciar();
  t.after(() => srv.close());
  assert.equal((await rpc(base, null, { jsonrpc: '2.0', id: 1, method: 'tools/list' })).status, 401);
  assert.equal((await rpc(base, 'errado', { jsonrpc: '2.0', id: 1, method: 'tools/list' })).status, 401);
  const r = await rpc(base, 'tok123', { jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} });
  assert.equal(r.status, 200);
  const nomes = (await r.json()).result.tools.map((t) => t.name);
  for (const n of ['funil', 'listar_contatos', 'conversa', 'agendar_coleta', 'responder', 'rota', 'pausar', 'retomar']) assert.ok(nomes.includes(n), n);
});

test('MCP responde o funil', async (t) => {
  const { srv, base } = await iniciar();
  t.after(() => srv.close());
  const r = await rpc(base, 'tok123', { jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'funil', arguments: {} } });
  const corpo = await r.json();
  assert.ok(corpo.result.content[0].text.includes('Quatis'));
});
