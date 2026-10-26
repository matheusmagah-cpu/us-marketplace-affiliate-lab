import { test } from 'node:test';
import assert from 'node:assert/strict';
import { criarApp } from '../src/painel/servidor.js';
import { abrirBanco, salvarEstabelecimento, atualizarEstabelecimento, registrarMensagem, registrarWhatsapp } from '../src/db.js';

async function iniciar(t) {
  const db = abrirBanco(':memory:');
  const a = salvarEstabelecimento(db, { nome: 'Respondeu', cidade: 'Quatis', telefone: '5524998765401', tipoTelefone: 'celular', fonte: 'maps' }).id;
  const b = salvarEstabelecimento(db, { nome: 'Calado', cidade: 'Piraí', telefone: '5524998765402', tipoTelefone: 'celular', fonte: 'maps' }).id;
  for (const id of [a, b]) {
    atualizarEstabelecimento(db, id, { status: 'enviado', tem_whatsapp: 1 });
    registrarMensagem(db, { estabelecimentoId: id, direcao: 'enviada', texto: 'Bom dia', campanha: 'coleta', dataHora: '2026-10-20T13:00:00.000Z' });
  }
  registrarMensagem(db, { estabelecimentoId: a, direcao: 'recebida', texto: 'tenho 20', dataHora: '2026-10-20T14:00:00.000Z' });
  registrarWhatsapp(db, { jid: '5521977776666@s.whatsapp.net', deMim: false, texto: 'cliente normal', id: 'X', quando: '2026-10-21T12:00:00.000Z' });
  const srv = criarApp(db, { usuario: 'u', senha: 's', mcpToken: 't' }).listen(0);
  await new Promise((r) => srv.once('listening', r));
  t.after(() => srv.close());
  const chamar = async (name, args = {}) => {
    const r = await fetch(`http://127.0.0.1:${srv.address().port}/mcp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', Authorization: 'Bearer t' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }),
    });
    return JSON.parse((await r.json()).result.content[0].text);
  };
  return { chamar };
}

test('quem respondeu e quem não respondeu', async (t) => {
  const { chamar } = await iniciar(t);
  const responderam = await chamar('responderam');
  assert.deepEqual(responderam.map((r) => r.nome), ['Respondeu']);
  assert.equal(responderam[0].ultima_resposta, 'tenho 20');
  const semResposta = await chamar('sem_resposta', { dias: 2 });
  assert.deepEqual(semResposta.map((r) => r.nome), ['Calado']);
});

test('lê todas as conversas do número, inclusive clientes normais', async (t) => {
  const { chamar } = await iniciar(t);
  const conversas = await chamar('conversas_recentes');
  assert.equal(conversas[0].numero, '5521977776666');
  const chat = await chamar('ler_chat', { numero: '5521977776666' });
  assert.equal(chat[0].texto, 'cliente normal');
});
