import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizarTelefone } from '../src/telefone.js';

test('celular com DDD entre parênteses', () => {
  assert.deepEqual(normalizarTelefone('(24) 99876-5432'), { numero: '5524998765432', tipo: 'celular' });
});

test('fixo com +55', () => {
  assert.deepEqual(normalizarTelefone('+55 24 3322-1100'), { numero: '552433221100', tipo: 'fixo' });
});

test('celular com zero de operadora no DDD', () => {
  assert.deepEqual(normalizarTelefone('024 99876-5432'), { numero: '5524998765432', tipo: 'celular' });
});

test('celular sem DDD usa o DDD padrão', () => {
  assert.deepEqual(normalizarTelefone('99876-5432', '24'), { numero: '5524998765432', tipo: 'celular' });
});

test('números inválidos', () => {
  assert.equal(normalizarTelefone('0800 123 4567').tipo, 'invalido');
  assert.equal(normalizarTelefone('').tipo, 'invalido');
  assert.equal(normalizarTelefone('123').tipo, 'invalido');
  assert.equal(normalizarTelefone(undefined).tipo, 'invalido');
});
