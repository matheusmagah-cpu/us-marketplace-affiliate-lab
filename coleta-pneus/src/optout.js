// Detecta quando o contato pediu para não receber mais mensagens.

// "não" sozinho é resposta a uma pergunta (recusa), não pedido para sair.
const EXATOS = new Set(['sair', 'pare', 'parar', 'stop', 'cancelar', 'chega']);
const FRASES = ['nao quero', 'pode parar', 'nao tenho interesse', 'remove', 'remova', 'nao me mande', 'nao mande', 'descadastr', 'nao envie', 'para de mandar', 'pare de mandar'];

function normalizar(texto) {
  return String(texto || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function ehOptout(texto) {
  const t = normalizar(texto);
  if (!t) return false;
  if (EXATOS.has(t)) return true;
  return FRASES.some((f) => t.includes(f));
}
