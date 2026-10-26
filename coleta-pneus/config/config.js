// Configuração do sistema de coleta de pneus.
// Na nuvem, os campos da empresa vêm do arquivo .env (veja .env.exemplo).
// No computador, você pode editar direto os campos marcados com PREENCHER.
import { existsSync } from 'node:fs';

if (existsSync('.env')) process.loadEnvFile('.env');
const env = process.env;
const numero = (v, padrao) => (v != null && v !== '' && !Number.isNaN(Number(v)) ? Number(v) : padrao);

const config = {
  uf: 'RJ',
  dddPadrao: '24',

  // Cidades prospectadas. Volta Redonda NÃO entra (é só o ponto de saída das rotas).
  cidades: [
    'Barra Mansa',
    'Pinheiral',
    'Porto Real',
    'Quatis',
    'Resende',
    'Itatiaia',
    'Barra do Piraí',
    'Piraí',
    'Rio Claro',
    'Valença',
    'Mendes',
    'Engenheiro Paulo de Frontin',
    'Miguel Pereira',
    'Vassouras',
  ],

  termos: [
    'borracharia',
    'auto center',
    'pneus',
    'alinhamento e balanceamento',
    'recapagem',
    'loja de pneus',
  ],

  precoPorPneu: 1.5,

  empresa: {
    nome: env.EMPRESA_NOME || 'PREENCHER',
    cidadeBase: 'Volta Redonda',
    // Ponto de saída das rotas. Confira as coordenadas no Google Maps
    // (clique com o botão direito no local > copie os números).
    endereco: 'Av. Adalberto Barros Nunes, Retiro, Volta Redonda - RJ',
    lat: numero(env.EMPRESA_LAT, -22.4985),
    lng: numero(env.EMPRESA_LNG, -44.1300),
  },

  envio: {
    fusoHorario: 'America/Sao_Paulo',
    // dia da semana (0 = domingo) -> janela [início, fim] em "HH:MM"
    janelas: {
      1: ['08:30', '17:30'],
      2: ['08:30', '17:30'],
      3: ['08:30', '17:30'],
      4: ['08:30', '17:30'],
      5: ['08:30', '17:30'],
      6: ['08:30', '12:00'],
    },
    limiteInicial: 20,
    incrementoSemanal: 10,
    teto: 60,
    intervaloMinMin: 3,
    intervaloMaxMin: 9,
    diasUteisLembrete: 3,
    falhasParaParar: 3,
    // Data em que a campanha começou (usada para subir o limite diário aos poucos).
    inicioCampanha: env.INICIO_CAMPANHA || '2026-11-02',
  },

  // Seus números para o modo de teste (formato 55DDNNNNNNNNN).
  numerosTeste: (env.NUMEROS_TESTE || '').split(',').map((n) => n.trim()).filter(Boolean),

  // Texto da oferta de remold usado na campanha da fase 2.
  ofertaRemold: env.OFERTA_REMOLD || 'PREENCHER (ex.: pneus remold aro 13 a 15, a partir de R$ X, entrega na região)',
};

export default config;
