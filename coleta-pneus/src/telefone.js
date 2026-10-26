// Normaliza telefones brasileiros para o formato 55DDNNNNNNNNN e diz se é celular ou fixo.

const PREFIXOS_INVALIDOS = ['0800', '0300', '0500', '0900'];

export function normalizarTelefone(bruto, dddPadrao = '24') {
  const invalido = { numero: null, tipo: 'invalido' };
  if (!bruto) return invalido;

  let digitos = String(bruto).replace(/\D/g, '');
  if (PREFIXOS_INVALIDOS.some((p) => digitos.startsWith(p))) return invalido;

  if (digitos.startsWith('55') && digitos.length >= 12) digitos = digitos.slice(2);
  if (digitos.startsWith('0')) digitos = digitos.replace(/^0+/, '');
  if (digitos.length === 8 || digitos.length === 9) digitos = dddPadrao + digitos;

  if (digitos.length === 11 && digitos[2] === '9') {
    return { numero: '55' + digitos, tipo: 'celular' };
  }
  if (digitos.length === 10 && '2345'.includes(digitos[2])) {
    return { numero: '55' + digitos, tipo: 'fixo' };
  }
  return invalido;
}

// Variações do número para achar o contato no WhatsApp (com e sem o 9º dígito).
export function variacoesDoNumero(numero) {
  const d = String(numero || '').replace(/\D/g, '');
  const vars = new Set([d]);
  if (d.length === 13 && d[4] === '9') vars.add(d.slice(0, 4) + d.slice(5));
  if (d.length === 12) vars.add(d.slice(0, 4) + '9' + d.slice(4));
  return [...vars];
}
