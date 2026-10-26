import { test } from 'node:test';
import assert from 'node:assert/strict';
import { elegivelRemold } from '../src/remold.js';

test('elegibilidade da campanha remold', () => {
  assert.ok(elegivelRemold({ status: 'recolhido', optout: 0 }, false));
  assert.ok(elegivelRemold({ status: 'aceitou', optout: 0 }, false));
  assert.ok(elegivelRemold({ status: 'coleta_agendada', optout: 0 }, false));
  for (const s of ['enviado', 'respondeu', 'recusou', 'pronto']) assert.ok(!elegivelRemold({ status: s, optout: 0 }, false), s);
  assert.ok(!elegivelRemold({ status: 'recolhido', optout: 1 }, false));
  assert.ok(!elegivelRemold({ status: 'recolhido', optout: 0 }, true));
});

