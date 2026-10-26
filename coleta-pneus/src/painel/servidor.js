// Painel local: npm run painel  ->  http://localhost:3000
import express from 'express';
import { timingSafeEqual } from 'node:crypto';
import QRCode from 'qrcode';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { criarMcp } from '../mcp.js';
import { calcularFunil } from '../funil.js';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import config from '../../config/config.js';
import {
  abrirBanco, listarEstabelecimentos, obterEstabelecimento, atualizarEstabelecimento,
  listarMensagens, salvarColeta, atualizarColeta, listarColetas, gravarAjuste, lerAjuste, marcarOptout,
} from '../db.js';
import { montarRota, valorColeta } from '../rota.js';

const STATUS_VALIDOS = new Set([
  'pronto', 'sem_whatsapp', 'enviado', 'respondeu', 'aceitou', 'recusou', 'optout', 'coleta_agendada', 'recolhido', 'invalido',
]);
const REMOLD_VALIDOS = new Set(['sim', 'nao', 'desconhecido']);

function iguais(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
}

function exigirSenha(usuario, senha) {
  return (req, res, next) => {
    const [tipo, valor] = String(req.headers.authorization || '').split(' ');
    if (tipo === 'Basic' && valor) {
      const [u, ...resto] = Buffer.from(valor, 'base64').toString().split(':');
      if (iguais(u, usuario) && iguais(resto.join(':'), senha)) return next();
    }
    res.set('WWW-Authenticate', 'Basic realm="Coleta de Pneus", charset="UTF-8"').status(401).json({ erro: 'login necessário' });
  };
}

// opcoes.usuario/senha ligam o login do painel; opcoes.mcpToken liga o endpoint /mcp.
export function criarApp(db, opcoes = {}) {
  const app = express();
  app.use(express.json());

  if (opcoes.mcpToken) {
    app.post('/mcp', async (req, res) => {
      const [tipo, token] = String(req.headers.authorization || '').split(' ');
      if (tipo !== 'Bearer' || !iguais(token || '', opcoes.mcpToken)) return res.status(401).json({ erro: 'token inválido' });
      const mcp = criarMcp(db, { aoMapear: opcoes.aoMapear });
      const transporte = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
      res.on('close', () => { transporte.close(); mcp.close(); });
      await mcp.connect(transporte);
      await transporte.handleRequest(req, res, req.body);
    });
  }

  if (opcoes.usuario && opcoes.senha) app.use(exigirSenha(opcoes.usuario, opcoes.senha));
  app.use(express.static(join(dirname(fileURLToPath(import.meta.url)), 'public')));

  app.get('/api/whatsapp', async (req, res) => {
    const qr = lerAjuste(db, 'whatsapp_qr');
    res.json({
      status: lerAjuste(db, 'whatsapp_status') || 'desconectado',
      qr: qr ? await QRCode.toDataURL(qr) : null,
    });
  });

  app.get('/api/estabelecimentos', (req, res) => {
    res.json(listarEstabelecimentos(db, req.query));
  });

  app.get('/api/funil', (req, res) => {
    res.json(calcularFunil(listarEstabelecimentos(db)));
  });

  app.get('/api/estabelecimentos/:id', (req, res) => {
    const e = obterEstabelecimento(db, Number(req.params.id));
    if (!e) return res.status(404).json({ erro: 'não encontrado' });
    res.json({ ...e, mensagens: listarMensagens(db, e.id), coletas: listarColetas(db, { estabelecimentoId: e.id }) });
  });

  app.patch('/api/estabelecimentos/:id', (req, res) => {
    const { status, trabalha_remold, observacoes } = req.body;
    if (status !== undefined && !STATUS_VALIDOS.has(status)) return res.status(400).json({ erro: 'status inválido' });
    if (trabalha_remold !== undefined && !REMOLD_VALIDOS.has(trabalha_remold)) return res.status(400).json({ erro: 'valor de remold inválido' });
    const campos = { status, trabalha_remold, observacoes };
    if (status === 'optout') {
      const e = obterEstabelecimento(db, Number(req.params.id));
      if (e) marcarOptout(db, e);
    }
    atualizarEstabelecimento(db, Number(req.params.id), Object.fromEntries(Object.entries(campos).filter(([, v]) => v !== undefined)));
    res.json(obterEstabelecimento(db, Number(req.params.id)));
  });

  app.post('/api/estabelecimentos/:id/responder', (req, res) => {
    const texto = String(req.body.texto || '').trim();
    if (!texto) return res.status(400).json({ erro: 'texto vazio' });
    const e = obterEstabelecimento(db, Number(req.params.id));
    if (!e) return res.status(404).json({ erro: 'não encontrado' });
    if (e.optout) return res.status(409).json({ erro: 'este contato pediu para não receber mensagens' });
    db.prepare("INSERT INTO fila_envio (estabelecimento_id, campanha, texto) VALUES (?, 'manual', ?)").run(Number(req.params.id), texto);
    res.status(201).json({ ok: true });
  });

  app.post('/api/coletas', (req, res) => {
    const { estabelecimentoId, dataPrevista, qtdPrevista } = req.body;
    if (!estabelecimentoId || !/^\d{4}-\d{2}-\d{2}$/.test(dataPrevista || '')) return res.status(400).json({ erro: 'dados inválidos' });
    if (!obterEstabelecimento(db, Number(estabelecimentoId))) return res.status(404).json({ erro: 'não encontrado' });
    const id = salvarColeta(db, { estabelecimentoId, dataPrevista, qtdPrevista: qtdPrevista ?? null });
    atualizarEstabelecimento(db, estabelecimentoId, { status: 'coleta_agendada' });
    res.status(201).json({ id });
  });

  app.patch('/api/coletas/:id', (req, res) => {
    const { qtdReal, status } = req.body;
    if (status && !['agendada', 'feita', 'cancelada'].includes(status)) return res.status(400).json({ erro: 'status inválido' });
    const coleta = atualizarColeta(db, Number(req.params.id), {
      qtdReal, status, valor: qtdReal != null ? valorColeta(qtdReal) : undefined,
    });
    if (!coleta) return res.status(404).json({ erro: 'não encontrada' });
    if (status === 'feita') atualizarEstabelecimento(db, coleta.estabelecimento_id, { status: 'recolhido' });
    if (status === 'cancelada') atualizarEstabelecimento(db, coleta.estabelecimento_id, { status: 'aceitou' });
    res.json(coleta);
  });

  app.get('/api/rotas', (req, res) => {
    const cidades = req.query.cidades ? String(req.query.cidades).split(',') : undefined;
    const coletas = listarColetas(db, { data: req.query.data, cidades }).filter((c) => c.status === 'agendada');
    res.json(montarRota({ lat: config.empresa.lat, lng: config.empresa.lng }, coletas));
  });

  app.get('/api/estado', (req, res) => res.json({ pausado: lerAjuste(db, 'envios_pausados') === '1', cidades: config.cidades }));
  app.post('/api/pausar', (req, res) => { gravarAjuste(db, 'envios_pausados', '1'); res.json({ pausado: true }); });
  app.post('/api/retomar', (req, res) => { gravarAjuste(db, 'envios_pausados', '0'); res.json({ pausado: false }); });

  return app;
}

if (process.argv[1]?.endsWith('servidor.js')) {
  // Só este computador acessa o painel (ninguém da rede local).
  criarApp(abrirBanco()).listen(3000, '127.0.0.1', () => console.log('Painel em http://localhost:3000'));
}
