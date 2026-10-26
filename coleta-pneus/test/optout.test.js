import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ehOptout } from '../src/optout.js';

test('reconhece pedidos para parar', () => {
  for (const t of ['sair', 'SAIR!', 'Não', 'nao quero', 'Pode parar', 'remove meu número', 'não tenho interesse', 'Não me mande mais mensagem']) {
    assert.ok(ehOptout(t), t);
  }
});

test('não confunde resposta normal com opt-out', () => {
  for (const t of ['não tenho pneus agora, semana que vem', 'tenho uns 40', 'quanto custa?', 'Não sei, falar com o dono', '']) {
    assert.ok(!ehOptout(t), t);
  }
});
