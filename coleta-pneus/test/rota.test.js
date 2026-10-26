import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ordenarParadas, dividirRota, linkGoogleMaps, valorColeta, montarRota } from '../src/rota.js';

const origem = { lat: -22.5, lng: -44.1 };

test('ordena pelo vizinho mais próximo', () => {
  const p = [{ id: 'c', lat: -22.5, lng: -44.4 }, { id: 'a', lat: -22.5, lng: -44.2 }, { id: 'b', lat: -22.5, lng: -44.3 }];
  assert.deepEqual(ordenarParadas(origem, p).map((x) => x.id), ['a', 'b', 'c']);
});

test('divide em blocos de 10', () => {
  const p = Array.from({ length: 23 }, (_, i) => ({ id: i }));
  assert.deepEqual(dividirRota(p).map((b) => b.length), [10, 10, 3]);
});

test('link do Google Maps', () => {
  const url = linkGoogleMaps(origem, [{ lat: -22.51, lng: -44.2 }, { lat: -22.52, lng: -44.3 }]);
  assert.ok(url.startsWith('https://www.google.com/maps/dir/?api=1'));
  assert.ok(url.includes('origin=-22.5,-44.1'));
  assert.ok(url.includes('destination=-22.52,-44.3'));
  assert.ok(url.includes('waypoints=-22.51,-44.2'));
  assert.ok(url.includes('travelmode=driving'));
});

test('valor da coleta a R$1,50 por pneu', () => {
  assert.equal(valorColeta(40), 60);
  assert.equal(valorColeta(7), 10.5);
  assert.equal(valorColeta(0), 0);
});

test('monta rota, separa quem não tem coordenadas e soma totais', () => {
  const coletas = [
    { id: 1, lat: -22.5, lng: -44.2, qtd_pneus_prevista: 30 },
    { id: 2, lat: null, lng: null, qtd_pneus_prevista: 10 },
    { id: 3, lat: -22.5, lng: -44.3, qtd_pneus_prevista: 12 },
  ];
  const r = montarRota(origem, coletas);
  assert.equal(r.rotas.length, 1);
  assert.deepEqual(r.rotas[0].paradas.map((p) => p.id), [1, 3]);
  assert.deepEqual(r.semCoordenadas.map((p) => p.id), [2]);
  assert.equal(r.totalPneus, 52);
  assert.equal(r.totalValor, 78);
});

test('segunda rota começa onde a primeira terminou', () => {
  const coletas = Array.from({ length: 12 }, (_, i) => ({ id: i, lat: -22.5, lng: -44.11 - i * 0.01, qtd_pneus_prevista: 1 }));
  const r = montarRota(origem, coletas);
  assert.equal(r.rotas.length, 2);
  const ultima = r.rotas[0].paradas.at(-1);
  assert.ok(r.rotas[1].link.includes(`origin=${ultima.lat},${ultima.lng}`));
});
