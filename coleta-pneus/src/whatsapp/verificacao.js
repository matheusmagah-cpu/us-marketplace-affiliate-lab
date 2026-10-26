// Confirma no próprio WhatsApp se o número existe e dá a nota de confiança.
import { confiancaDoNumero } from '../numeros.js';

export async function verificarEstabelecimento(client, est) {
  const id = await client.getNumberId(est.telefone);
  if (!id) return { tem_whatsapp: 0, status: est.status === 'pronto' ? 'sem_whatsapp' : est.status };
  const wid = id._serialized;
  let ehBusiness = false;
  let nomePerfil = null;
  try {
    const contato = await client.getContactById(wid);
    ehBusiness = Boolean(contato.isBusiness);
    nomePerfil = contato.verifiedName || contato.pushname || null;
  } catch {
    // sem perfil disponível: fica como confiança média
  }
  return {
    tem_whatsapp: 1,
    whatsapp_id: wid,
    confianca: confiancaDoNumero({ ehBusiness, nomePerfil, nomeEstabelecimento: est.nome }),
    status: est.status === 'sem_whatsapp' ? 'pronto' : est.status,
  };
}
