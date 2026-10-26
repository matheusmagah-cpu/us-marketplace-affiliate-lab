import { test } from 'node:test';
import assert from 'node:assert/strict';
import { montarMensagem, FRASE_OPTOUT } from '../config/mensagens.js';

const cfg = { empresa: { nome: 'Remold VR', cidadeBase: 'Volta Redonda' }, ofertaRemold: 'pneus remold aro 14' };
const est = { nome: 'Borracharia do Zé', cidade: 'Quatis' };

test('mensagem de coleta personalizada e com saída', () => {
  for (const r of [0, 0.5, 0.99]) {
    const t = montarMensagem('coleta', est, cfg, () => r);
    assert.ok(t.includes('Borracharia do Zé'));
    assert.ok(t.includes('Quatis'));
    assert.ok(t.includes('R$1,50'));
    assert.ok(t.includes('Remold VR'));
    assert.ok(t.trim().endsWith(FRASE_OPTOUT));
    assert.ok(!t.includes('{'));
  }
});

test('variações de texto', () => {
  const textos = new Set([0, 0.5, 0.99].map((r) => montarMensagem('coleta', est, cfg, () => r)));
  assert.ok(textos.size >= 2);
});

test('lembrete e remold', () => {
  assert.ok(montarMensagem('lembrete', est, cfg, () => 0).includes('Borracharia do Zé'));
  const remold = montarMensagem('remold', est, cfg, () => 0);
  assert.ok(remold.includes('pneus remold aro 14'));
  assert.ok(remold.trim().endsWith(FRASE_OPTOUT));
});
