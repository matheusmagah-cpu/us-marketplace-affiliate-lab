import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { executarClaude, decidirComClaudeCode, primeiraMensagemComClaudeCode } from '../src/atendente/claude-code.js';
import { ErroAtendente } from '../src/atendente/ia.js';
import { FRASE_OPTOUT } from '../config/mensagens.js';

// Simula o processo `claude -p`: devolve stdout e código de saída.
function spawnFalso({ stdout = '', codigo = 0, atrasoMs = 0 } = {}, registro = []) {
  return (cmd, args, opts) => {
    registro.push({ cmd, args, opts });
    const p = new EventEmitter();
    p.stdout = new EventEmitter();
    p.stderr = new EventEmitter();
    p.stdin = { end: () => {} };
    p.kill = () => { p.morto = true; p.emit('close', null); };
    setTimeout(() => {
      if (p.morto) return;
      p.stdout.emit('data', Buffer.from(stdout));
      p.emit('close', codigo);
    }, atrasoMs);
    return p;
  };
}

const saida = (obj) => JSON.stringify({ type: 'result', subtype: 'success', is_error: false, structured_output: obj });
const est = { nome: 'Borracharia do Zé', cidade: 'Quatis' };
const decisao = { intencao: 'aceitou', qtd_pneus: 20, data_coleta: null, trabalha_remold: 'desconhecido', resposta: 'ok', precisa_dono: false, motivo_dono: null };

test('chama o claude com haiku, sem ferramentas e com esquema', async () => {
  const reg = [];
  const r = await executarClaude('oi', { esquema: { type: 'object' }, sistema: 'sys', spawnFn: spawnFalso({ stdout: saida({ a: 1 }) }, reg) });
  assert.deepEqual(r, { a: 1 });
  const { cmd, args } = reg[0];
  assert.equal(cmd, 'claude');
  for (const a of ['-p', '--model', 'haiku', '--tools', '', '--no-session-persistence', '--output-format', 'json', '--json-schema', '--system-prompt']) assert.ok(args.includes(a), a);
});

test('erros viram ErroAtendente: saída ruim, código de erro, resultado com erro, demora', async () => {
  await assert.rejects(executarClaude('x', { esquema: {}, sistema: '', spawnFn: spawnFalso({ stdout: 'não é json' }) }), ErroAtendente);
  await assert.rejects(executarClaude('x', { esquema: {}, sistema: '', spawnFn: spawnFalso({ stdout: '', codigo: 1 }) }), ErroAtendente);
  await assert.rejects(executarClaude('x', { esquema: {}, sistema: '', spawnFn: spawnFalso({ stdout: JSON.stringify({ is_error: true, result: 'limite de uso' }) }) }), /limite de uso/);
  await assert.rejects(executarClaude('x', { esquema: {}, sistema: '', timeoutMs: 20, spawnFn: spawnFalso({ stdout: saida({}), atrasoMs: 200 }) }), /tempo/);
});

test('decisão do atendente com a conversa no prompt', async () => {
  const reg = [];
  const d = await decidirComClaudeCode({ est, historico: [{ direcao: 'recebida', texto: 'pode vir, tenho 20' }], hoje: new Date('2026-11-03T10:00:00-03:00'), spawnFn: spawnFalso({ stdout: saida(decisao) }, reg) });
  assert.equal(d.intencao, 'aceitou');
  assert.ok(reg[0].args.at(-1).includes('pode vir, tenho 20'));
});

test('primeira mensagem personalizada garante preço e frase de saída', async () => {
  const t = await primeiraMensagemComClaudeCode(est, { spawnFn: spawnFalso({ stdout: saida({ texto: 'Bom dia, pessoal da Borracharia do Zé! Recolhemos pneus aí em Quatis.' }) }) });
  assert.ok(t.includes('Borracharia do Zé'));
  assert.ok(t.includes('R$1,50'));
  assert.ok(t.trim().endsWith(FRASE_OPTOUT));
});

test('primeira mensagem cai no modelo pronto se o claude falhar', async () => {
  const t = await primeiraMensagemComClaudeCode(est, { spawnFn: spawnFalso({ codigo: 1 }) });
  assert.ok(t.includes('Borracharia do Zé'));
  assert.ok(t.trim().endsWith(FRASE_OPTOUT));
});
