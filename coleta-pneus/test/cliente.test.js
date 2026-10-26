import { test } from 'node:test';
import assert from 'node:assert/strict';
import { variacoesDoNumero } from '../src/whatsapp/cliente.js';

test('gera o número com e sem o 9º dígito', () => {
  assert.deepEqual(variacoesDoNumero('5524998765432').sort(), ['552498765432', '5524998765432'].sort());
  assert.deepEqual(variacoesDoNumero('552498765432').sort(), ['552498765432', '5524998765432'].sort());
});
