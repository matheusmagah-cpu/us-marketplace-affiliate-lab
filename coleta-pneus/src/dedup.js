// Decide se dois registros são o mesmo estabelecimento (vindos do Maps e do OSM, por exemplo).

const RAIO_MESMO_LOCAL_M = 80;

export function distanciaMetros(lat1, lng1, lat2, lng2) {
  const rad = (g) => (g * Math.PI) / 180;
  const dLat = rad(lat2 - lat1);
  const dLng = rad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function nomeNormalizado(nome) {
  return String(nome || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function nomesParecidos(a, b) {
  const na = nomeNormalizado(a);
  const nb = nomeNormalizado(b);
  if (!na || !nb) return false;
  return na === nb || na.includes(nb) || nb.includes(na);
}

function temCoordenadas(r) {
  return Number.isFinite(r.lat) && Number.isFinite(r.lng);
}

export function mesmoEstabelecimento(a, b) {
  if (a.telefone && b.telefone) return a.telefone === b.telefone;
  if (!temCoordenadas(a) || !temCoordenadas(b)) return false;
  return nomesParecidos(a.nome, b.nome) && distanciaMetros(a.lat, a.lng, b.lat, b.lng) < RAIO_MESMO_LOCAL_M;
}
