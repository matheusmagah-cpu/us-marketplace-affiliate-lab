// Regras de quando e quanto enviar, no horário de Brasília.
import config from '../config/config.js';

const E = config.envio;
const MIN = 60 * 1000;
const DIA = 24 * 60 * MIN;

const formatador = new Intl.DateTimeFormat('en-US', {
  timeZone: E.fusoHorario,
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit',
  weekday: 'short', hourCycle: 'h23',
});
const DIAS = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

function partesLocais(data) {
  const p = Object.fromEntries(formatador.formatToParts(data).map((x) => [x.type, x.value]));
  return {
    ano: +p.year, mes: +p.month, dia: +p.day, hora: +p.hour, minuto: +p.minute, segundo: +p.second,
    diaSemana: DIAS[p.weekday],
  };
}

// Converte uma hora local (fuso configurado) em Date.
function dataLocal(ano, mes, dia, hora, minuto) {
  const chute = new Date(Date.UTC(ano, mes - 1, dia, hora, minuto));
  const p = partesLocais(chute);
  const comoUtc = Date.UTC(p.ano, p.mes - 1, p.dia, p.hora, p.minuto);
  return new Date(chute.getTime() - (comoUtc - chute.getTime()));
}

const emMinutos = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };

export function dentroDaJanela(data) {
  const p = partesLocais(data);
  const janela = E.janelas[p.diaSemana];
  if (!janela) return false;
  const agora = p.hora * 60 + p.minuto;
  return agora >= emMinutos(janela[0]) && agora <= emMinutos(janela[1]);
}

export function proximoHorarioValido(data) {
  if (dentroDaJanela(data)) return data;
  for (let i = 0; i <= 8; i++) {
    const p = partesLocais(new Date(data.getTime() + i * DIA));
    const janela = E.janelas[p.diaSemana];
    if (!janela) continue;
    const [h, m] = janela[0].split(':').map(Number);
    const inicio = dataLocal(p.ano, p.mes, p.dia, h, m);
    if (inicio.getTime() >= data.getTime()) return inicio;
  }
  throw new Error('Nenhuma janela de envio configurada.');
}

export function limiteDoDia(dataInicioCampanha, hoje) {
  const dias = Math.max(0, Math.floor((hoje - dataInicioCampanha) / DIA));
  const semanas = Math.floor(dias / 7);
  return Math.min(E.teto, E.limiteInicial + semanas * E.incrementoSemanal);
}

export function proximoEnvio(ultimoEnvio, rng = Math.random) {
  const minutos = Math.round(E.intervaloMinMin + rng() * (E.intervaloMaxMin - E.intervaloMinMin));
  return proximoHorarioValido(new Date(ultimoEnvio.getTime() + minutos * MIN));
}

function diasUteisEntre(inicio, fim) {
  let conta = 0;
  const pi = partesLocais(inicio);
  let cursor = dataLocal(pi.ano, pi.mes, pi.dia, 12, 0);
  const pf = partesLocais(fim);
  const limite = dataLocal(pf.ano, pf.mes, pf.dia, 12, 0);
  while (cursor < limite) {
    cursor = new Date(cursor.getTime() + DIA);
    const dSemana = partesLocais(cursor).diaSemana;
    if (dSemana >= 1 && dSemana <= 5) conta++;
  }
  return conta;
}

export function precisaLembrete(enviadoEm, agora, jaLembrado, respondeu) {
  if (jaLembrado || respondeu) return false;
  return diasUteisEntre(enviadoEm, agora) >= E.diasUteisLembrete;
}
