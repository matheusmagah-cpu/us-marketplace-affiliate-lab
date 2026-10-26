import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dentroDaJanela, proximoHorarioValido, limiteDoDia, proximoEnvio, precisaLembrete } from '../src/agenda.js';

const d = (s) => new Date(s);
const iso = (x) => x.toISOString();

test('janela de envio', () => {
  assert.ok(dentroDaJanela(d('2026-11-03T10:00:00-03:00')));   // terça
  assert.ok(!dentroDaJanela(d('2026-11-03T17:31:00-03:00')));
  assert.ok(!dentroDaJanela(d('2026-11-03T08:29:00-03:00')));
  assert.ok(dentroDaJanela(d('2026-11-07T11:59:00-03:00')));   // sábado
  assert.ok(!dentroDaJanela(d('2026-11-07T12:01:00-03:00')));
  assert.ok(!dentroDaJanela(d('2026-11-08T10:00:00-03:00')));  // domingo
});

test('próximo horário válido', () => {
  assert.equal(iso(proximoHorarioValido(d('2026-11-06T17:40:00-03:00'))), iso(d('2026-11-07T08:30:00-03:00')));
  assert.equal(iso(proximoHorarioValido(d('2026-11-07T12:05:00-03:00'))), iso(d('2026-11-09T08:30:00-03:00')));
  assert.equal(iso(proximoHorarioValido(d('2026-11-03T06:00:00-03:00'))), iso(d('2026-11-03T08:30:00-03:00')));
  assert.equal(iso(proximoHorarioValido(d('2026-11-03T10:00:00-03:00'))), iso(d('2026-11-03T10:00:00-03:00')));
});

test('limite diário sobe por semana até o teto', () => {
  const ini = d('2026-11-02T08:30:00-03:00');
  assert.equal(limiteDoDia(ini, d('2026-11-04T09:00:00-03:00')), 20);
  assert.equal(limiteDoDia(ini, d('2026-11-10T09:00:00-03:00')), 30);
  assert.equal(limiteDoDia(ini, d('2027-01-10T09:00:00-03:00')), 60);
});

test('próximo envio respeita intervalo e janela', () => {
  assert.equal(iso(proximoEnvio(d('2026-11-03T10:00:00-03:00'), () => 0)), iso(d('2026-11-03T10:03:00-03:00')));
  assert.equal(iso(proximoEnvio(d('2026-11-03T10:00:00-03:00'), () => 0.999999)), iso(d('2026-11-03T10:09:00-03:00')));
  assert.equal(iso(proximoEnvio(d('2026-11-06T17:28:00-03:00'), () => 0)), iso(d('2026-11-07T08:30:00-03:00')));
});

test('lembrete só depois de 3 dias úteis, uma vez', () => {
  const env = d('2026-11-06T10:00:00-03:00'); // sexta
  assert.ok(precisaLembrete(env, d('2026-11-11T10:00:00-03:00'), false, false));
  assert.ok(!precisaLembrete(env, d('2026-11-10T10:00:00-03:00'), false, false));
  assert.ok(!precisaLembrete(env, d('2026-11-20T10:00:00-03:00'), true, false));
  assert.ok(!precisaLembrete(env, d('2026-11-20T10:00:00-03:00'), false, true));
});

test('antes do início da campanha o limite é zero', () => {
  assert.equal(limiteDoDia(d('2026-11-02T08:30:00-03:00'), d('2026-10-30T09:00:00-03:00')), 0);
});
