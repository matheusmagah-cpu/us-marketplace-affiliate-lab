// Raspa resultados do Google Maps com um navegador real (Playwright), devagar, como uma pessoa.
import { normalizarTelefone } from '../telefone.js';
import { nomeNormalizado } from '../dedup.js';
import config from '../../config/config.js';

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
const pausaHumana = () => esperar(2000 + Math.random() * 4000);

function coordenadasDaUrl(url) {
  const m = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  return m ? { lat: Number(m[1]), lng: Number(m[2]) } : {};
}

function enderecoEhDaCidade(endereco, cidade) {
  return nomeNormalizado(endereco).includes(nomeNormalizado(cidade));
}

async function rolarLista(page) {
  const feed = page.locator('div[role="feed"]');
  if (!(await feed.count())) return;
  let anterior = -1;
  let semCrescer = 0;
  while (semCrescer < 3) {
    await feed.evaluate((el) => el.scrollBy(0, el.scrollHeight));
    await pausaHumana();
    const fim = await page.getByText('Você chegou ao final da lista').count();
    const qtd = await page.locator('a[href*="/maps/place/"]').count();
    if (fim) break;
    semCrescer = qtd === anterior ? semCrescer + 1 : 0;
    anterior = qtd;
  }
}

async function textoOuNada(locator) {
  return (await locator.count()) ? (await locator.first().innerText()).trim() : undefined;
}

export async function buscarMaps(page, cidade, termo) {
  const consulta = `${termo} em ${cidade} ${config.uf}`;
  await page.goto(`https://www.google.com/maps/search/${encodeURIComponent(consulta)}`, { waitUntil: 'domcontentloaded' });
  await pausaHumana();
  await rolarLista(page);

  const links = await page.locator('a[href*="/maps/place/"]').evaluateAll((as) => [...new Set(as.map((a) => a.href))]);
  const registros = [];

  for (const link of links) {
    await page.goto(link, { waitUntil: 'domcontentloaded' });
    await pausaHumana();
    const nome = await textoOuNada(page.locator('h1'));
    const endereco = (await page.locator('button[data-item-id="address"]').getAttribute('aria-label').catch(() => null))?.replace(/^Endereço:\s*/, '')
      ?? await textoOuNada(page.locator('button[data-item-id="address"]'));
    const idTelefone = await page.locator('button[data-item-id^="phone:tel:"]').first().getAttribute('data-item-id').catch(() => null);
    const telefoneBruto = idTelefone?.replace('phone:tel:', '');
    const notaTexto = await textoOuNada(page.locator('div.F7nice span[aria-hidden="true"]'));
    const avaliacoesTexto = await textoOuNada(page.locator('div.F7nice span[aria-label*="avalia"]'));

    if (!nome || !endereco || !enderecoEhDaCidade(endereco, cidade)) continue;

    const tel = normalizarTelefone(telefoneBruto, config.dddPadrao);
    registros.push({
      nome,
      cidade,
      endereco,
      ...coordenadasDaUrl(page.url()),
      telefoneBruto,
      telefone: tel.numero ?? undefined,
      tipoTelefone: tel.tipo,
      fonte: 'maps',
      nota: notaTexto ? Number(notaTexto.replace(',', '.')) : undefined,
      avaliacoes: avaliacoesTexto ? Number(avaliacoesTexto.replace(/\D/g, '')) : undefined,
      linkMaps: page.url(),
    });
  }
  return registros;
}
