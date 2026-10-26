// Qualidade dos números: só número de WhatsApp real recebe mensagem.
import { normalizarTelefone } from './telefone.js';
import config from '../config/config.js';

// Números de links de WhatsApp (wa.me e api.whatsapp.com) encontrados no HTML de um site.
export function extrairWhatsappDoHtml(html) {
  const achados = new Set();
  const padroes = [/wa\.me\/(\+?\d{10,13})/g, /api\.whatsapp\.com\/send\/?\?phone=(\+?\d{10,13})/g];
  for (const p of padroes) {
    for (const m of String(html || '').matchAll(p)) {
      const tel = normalizarTelefone(m[1], config.dddPadrao);
      if (tel.numero) achados.add(tel.numero);
    }
  }
  return [...achados];
}
