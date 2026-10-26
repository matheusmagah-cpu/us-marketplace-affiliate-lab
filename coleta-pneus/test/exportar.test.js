import { test } from 'node:test';
import assert from 'node:assert/strict';
import { paraCsv } from '../src/exportar.js';

test('CSV para Excel BR: BOM, ponto e vírgula e aspas', () => {
  const csv = paraCsv([{ id: 1, cidade: 'Quatis', nome: 'Pneus; "Bom"', endereco: null }]);
  assert.ok(csv.startsWith('﻿id;cidade;nome'));
  assert.ok(csv.includes('1;Quatis;"Pneus; ""Bom"""'));
});
