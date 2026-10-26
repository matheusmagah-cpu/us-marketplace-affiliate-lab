// Lê a cidade do endereço do Google Maps ("Rua X, 10 - Bairro, Cidade - RJ, 27000-000").
import { nomeNormalizado } from '../dedup.js';
import config from '../../config/config.js';

export function cidadeDoEndereco(endereco, uf = config.uf) {
  const achados = [...String(endereco || '').matchAll(new RegExp(`([^,\\-]+?)\\s*-\\s*${uf}\\b`, 'g'))];
  return achados.length ? achados.at(-1)[1].trim() : null;
}

// Compara a cidade inteira (evita "Piraí" aceitar "Barra do Piraí").
export function enderecoEhDaCidade(endereco, cidade) {
  const doEndereco = cidadeDoEndereco(endereco);
  return doEndereco != null && nomeNormalizado(doEndereco) === nomeNormalizado(cidade);
}
