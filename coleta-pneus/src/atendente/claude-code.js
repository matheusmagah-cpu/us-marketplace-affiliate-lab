// Atendente pelo Claude Code com a assinatura do dono (sem chave de API).
// Roda `claude -p` no servidor; autenticação pelo CLAUDE_CODE_OAUTH_TOKEN do .env.
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { z } from 'zod';
import config from '../../config/config.js';
import { montarMensagem, FRASE_OPTOUT } from '../../config/mensagens.js';
import { EsquemaDecisao, ErroAtendente, instrucoes, transcricao } from './instrucoes.js';

const PASTA_TRABALHO = join(tmpdir(), 'coleta-claude'); // pasta vazia: sem CLAUDE.md nem arquivos do projeto

function esquemaJson(esquemaZod) {
  const { $schema, ...resto } = z.toJSONSchema(esquemaZod);
  return resto;
}

export function executarClaude(prompt, { esquema, sistema, modelo = 'haiku', timeoutMs = 60000, spawnFn = spawn }) {
  mkdirSync(PASTA_TRABALHO, { recursive: true });
  const args = [
    '-p', '--model', modelo, '--tools', '', '--no-session-persistence',
    '--output-format', 'json', '--json-schema', JSON.stringify(esquema),
    '--system-prompt', sistema, prompt,
  ];
  return new Promise((resolve, reject) => {
    const proc = spawnFn('claude', args, { cwd: PASTA_TRABALHO, env: process.env, stdio: ['pipe', 'pipe', 'pipe'] });
    let saida = '';
    let erro = '';
    let terminou = false;
    const relogio = setTimeout(() => {
      terminou = true;
      proc.kill('SIGKILL');
      reject(new ErroAtendente(`Claude Code passou do tempo limite (${timeoutMs} ms)`));
    }, timeoutMs);
    proc.stdin?.end();
    proc.stdout.on('data', (d) => { saida += d; });
    proc.stderr?.on('data', (d) => { erro += d; });
    proc.on('error', (e) => {
      if (terminou) return;
      terminou = true;
      clearTimeout(relogio);
      reject(new ErroAtendente(`Não consegui rodar o Claude Code: ${e.message}`));
    });
    proc.on('close', (codigo) => {
      if (terminou) return;
      terminou = true;
      clearTimeout(relogio);
      let json;
      try {
        json = JSON.parse(saida);
      } catch {
        return reject(new ErroAtendente(`Resposta do Claude Code ilegível (código ${codigo}): ${(erro || saida).slice(0, 300)}`));
      }
      if (json.is_error || codigo !== 0) return reject(new ErroAtendente(`Claude Code falhou: ${String(json.result || erro).slice(0, 300)}`));
      if (!json.structured_output) return reject(new ErroAtendente('Claude Code não devolveu a resposta no formato combinado'));
      resolve(json.structured_output);
    });
  });
}

export async function decidirComClaudeCode({ est, historico, hoje = new Date(), cfg = config, spawnFn }) {
  const decisao = await executarClaude(transcricao(est, historico, hoje), {
    esquema: esquemaJson(EsquemaDecisao), sistema: instrucoes(cfg), spawnFn,
  });
  const valida = EsquemaDecisao.safeParse(decisao);
  if (!valida.success) throw new ErroAtendente('Decisão do Claude fora do formato');
  return valida.data;
}

const EsquemaPrimeira = z.strictObject({ texto: z.string() });

function sistemaPrimeira(cfg) {
  return `Você escreve a PRIMEIRA mensagem de WhatsApp da ${cfg.empresa.nome} (${cfg.empresa.cidadeBase}, RJ) para uma borracharia ou auto center que ainda não conhece a empresa.
Objetivo: oferecer a recolha de pneus de descarte no local, a R$${cfg.precoPorPneu.toFixed(2).replace('.', ',')} por pneu, e perguntar se eles têm pneus para descartar.
Regras: soe como uma pessoa da região, educada e direta; 2 ou 3 frases; cumprimente pelo nome do estabelecimento; cite a cidade; escreva o preço exatamente como "R$${cfg.precoPorPneu.toFixed(2).replace('.', ',')}"; não invente descontos, prazos, brindes ou dados; no máximo 1 emoji; varie o texto de uma mensagem para outra.
Não inclua a frase de "sair" — o sistema acrescenta.`;
}

export async function primeiraMensagemComClaudeCode(est, { cfg = config, spawnFn } = {}) {
  const preco = 'R$' + cfg.precoPorPneu.toFixed(2).replace('.', ',');
  try {
    const { texto } = await executarClaude(`Estabelecimento: ${est.nome}. Cidade: ${est.cidade}. Escreva a mensagem.`, {
      esquema: esquemaJson(EsquemaPrimeira), sistema: sistemaPrimeira(cfg), spawnFn, timeoutMs: 45000,
    });
    const limpo = String(texto || '').replace(FRASE_OPTOUT, '').trim();
    if (!limpo.includes(est.nome) || !limpo.includes(preco)) throw new ErroAtendente('mensagem fora das regras');
    return `${limpo} ${FRASE_OPTOUT}`;
  } catch {
    return montarMensagem('coleta', est, cfg);
  }
}
