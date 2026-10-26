// Qualidade dos números: só número de WhatsApp real recebe mensagem.
import { nomeNormalizado } from './dedup.js';
import { normalizarTelefone } from './telefone.js';
import config from '../config/config.js';

// alta = conta comercial ou nome do perfil parecido com o do estabelecimento.
export function confiancaDoNumero({ ehBusiness, nomePerfil, nomeEstabelecimento }) {
  if (ehBusiness) return 'alta';
  const perfil = nomeNormalizado(nomePerfil);
  const estab = nomeNormalizado(nomeEstabelecimento);
  if (perfil && estab && (perfil === estab || perfil.includes(estab) || estab.includes(perfil))) return 'alta';
  return 'media';
}

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
