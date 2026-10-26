// Fase 2: oferta de pneu remold só para quem já aceitou ou fez coleta.

const STATUS_ELEGIVEIS = new Set(['aceitou', 'coleta_agendada', 'recolhido']);

export function elegivelRemold(est, jaEnviouRemold) {
  return STATUS_ELEGIVEIS.has(est.status) && !est.optout && !jaEnviouRemold;
}

export function proximaTarefaRemold(db) {
  const linhas = db.prepare(`SELECT e.*,
      (SELECT COUNT(*) FROM mensagens m WHERE m.estabelecimento_id = e.id AND m.direcao = 'enviada' AND m.campanha = 'remold') AS remold_enviados
    FROM estabelecimentos e WHERE e.tem_whatsapp = 1 ORDER BY e.cidade, e.id`).all();
  const e = linhas.find((l) => elegivelRemold(l, l.remold_enviados > 0));
  return e ? { tipo: 'remold', estabelecimento: e } : null;
}
