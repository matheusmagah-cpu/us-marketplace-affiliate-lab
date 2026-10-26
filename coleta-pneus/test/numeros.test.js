import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extrairWhatsappDoHtml } from '../src/numeros.js';
import { abrirBanco, salvarEstabelecimento, atualizarEstabelecimento } from '../src/db.js';
import { proximaTarefa } from '../src/whatsapp/fila.js';

test('extrai WhatsApp de links do site', () => {
  const html = `<a href="https://wa.me/5524998765401">Zap</a>
    <a href="https://api.whatsapp.com/send?phone=552433221100&text=oi">Fixo</a>
    <a href="https://wa.me/5524998765401?text=x">dup</a>
    <a href="tel:2433221199">tel</a>`;
  assert.deepEqual(extrairWhatsappDoHtml(html).sort(), ['552433221100', '5524998765401']);
  assert.deepEqual(extrairWhatsappDoHtml(''), []);
});

test('fila envia confiança alta primeiro e nunca inválido', () => {
  const db = abrirBanco(':memory:');
  const a = salvarEstabelecimento(db, { nome: 'A', cidade: 'Barra Mansa', telefone: '5524998765401', tipoTelefone: 'celular', fonte: 'maps' }).id;
  const b = salvarEstabelecimento(db, { nome: 'B', cidade: 'Quatis', telefone: '5524998765402', tipoTelefone: 'celular', fonte: 'maps' }).id;
  const c = salvarEstabelecimento(db, { nome: 'C', cidade: 'Barra Mansa', telefone: '5524998765403', tipoTelefone: 'celular', fonte: 'maps' }).id;
  atualizarEstabelecimento(db, a, { tem_whatsapp: 1, confianca: 'media' });
  atualizarEstabelecimento(db, b, { tem_whatsapp: 1, confianca: 'alta' });
  atualizarEstabelecimento(db, c, { tem_whatsapp: 1, confianca: 'alta', status: 'invalido' });
  const agora = new Date('2026-11-03T10:00:00-03:00');
  assert.equal(proximaTarefa(db, agora).estabelecimento.id, b);
  atualizarEstabelecimento(db, b, { status: 'enviado' });
  assert.equal(proximaTarefa(db, agora).estabelecimento.id, a);
});
