import { test } from 'node:test';
import assert from 'node:assert/strict';
import { camposPendentes } from '../src/verificar-config.js';

const ok = { empresa: { nome: 'Remold VR' }, ofertaRemold: 'remold aro 14 a partir de R$ 180' };

test('configuração completa passa', () => {
  assert.deepEqual(camposPendentes(ok, { DONO_WHATSAPP: '5524998887766' }), []);
});

test('valores de exemplo são recusados', () => {
  assert.deepEqual(camposPendentes({ empresa: { nome: 'PREENCHER' }, ofertaRemold: 'PREENCHER' }, {}).sort(), ['DONO_WHATSAPP', 'EMPRESA_NOME', 'OFERTA_REMOLD']);
  assert.deepEqual(camposPendentes({ empresa: { nome: 'Nome da sua empresa' }, ofertaRemold: 'a partir de R$ X' }, { DONO_WHATSAPP: '5524999999999' }).sort(), ['DONO_WHATSAPP', 'EMPRESA_NOME', 'OFERTA_REMOLD']);
});
