// Painel local: npm run painel  ->  http://localhost:3000
import express from 'express';
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

const CONTA_FUNIL = {
  comWhatsapp: (e) => e.tem_whatsapp === 1,
  enviados: (e) => !['pronto', 'sem_whatsapp'].includes(e.status),
  responderam: (e) => ['respondeu', 'aceitou', 'recusou', 'optout', 'coleta_agendada', 'recolhido'].includes(e.status),
  aceitaram: (e) => ['aceitou', 'coleta_agendada', 'recolhido'].includes(e.status),
  recolhidos: (e) => e.status === 'recolhido',
};

export function criarApp(db) {
  const app = express();
  app.use(express.json());
  app.use(express.static(join(dirname(fileURLToPath(import.meta.url)), 'public')));

  app.get('/api/estabelecimentos', (req, res) => {
    res.json(listarEstabelecimentos(db, req.query));
  });

  app.get('/api/funil', (req, res) => {
    const funil = {};
    for (const e of listarEstabelecimentos(db)) {
      const f = (funil[e.cidade] ??= { mapeados: 0, ...Object.fromEntries(Object.keys(CONTA_FUNIL).map((k) => [k, 0])) });
      f.mapeados++;
      for (const [k, conta] of Object.entries(CONTA_FUNIL)) if (conta(e)) f[k]++;
    }
    res.json(funil);
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
