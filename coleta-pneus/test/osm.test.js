import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { converterOverpass, consultaOverpass } from '../src/mapeamento/osm.js';

const fixture = JSON.parse(readFileSync(new URL('./fixtures/overpass.json', import.meta.url)));

test('converte nós e ways e ignora sem nome', () => {
  const regs = converterOverpass(fixture, 'Quatis');
  assert.equal(regs.length, 2);
  const [ze, auto] = regs;
  assert.equal(ze.fonte, 'osm');
  assert.equal(ze.cidade, 'Quatis');
  assert.equal(ze.lat, -22.4012);
  assert.equal(ze.lng, -44.2601);
  assert.equal(ze.telefone, '5524998765432');
  assert.equal(ze.tipoTelefone, 'celular');
  assert.equal(ze.endereco, 'Rua A, 10');
  assert.equal(auto.lat, -22.41);
  assert.equal(auto.tipoTelefone, 'fixo');
});

test('consulta Overpass mira a cidade certa e nunca Volta Redonda', () => {
  const q = consultaOverpass('Quatis', 'RJ');
  assert.ok(q.includes('"Quatis"'));
  assert.ok(q.includes('"shop"="tyres"'));
  assert.ok(!q.includes('Volta Redonda'));
});
