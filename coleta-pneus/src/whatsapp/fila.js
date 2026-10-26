// Decide quem recebe a próxima mensagem. Lógica pura sobre o banco, sem WhatsApp.
import { precisaLembrete, dataLocalISO } from '../agenda.js';

const CAMPANHAS_CONTADAS = ['coleta', 'lembrete', 'remold'];

export function enviadosNoDia(db, agora) {
  const hoje = dataLocalISO(agora);
  const linhas = db.prepare(`SELECT data_hora FROM mensagens WHERE direcao = 'enviada' AND campanha IN (${CAMPANHAS_CONTADAS.map(() => '?').join(', ')})`)
    .all(...CAMPANHAS_CONTADAS);
  return linhas.filter((l) => dataLocalISO(new Date(l.data_hora)) === hoje).length;
}

function candidatosLembrete(db) {
  return db.prepare(`
    SELECT e.*,
      (SELECT MAX(data_hora) FROM mensagens m WHERE m.estabelecimento_id = e.id AND m.direcao = 'enviada' AND m.campanha = 'coleta') AS enviado_em,
      (SELECT COUNT(*) FROM mensagens m WHERE m.estabelecimento_id = e.id AND m.direcao = 'enviada' AND m.campanha = 'lembrete') AS lembretes,
      (SELECT COUNT(*) FROM mensagens m WHERE m.estabelecimento_id = e.id AND m.direcao = 'recebida') AS respostas
    FROM estabelecimentos e
    WHERE e.status = 'enviado' AND e.optout = 0
    ORDER BY e.id`).all();
}

export function proximaTarefa(db, agora) {
  for (const e of candidatosLembrete(db)) {
    if (e.enviado_em && precisaLembrete(new Date(e.enviado_em), agora, e.lembretes > 0, e.respostas > 0)) {
      return { tipo: 'lembrete', estabelecimento: e };
    }
  }
  // Pula quem tem o mesmo número de outro cadastro já contatado ou que pediu para sair.
  const novo = db.prepare(`SELECT * FROM estabelecimentos e
    WHERE e.status = 'pronto' AND e.tem_whatsapp = 1 AND e.optout = 0
      AND NOT EXISTS (SELECT 1 FROM estabelecimentos o
        WHERE o.id <> e.id AND o.telefone = e.telefone
          AND (o.optout = 1 OR o.status NOT IN ('pronto', 'sem_whatsapp')))
    ORDER BY CASE e.confianca WHEN 'alta' THEN 0 ELSE 1 END, e.cidade, e.id LIMIT 1`).get();
  return novo ? { tipo: 'coleta', estabelecimento: novo } : null;
}

export const MAX_TENTATIVAS_MANUAL = 3;

export function respostasManuaisPendentes(db) {
  return db.prepare(`SELECT f.*, e.whatsapp_id, e.lid, e.telefone FROM fila_envio f
    JOIN estabelecimentos e ON e.id = f.estabelecimento_id
    WHERE f.campanha = 'manual' AND f.status = 'pendente' AND e.optout = 0 AND e.status <> 'invalido' AND f.tentativa < ${MAX_TENTATIVAS_MANUAL}
    ORDER BY f.id`).all();
}
