// Fase 2: oferta de pneu remold só para quem já aceitou ou fez coleta.
import { dataLocalISO } from './agenda.js';

const STATUS_ELEGIVEIS = new Set(['aceitou', 'coleta_agendada', 'recolhido']);
const DIAS_APOS_COLETA = 3;

export function elegivelRemold(est, jaEnviouRemold) {
  return STATUS_ELEGIVEIS.has(est.status) && !est.optout && !jaEnviouRemold;
}

// Automático: oferece remold a quem teve coleta feita há pelo menos 3 dias e ainda não recebeu a oferta.
export function proximaTarefaRemold(db, agora = new Date()) {
  const limite = new Date(Date.parse(`${dataLocalISO(agora)}T12:00:00Z`) - DIAS_APOS_COLETA * 86400000).toISOString().slice(0, 10);
  const e = db.prepare(`SELECT e.* FROM estabelecimentos e
    WHERE e.tem_whatsapp = 1 AND e.optout = 0 AND e.status = 'recolhido'
      AND EXISTS (SELECT 1 FROM coletas c WHERE c.estabelecimento_id = e.id AND c.status = 'feita' AND c.data_prevista <= ?)
      AND NOT EXISTS (SELECT 1 FROM mensagens m WHERE m.estabelecimento_id = e.id AND m.direcao = 'enviada' AND m.campanha = 'remold')
    ORDER BY e.cidade, e.id LIMIT 1`).get(limite);
  return e ? { tipo: 'remold', estabelecimento: e } : null;
}
