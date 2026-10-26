// Contagem do funil por cidade (usado pelo painel e pelo MCP).

const CONTA_FUNIL = {
  comWhatsapp: (e) => e.tem_whatsapp === 1,
  enviados: (e) => !['pronto', 'sem_whatsapp', 'invalido'].includes(e.status),
  responderam: (e) => ['respondeu', 'aceitou', 'recusou', 'optout', 'coleta_agendada', 'recolhido'].includes(e.status),
  aceitaram: (e) => ['aceitou', 'coleta_agendada', 'recolhido'].includes(e.status),
  recolhidos: (e) => e.status === 'recolhido',
};

export function calcularFunil(estabelecimentos) {
  const funil = {};
  for (const e of estabelecimentos) {
    const f = (funil[e.cidade] ??= { mapeados: 0, ...Object.fromEntries(Object.keys(CONTA_FUNIL).map((k) => [k, 0])) });
    f.mapeados++;
    for (const [k, conta] of Object.entries(CONTA_FUNIL)) if (conta(e)) f[k]++;
  }
  return funil;
}
