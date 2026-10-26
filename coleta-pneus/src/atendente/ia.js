// Atendente automático: o Claude Haiku lê a conversa e decide o que fazer.
// Backend opcional (ATENDENTE=api): usa a API da Anthropic com chave. O padrão é o Claude Code (claude-code.js).
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import config from '../../config/config.js';
import { EsquemaDecisao, instrucoes, transcricao } from './instrucoes.js';

export const MODELO = 'claude-haiku-5-5';

import { ErroAtendente } from './instrucoes.js';

export { ErroAtendente };

export async function interpretar(cliente, { est, historico, hoje = new Date(), cfg = config }) {
  let resposta;
  try {
    resposta = await cliente.messages.parse({
      model: MODELO,
      max_tokens: 1024,
      system: instrucoes(cfg),
      messages: [{ role: 'user', content: transcricao(est, historico, hoje) }],
      output_config: { effort: 'low', format: zodOutputFormat(EsquemaDecisao) },
    });
  } catch (e) {
    throw new ErroAtendente(`Falha na API do Claude: ${e.message}`);
  }
  if (resposta.stop_reason === 'refusal' || !resposta.parsed_output) {
    throw new ErroAtendente(`Sem decisão do atendente (stop_reason=${resposta.stop_reason})`);
  }
  return resposta.parsed_output;
}
