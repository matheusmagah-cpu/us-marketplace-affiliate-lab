// Uso: npm run mapear            (todas as cidades)
//      npm run mapear -- --cidade "Quatis"
import { chromium } from 'playwright';
import config from '../../config/config.js';
import { abrirBanco, salvarEstabelecimento } from '../db.js';
import { buscarOsm } from './osm.js';
import { buscarMaps } from './maps.js';
import { whatsappDoSite } from './site.js';
import { normalizarTelefone } from '../telefone.js';

function cidadesEscolhidas() {
  const i = process.argv.indexOf('--cidade');
  if (i === -1) return config.cidades;
  const pedida = process.argv[i + 1];
  if (!config.cidades.includes(pedida)) {
    console.error(`Cidade "${pedida}" não está na lista do config.`);
    process.exit(1);
  }
  return [pedida];
}

const db = abrirBanco();
const navegador = await chromium.launch({ headless: false });
const page = await navegador.newPage({ locale: 'pt-BR' });

for (const cidade of cidadesEscolhidas()) {
  const resumo = { encontrados: 0, novos: 0, celulares: 0 };
  const guardar = async (regs) => {
    for (const reg of regs) {
      // WhatsApp oficial do site tem prioridade sobre o telefone do cadastro.
      const doSite = (await whatsappDoSite(reg.site))[0];
      if (doSite) {
        reg.telefone = doSite;
        reg.tipoTelefone = normalizarTelefone(doSite).tipo;
      }
      resumo.encontrados++;
      if (salvarEstabelecimento(db, reg).novo) resumo.novos++;
      if (reg.tipoTelefone === 'celular') resumo.celulares++;
    }
  };

  try {
    await guardar(await buscarOsm(cidade));
  } catch (e) {
    console.warn(`OSM falhou em ${cidade}: ${e.message}`);
  }
  for (const termo of config.termos) {
    try {
      await guardar(await buscarMaps(page, cidade, termo));
    } catch (e) {
      console.warn(`Google Maps falhou em ${cidade} / ${termo}: ${e.message}`);
    }
  }
  console.log(`${cidade}: ${resumo.encontrados} encontrados, ${resumo.novos} novos, ${resumo.celulares} com celular`);
}

await navegador.close();
