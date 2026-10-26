// Conexão MCP: deixa o Claude consultar e operar o sistema quando o dono pedir.
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import config from '../config/config.js';
import {
  listarEstabelecimentos, obterEstabelecimento, listarMensagens, listarColetas, salvarColeta,
  atualizarEstabelecimento, gravarAjuste,
} from './db.js';
import { montarRota } from './rota.js';
import { calcularFunil } from './funil.js';

const texto = (dado) => ({ content: [{ type: 'text', text: typeof dado === 'string' ? dado : JSON.stringify(dado, null, 2) }] });

export function criarMcp(db, { aoMapear } = {}) {
  const mcp = new McpServer({ name: 'coleta-pneus', version: '2.0.0' });

  mcp.registerTool('funil', {
    description: 'Funil por cidade: mapeados, com WhatsApp, contatados, responderam, aceitaram, recolhidos.',
    inputSchema: {},
  }, async () => texto(calcularFunil(listarEstabelecimentos(db))));

  mcp.registerTool('listar_contatos', {
    description: 'Lista borracharias/auto centers com filtros opcionais.',
    inputSchema: {
      cidade: z.string().optional(),
      status: z.string().optional(),
      remold: z.enum(['sim', 'nao', 'desconhecido']).optional(),
    },
  }, async (filtros) => texto(listarEstabelecimentos(db, filtros).map((e) => ({
    id: e.id, nome: e.nome, cidade: e.cidade, telefone: e.telefone, status: e.status, confianca: e.confianca, remold: e.trabalha_remold,
  }))));

  mcp.registerTool('conversa', {
    description: 'Dados, mensagens e coletas de um contato.',
    inputSchema: { id: z.number().int() },
  }, async ({ id }) => {
    const e = obterEstabelecimento(db, id);
    if (!e) return texto('Contato não encontrado.');
    return texto({ ...e, mensagens: listarMensagens(db, id), coletas: listarColetas(db, { estabelecimentoId: id }) });
  });

  mcp.registerTool('agendar_coleta', {
    description: 'Agenda uma coleta (data AAAA-MM-DD).',
    inputSchema: { id: z.number().int(), data: z.string(), qtd_pneus: z.number().int().optional() },
  }, async ({ id, data, qtd_pneus: qtd }) => {
    if (!obterEstabelecimento(db, id)) return texto('Contato não encontrado.');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return texto('Data inválida, use AAAA-MM-DD.');
    const coleta = salvarColeta(db, { estabelecimentoId: id, dataPrevista: data, qtdPrevista: qtd ?? null });
    atualizarEstabelecimento(db, id, { status: 'coleta_agendada' });
    return texto(`Coleta ${coleta} agendada para ${data}.`);
  });

  mcp.registerTool('responder', {
    description: 'Coloca uma mensagem na fila para o robô enviar pelo WhatsApp a um contato.',
    inputSchema: { id: z.number().int(), texto: z.string().min(1) },
  }, async ({ id, texto: msg }) => {
    const e = obterEstabelecimento(db, id);
    if (!e) return texto('Contato não encontrado.');
    if (e.optout) return texto('Este contato pediu para não receber mensagens.');
    db.prepare("INSERT INTO fila_envio (estabelecimento_id, campanha, texto) VALUES (?, 'manual', ?)").run(id, msg);
    return texto('Mensagem na fila; o robô envia em até 30 segundos.');
  });

  mcp.registerTool('rota', {
    description: 'Monta a rota de coleta de uma data (AAAA-MM-DD).',
    inputSchema: { data: z.string() },
  }, async ({ data }) => texto(montarRota(
    { lat: config.empresa.lat, lng: config.empresa.lng },
    listarColetas(db, { data }).filter((c) => c.status === 'agendada'),
  )));

  mcp.registerTool('pausar', { description: 'Pausa os envios automáticos.', inputSchema: {} }, async () => {
    gravarAjuste(db, 'envios_pausados', '1');
    return texto('Envios pausados.');
  });

  mcp.registerTool('retomar', { description: 'Retoma os envios automáticos.', inputSchema: {} }, async () => {
    gravarAjuste(db, 'envios_pausados', '0');
    return texto('Envios retomados.');
  });

  if (aoMapear) {
    mcp.registerTool('mapear_cidade', {
      description: 'Roda o mapeamento (Google Maps + OpenStreetMap) de uma cidade da lista.',
      inputSchema: { cidade: z.enum(config.cidades) },
    }, async ({ cidade }) => {
      aoMapear(cidade);
      return texto(`Mapeamento de ${cidade} iniciado; os novos contatos aparecem no funil quando terminar.`);
    });
  }

  return mcp;
}
