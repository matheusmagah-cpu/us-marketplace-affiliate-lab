// Rotinas automáticas: rota do dia seguinte às 17h (seg–sex) e remapeamento na segunda às 6h.
import { dataLocalISO } from './agenda.js';
import config from '../config/config.js';

const fmtHora = new Intl.DateTimeFormat('en-US', { timeZone: config.envio.fusoHorario, hour: '2-digit', hourCycle: 'h23', weekday: 'short' });
const DIAS = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

function horaLocal(data) {
  const p = Object.fromEntries(fmtHora.formatToParts(data).map((x) => [x.type, x.value]));
  return { hora: Number(p.hour), diaSemana: DIAS[p.weekday] };
}

export function tarefasDevidas(agora, ultimas = {}) {
  const hoje = dataLocalISO(agora);
  const { hora, diaSemana } = horaLocal(agora);
  const devidas = [];
  if (diaSemana >= 1 && diaSemana <= 5 && hora >= 17 && ultimas.rota_diaria !== hoje) devidas.push('rota_diaria');
  if (diaSemana === 1 && hora >= 6 && ultimas.remapeamento !== hoje) devidas.push('remapeamento');
  return devidas;
}

const reais = (v) => 'R$' + Number(v || 0).toFixed(2).replace('.', ',');

export function textoRota(rota, dataISO) {
  const [, mes, dia] = dataISO.split('-');
  const paradas = rota.rotas.reduce((s, r) => s + r.paradas.length, 0) + rota.semCoordenadas.length;
  if (!paradas) return `Nenhuma coleta agendada para ${dia}/${mes}.`;

  const linhas = [`*Rota de coleta – ${dia}/${mes}*`, `${paradas} parada(s) · ${rota.totalPneus} pneus previstos · ${reais(rota.totalValor)}`];
  const item = (p, i) => `${i + 1}. ${p.nome} (${p.cidade})${p.endereco ? ' – ' + p.endereco : ''} – ${p.qtd_pneus_prevista ?? '?'} pneus${p.telefone ? ' – ' + p.telefone : ''}`;
  rota.rotas.forEach((r, n) => {
    linhas.push('', `Rota ${n + 1}: ${r.link}`, ...r.paradas.map(item));
  });
  if (rota.semCoordenadas.length) {
    linhas.push('', 'Sem localização (encaixar manualmente):', ...rota.semCoordenadas.map(item));
  }
  return linhas.join('\n');
}
