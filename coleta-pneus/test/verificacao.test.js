import { test } from 'node:test';
import assert from 'node:assert/strict';
import { verificarEstabelecimento } from '../src/whatsapp/verificacao.js';

const clienteFalso = (existe, contato) => ({
  getNumberId: async () => (existe ? { _serialized: '552433221100@c.us' } : null),
  getContactById: async () => contato,
});

test('fixo com WhatsApp Business vira confiança alta e pronto', async () => {
  const r = await verificarEstabelecimento(clienteFalso(true, { isBusiness: true }), { telefone: '552433221100', nome: 'Pneus X', status: 'sem_whatsapp' });
  assert.deepEqual(r, { tem_whatsapp: 1, whatsapp_id: '552433221100@c.us', confianca: 'alta', status: 'pronto' });
});

test('número sem WhatsApp nunca fica pronto', async () => {
  const r = await verificarEstabelecimento(clienteFalso(false), { telefone: '5524998765401', nome: 'A', status: 'pronto' });
  assert.deepEqual(r, { tem_whatsapp: 0, status: 'sem_whatsapp' });
});

test('perfil indisponível fica com confiança média', async () => {
  const c = { getNumberId: async () => ({ _serialized: 'x@c.us' }), getContactById: async () => { throw new Error('x'); } };
  const r = await verificarEstabelecimento(c, { telefone: '5524998765401', nome: 'A', status: 'pronto' });
  assert.equal(r.confianca, 'media');
});
