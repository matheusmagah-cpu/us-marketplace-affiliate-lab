// Modelos de mensagem. Edite à vontade, mas mantenha {nome}, {cidade} e a frase de saída.

export const FRASE_OPTOUT = 'Se não quiser receber mensagens, é só responder "sair".';

const MODELOS = {
  coleta: [
    'Bom dia, pessoal da {nome}! Aqui é da {empresa}, de {cidade_base}. Fazemos recolha de pneus de descarte aí em {cidade}: buscamos no local e cobramos só {preco} por pneu. Vocês têm pneus parados para descartar?',
    'Olá, {nome}! Tudo bem? Sou da {empresa} ({cidade_base}). Estamos recolhendo pneus de descarte nas borracharias de {cidade}, a {preco} por pneu, e a gente vai buscar. Tem pneu velho acumulado aí?',
    'Oi, equipe da {nome}! Aqui é da {empresa}. Passamos em {cidade} recolhendo pneus inservíveis: {preco} por pneu, retirada no local. Posso incluir vocês na próxima rota?',
  ],
  lembrete: [
    'Oi, pessoal da {nome}! Só passando de novo: a {empresa} está montando a rota de recolha de pneus em {cidade} ({preco} por pneu, buscamos no local). Querem que a gente passe aí?',
    'Olá, {nome}! Ainda dá tempo de entrar na rota de recolha de pneus de {cidade} desta semana. Tem pneus para descartar?',
  ],
  remold: [
    'Oi, pessoal da {nome}! Aqui é da {empresa}, que fez a recolha de pneus aí. Também fabricamos pneu remold: {oferta}. Posso mandar a tabela de medidas e preços?',
    'Olá, {nome}! Além da recolha, a {empresa} fabrica pneu remold aqui na região: {oferta}. Vocês trabalham com remold? Quer receber nossos preços?',
  ],
};

const COM_OPTOUT = new Set(['coleta', 'remold']);

export function montarMensagem(tipo, est, cfg, rng = Math.random) {
  const opcoes = MODELOS[tipo];
  if (!opcoes) throw new Error(`Tipo de mensagem desconhecido: ${tipo}`);
  const modelo = opcoes[Math.min(opcoes.length - 1, Math.floor(rng() * opcoes.length))];
  const valores = {
    nome: est.nome,
    cidade: est.cidade,
    empresa: cfg.empresa.nome,
    cidade_base: cfg.empresa.cidadeBase,
    preco: 'R$1,50',
    oferta: cfg.ofertaRemold,
  };
  const texto = modelo.replace(/\{(\w+)\}/g, (_, chave) => valores[chave] ?? '');
  return COM_OPTOUT.has(tipo) ? `${texto} ${FRASE_OPTOUT}` : texto;
}
