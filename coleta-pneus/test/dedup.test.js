import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mesmoEstabelecimento, distanciaMetros } from '../src/dedup.js';

test('mesmo telefone normalizado é o mesmo estabelecimento', () => {
  assert.ok(mesmoEstabelecimento(
    { telefone: '5524998765432', nome: 'A', lat: 0, lng: 0 },
    { telefone: '5524998765432', nome: 'B', lat: 1, lng: 1 },
  ));
});

test('nome parecido e menos de 80 m é o mesmo', () => {
  assert.ok(mesmoEstabelecimento(
    { nome: 'Borracharia do Zé', lat: -22.5, lng: -44.1 },
    { nome: 'BORRACHARIA DO ZE', lat: -22.5003, lng: -44.1 },
  ));
});

test('filiais com mesmo nome, telefones diferentes e longe são diferentes', () => {
  assert.ok(!mesmoEstabelecimento(
    { nome: 'Pneus Sul', telefone: '5524999990001', lat: -22.5, lng: -44.1 },
    { nome: 'Pneus Sul', telefone: '5524999990002', lat: -22.518, lng: -44.1 },
  ));
});

test('sem coordenadas e sem telefone em comum não junta', () => {
  assert.ok(!mesmoEstabelecimento({ nome: 'Auto Center X' }, { nome: 'Auto Center X' }));
});

test('distância aproximada', () => {
  const d = distanciaMetros(-22.5, -44.1, -22.5003, -44.1);
  assert.ok(d > 30 && d < 40, String(d));
});
