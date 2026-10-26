// Busca borracharias/auto centers no OpenStreetMap (Overpass API, grátis).
import { normalizarTelefone } from '../telefone.js';
import config from '../../config/config.js';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

export function consultaOverpass(cidade, uf) {
  return `[out:json][timeout:90];
area["ISO3166-2"="BR-${uf}"]->.uf;
area["name"="${cidade}"]["boundary"="administrative"]["admin_level"="8"](area.uf)->.a;
(
  nwr["shop"="tyres"](area.a);
  nwr["shop"="car_repair"](area.a);
  nwr["craft"="car_repair"](area.a);
);
out center tags;`;
}

function enderecoDasTags(t) {
  const rua = t['addr:street'];
  if (!rua) return undefined;
  return t['addr:housenumber'] ? `${rua}, ${t['addr:housenumber']}` : rua;
}

export function converterOverpass(json, cidade) {
  return (json.elements || [])
    .filter((el) => el.tags?.name)
    .map((el) => {
      const t = el.tags;
      const telefoneBruto = t.phone || t['contact:phone'] || t['contact:whatsapp'] || t.mobile;
      const tel = normalizarTelefone(telefoneBruto, config.dddPadrao);
      return {
        nome: t.name,
        cidade,
        endereco: enderecoDasTags(t),
        lat: el.lat ?? el.center?.lat,
        lng: el.lon ?? el.center?.lon,
        telefoneBruto,
        telefone: tel.numero ?? undefined,
        tipoTelefone: tel.tipo,
        fonte: 'osm',
        linkMaps: `https://www.openstreetmap.org/${el.type}/${el.id}`,
      };
    });
}

export async function buscarOsm(cidade) {
  const resp = await fetch(OVERPASS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'data=' + encodeURIComponent(consultaOverpass(cidade, config.uf)),
  });
  if (!resp.ok) throw new Error(`Overpass respondeu ${resp.status} para ${cidade}`);
  return converterOverpass(await resp.json(), cidade);
}
