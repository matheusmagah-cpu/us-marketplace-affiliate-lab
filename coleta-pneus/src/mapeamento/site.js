// Procura o WhatsApp oficial no site do estabelecimento (links wa.me / api.whatsapp.com).
import { extrairWhatsappDoHtml } from '../numeros.js';

export async function whatsappDoSite(url) {
  if (!url || !/^https?:\/\//.test(url)) return [];
  try {
    const resp = await fetch(url, { signal: AbortSignal.timeout(10000), redirect: 'follow' });
    if (!resp.ok) return [];
    return extrairWhatsappDoHtml(await resp.text());
  } catch {
    return [];
  }
}
