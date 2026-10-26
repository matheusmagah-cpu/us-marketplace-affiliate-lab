// Não deixa o robô começar com campos em branco ou com os valores de exemplo do .env.exemplo.
const EXEMPLOS_NOME = ['PREENCHER', 'Nome da sua empresa'];
const EXEMPLO_DONO = '5524999999999';

export function camposPendentes(config, env = process.env) {
  const faltando = [];
  const nome = String(config.empresa.nome || '').trim();
  if (!nome || EXEMPLOS_NOME.some((x) => nome.includes(x))) faltando.push('EMPRESA_NOME');
  const oferta = String(config.ofertaRemold || '');
  if (!oferta.trim() || /PREENCHER|R\$ ?X\b/.test(oferta)) faltando.push('OFERTA_REMOLD');
  const dono = String(env.DONO_WHATSAPP || '').replace(/\D/g, '');
  if (dono.length < 12 || dono === EXEMPLO_DONO) faltando.push('DONO_WHATSAPP');
  return faltando;
}

export function verificarConfig(config, env = process.env) {
  const faltando = camposPendentes(config, env);
  if (faltando.length) {
    console.error(`Preencha no arquivo .env antes de ligar o robô: ${faltando.join(', ')}`);
    process.exit(1);
  }
}
