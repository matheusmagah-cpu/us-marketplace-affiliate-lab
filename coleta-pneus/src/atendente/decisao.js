// Aplica a decisão do atendente: atualiza o banco e diz o que responder e se avisa o dono.
import { dataLocalISO } from '../agenda.js';
import { atualizarEstabelecimento, marcarOptout, salvarColeta } from '../db.js';
import config from '../../config/config.js';

const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const diaDaSemana = (iso) => new Date(`${iso}T12:00:00Z`).getUTCDay();
const somarDias = (iso, n) => new Date(Date.parse(`${iso}T12:00:00Z`) + n * 86400000).toISOString().slice(0, 10);
const reais = (v) => 'R$' + v.toFixed(2).replace('.', ',');

export function proximoDiaUtil(agora) {
  let dia = somarDias(dataLocalISO(agora), 1);
  while ([0, 6].includes(diaDaSemana(dia))) dia = somarDias(dia, 1);
  return dia;
}

// Data informada pelo cliente vale se for futura e não for domingo.
function dataDaColeta(informada, agora) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(informada || '') && informada > dataLocalISO(agora) && diaDaSemana(informada) !== 0) {
    return informada;
  }
  return proximoDiaUtil(agora);
}

function confirmacao(data, qtd) {
  const [, mes, dia] = data.split('-');
  const preco = config.precoPorPneu;
  const pneus = qtd ? `os ${qtd} pneus` : 'os pneus';
  const total = qtd ? ` (total de ${reais(qtd * preco)})` : '';
  return `Combinado! Passamos aí na ${DIAS[diaDaSemana(data)]}, ${dia}/${mes}, para recolher ${pneus}. O valor é ${reais(preco)} por pneu${total}. Se precisar mudar o dia, é só avisar.`;
}

export function aplicarDecisao(db, est, d, agora = new Date()) {
  if (d.trabalha_remold === 'sim' || d.trabalha_remold === 'nao') {
    atualizarEstabelecimento(db, est.id, { trabalha_remold: d.trabalha_remold });
  }

  switch (d.intencao) {
    case 'optout':
      marcarOptout(db, est);
      return { resposta: 'Certo, não enviaremos mais mensagens. Obrigado!', avisarDono: null };

    case 'numero_errado':
      atualizarEstabelecimento(db, est.id, { status: 'invalido' });
      return { resposta: 'Desculpe o engano! Não vamos mais enviar mensagens para este número.', avisarDono: null };

    case 'recusou':
      atualizarEstabelecimento(db, est.id, { status: 'recusou' });
      return { resposta: d.resposta, avisarDono: null };

    case 'aceitou': {
      const data = dataDaColeta(d.data_coleta, agora);
      const qtd = Number.isInteger(d.qtd_pneus) && d.qtd_pneus > 0 ? d.qtd_pneus : null;
      const existente = db.prepare("SELECT id FROM coletas WHERE estabelecimento_id = ? AND status = 'agendada'").get(est.id);
      if (existente) {
        db.prepare('UPDATE coletas SET data_prevista = ?, qtd_pneus_prevista = COALESCE(?, qtd_pneus_prevista) WHERE id = ?').run(data, qtd, existente.id);
      } else {
        salvarColeta(db, { estabelecimentoId: est.id, dataPrevista: data, qtdPrevista: qtd });
      }
      atualizarEstabelecimento(db, est.id, { status: 'coleta_agendada' });
      return { resposta: confirmacao(data, qtd), avisarDono: null };
    }

    default: {
      if (['pronto', 'enviado'].includes(est.status)) atualizarEstabelecimento(db, est.id, { status: 'respondeu' });
      const avisarDono = d.precisa_dono
        ? `Atenção: ${est.nome} (${est.cidade}) precisa de você. ${d.motivo_dono || 'Veja a conversa no painel.'}`
        : null;
      return { resposta: d.resposta, avisarDono };
    }
  }
}
