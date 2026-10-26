// Monta rotas de coleta: ordem pelo vizinho mais próximo, links do Google Maps e valor a cobrar.
import { distanciaMetros } from './dedup.js';
import config from '../config/config.js';

const MAX_PARADAS = 10;

export function ordenarParadas(origem, paradas) {
  const restantes = [...paradas];
  const ordem = [];
  let atual = origem;
  while (restantes.length) {
    let melhor = 0;
    for (let i = 1; i < restantes.length; i++) {
      if (distanciaMetros(atual.lat, atual.lng, restantes[i].lat, restantes[i].lng)
        < distanciaMetros(atual.lat, atual.lng, restantes[melhor].lat, restantes[melhor].lng)) melhor = i;
    }
    atual = restantes.splice(melhor, 1)[0];
    ordem.push(atual);
  }
  return ordem;
}

export function dividirRota(paradas, max = MAX_PARADAS) {
  const blocos = [];
  for (let i = 0; i < paradas.length; i += max) blocos.push(paradas.slice(i, i + max));
  return blocos;
}

const ponto = (p) => `${p.lat},${p.lng}`;

export function linkGoogleMaps(origem, paradas) {
  const destino = paradas.at(-1);
  const meio = paradas.slice(0, -1);
  let url = `https://www.google.com/maps/dir/?api=1&origin=${ponto(origem)}&destination=${ponto(destino)}`;
  if (meio.length) url += `&waypoints=${meio.map(ponto).join('%7C')}`;
  return url + '&travelmode=driving';
}

export function valorColeta(qtdPneus) {
  return Math.round((qtdPneus || 0) * config.precoPorPneu * 100) / 100;
}

export function montarRota(origem, coletas) {
  const comCoordenadas = coletas.filter((c) => Number.isFinite(c.lat) && Number.isFinite(c.lng));
  const semCoordenadas = coletas.filter((c) => !(Number.isFinite(c.lat) && Number.isFinite(c.lng)));
  const rotas = [];
  let inicio = origem;
  for (const bloco of dividirRota(ordenarParadas(origem, comCoordenadas))) {
    rotas.push({ link: linkGoogleMaps(inicio, bloco), paradas: bloco });
    inicio = bloco.at(-1);
  }
  const totalPneus = coletas.reduce((s, c) => s + (c.qtd_pneus_prevista || 0), 0);
  return { rotas, semCoordenadas, totalPneus, totalValor: valorColeta(totalPneus) };
}
