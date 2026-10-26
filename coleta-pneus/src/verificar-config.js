// Não deixa o robô começar com campos de configuração em branco.
export function camposPendentes(config) {
  const faltando = [];
  if (/PREENCHER/.test(config.empresa.nome)) faltando.push('empresa.nome');
  if (/PREENCHER/.test(config.ofertaRemold)) faltando.push('ofertaRemold');
  return faltando;
}

export function verificarConfig(config) {
  const faltando = camposPendentes(config);
  if (faltando.length) {
    console.error(`Preencha em config/config.js antes de enviar: ${faltando.join(', ')}`);
    process.exit(1);
  }
}
