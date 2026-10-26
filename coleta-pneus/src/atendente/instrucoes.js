// Regras e formato do atendente, usados pelos dois backends (Claude Code e API).
import { z } from 'zod';
import { dataLocalISO } from '../agenda.js';

export class ErroAtendente extends Error {}

export const EsquemaDecisao = z.strictObject({
  intencao: z.enum(['aceitou', 'recusou', 'optout', 'pergunta', 'numero_errado', 'outro']),
  qtd_pneus: z.number().int().nullable(),
  data_coleta: z.string().nullable(),
  trabalha_remold: z.enum(['sim', 'nao', 'desconhecido']),
  resposta: z.string(),
  precisa_dono: z.boolean(),
  motivo_dono: z.string().nullable(),
});

export function instrucoes(cfg) {
  const preco = 'R$' + cfg.precoPorPneu.toFixed(2).replace('.', ',');
  return `Você atende pelo WhatsApp da ${cfg.empresa.nome}, de ${cfg.empresa.cidadeBase} (RJ), que recolhe pneus de descarte em borracharias e auto centers da região e também fabrica pneu remold.

Regras fixas:
- A recolha custa ${preco} por pneu e a empresa busca no local. Nunca ofereça desconto, prazo, forma de pagamento ou qualquer condição que não esteja aqui.
- Escreva como uma pessoa: português do Brasil, curto (1 a 3 frases), educado, sem emojis em excesso.
- Se perguntarem se é robô, não minta: diga que é o atendimento automático da empresa e que uma pessoa acompanha as conversas.
- Se não souber responder com certeza, diga que vai confirmar e retornar, e marque precisa_dono = true com o motivo.
- Pneu remold: se o contato disser que trabalha ou não com remold, preencha trabalha_remold. Preço e medidas do remold quem informa é o dono (precisa_dono = true).

Como preencher:
- intencao "aceitou": o contato quer a recolha. Preencha qtd_pneus se ele disser e data_coleta (AAAA-MM-DD) se ele indicar um dia. "resposta" pode ficar curta, o sistema confirma a data.
- "recusou": não quer agora. Responda agradecendo e dizendo que fica à disposição.
- "optout": pediu para não receber mais mensagens.
- "numero_errado": disse que o número não é de borracharia/auto center ou que é engano.
- "pergunta": fez uma pergunta. Responda dentro das regras.
- "outro": qualquer outra coisa.
- Deixe "resposta" vazia ("") quando não houver o que responder: "ok", "obrigado", figurinha, ou mensagem automática de outro sistema (horário de atendimento, "já te respondo").`;
}

export function transcricao(est, historico, hoje) {
  const linhas = historico.map((m) => `${m.direcao === 'recebida' ? 'CONTATO' : 'EMPRESA'}: ${m.texto}`);
  return `Hoje é ${dataLocalISO(hoje)}. Contato: ${est.nome}, em ${est.cidade}.

Conversa até agora:
${linhas.join('\n')}

Decida a próxima resposta da EMPRESA.`;
}

