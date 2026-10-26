// Travas que decidem se o atendente pode responder um contato agora.

export const MAX_RESPOSTAS_24H = 8;
const CAMPANHAS_PROSPECCAO = ['coleta', 'lembrete', 'remold', 'teste'];

const normalizar = (t) => String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();

export function podeResponder(db, est, agora = new Date()) {
  const prospectado = db.prepare(`SELECT 1 FROM mensagens WHERE estabelecimento_id = ? AND direcao = 'enviada'
    AND campanha IN (${CAMPANHAS_PROSPECCAO.map(() => '?').join(', ')}) LIMIT 1`).get(est.id, ...CAMPANHAS_PROSPECCAO);
  if (!prospectado) return { ok: false, motivo: 'nao_prospectado' };

  if (est.pausado_ate && new Date(est.pausado_ate) > agora) return { ok: false, motivo: 'dono_assumiu' };

  const desde = new Date(agora.getTime() - 24 * 3600 * 1000).toISOString();
  const { n } = db.prepare(`SELECT COUNT(*) AS n FROM mensagens WHERE estabelecimento_id = ? AND direcao = 'enviada'
    AND campanha = 'atendente' AND data_hora >= ?`).get(est.id, desde);
  if (n >= MAX_RESPOSTAS_24H) return { ok: false, motivo: 'teto' };

  // Outro robô (resposta automática) repete a mesma mensagem: não entra em loop.
  const recebidas = db.prepare(`SELECT texto FROM mensagens WHERE estabelecimento_id = ? AND direcao = 'recebida'
    ORDER BY data_hora DESC LIMIT 2`).all(est.id);
  if (recebidas.length === 2 && normalizar(recebidas[0].texto).length > 10 && normalizar(recebidas[0].texto) === normalizar(recebidas[1].texto)) {
    return { ok: false, motivo: 'repeticao' };
  }

  return { ok: true, motivo: null };
}
