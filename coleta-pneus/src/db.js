// Banco SQLite local (node:sqlite, sem dependência nativa).
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { mesmoEstabelecimento } from './dedup.js';
import { variacoesDoNumero } from './telefone.js';
import { numeroDoJid } from './whatsapp/mensagem.js';

const ESQUEMA = `
CREATE TABLE IF NOT EXISTS estabelecimentos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  cidade TEXT NOT NULL,
  endereco TEXT,
  lat REAL,
  lng REAL,
  telefone_bruto TEXT,
  telefone TEXT,
  tipo_telefone TEXT,
  tem_whatsapp INTEGER,
  whatsapp_id TEXT,
  lid TEXT,
  confianca TEXT,
  site TEXT,
  fonte TEXT,
  nota REAL,
  avaliacoes INTEGER,
  link_maps TEXT,
  status TEXT NOT NULL,
  trabalha_remold TEXT NOT NULL DEFAULT 'desconhecido',
  optout INTEGER NOT NULL DEFAULT 0,
  observacoes TEXT,
  criado_em TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS mensagens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  estabelecimento_id INTEGER NOT NULL REFERENCES estabelecimentos(id),
  direcao TEXT NOT NULL,
  texto TEXT NOT NULL,
  campanha TEXT,
  data_hora TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS coletas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  estabelecimento_id INTEGER NOT NULL REFERENCES estabelecimentos(id),
  data_prevista TEXT NOT NULL,
  qtd_pneus_prevista INTEGER,
  qtd_pneus_real INTEGER,
  valor REAL,
  status TEXT NOT NULL DEFAULT 'agendada'
);
CREATE TABLE IF NOT EXISTS fila_envio (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  estabelecimento_id INTEGER NOT NULL REFERENCES estabelecimentos(id),
  campanha TEXT NOT NULL,
  texto TEXT,
  agendado_para TEXT,
  tentativa INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pendente'
);
CREATE TABLE IF NOT EXISTS whatsapp_mensagens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_msg TEXT UNIQUE,
  jid TEXT NOT NULL,
  jid_alt TEXT,
  numero TEXT,
  de_mim INTEGER NOT NULL,
  pelo_robo INTEGER NOT NULL DEFAULT 0,
  texto TEXT,
  quando TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_wm_numero ON whatsapp_mensagens(numero, quando);
CREATE TABLE IF NOT EXISTS ajustes (
  chave TEXT PRIMARY KEY,
  valor TEXT
);
`;

// Campo do registro (camelCase) -> coluna do banco.
const CAMPOS = {
  nome: 'nome',
  cidade: 'cidade',
  endereco: 'endereco',
  lat: 'lat',
  lng: 'lng',
  telefoneBruto: 'telefone_bruto',
  telefone: 'telefone',
  tipoTelefone: 'tipo_telefone',
  fonte: 'fonte',
  nota: 'nota',
  avaliacoes: 'avaliacoes',
  linkMaps: 'link_maps',
  site: 'site',
};

const COLUNAS_EDITAVEIS = new Set([
  'status', 'trabalha_remold', 'optout', 'observacoes', 'tem_whatsapp', 'whatsapp_id', 'lid', 'confianca', 'site',
  'telefone', 'tipo_telefone', 'endereco', 'lat', 'lng',
]);

export function abrirBanco(caminho = 'dados/coleta.db') {
  if (caminho !== ':memory:') mkdirSync(dirname(caminho), { recursive: true });
  const db = new DatabaseSync(caminho);
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec('PRAGMA busy_timeout = 5000;'); // o mapeamento escreve no mesmo banco em outro processo
  if (caminho !== ':memory:') db.exec('PRAGMA journal_mode = WAL;');
  db.exec(ESQUEMA);
  migrar(db);
  return db;
}

// Acrescenta colunas novas em bancos criados por versões anteriores.
function migrar(db) {
  const colunas = new Set(db.prepare('PRAGMA table_info(estabelecimentos)').all().map((c) => c.name));
  for (const c of ['whatsapp_id', 'lid', 'confianca', 'site']) {
    if (!colunas.has(c)) db.exec(`ALTER TABLE estabelecimentos ADD COLUMN ${c} TEXT`);
  }
}

function registroDaLinha(linha) {
  return { ...linha, telefone: linha.telefone ?? undefined, lat: linha.lat ?? undefined, lng: linha.lng ?? undefined };
}

export function salvarEstabelecimento(db, reg) {
  // Mesmo telefone = mesmo estabelecimento, em qualquer cidade.
  const existente = (reg.telefone && db.prepare('SELECT * FROM estabelecimentos WHERE telefone = ? ORDER BY id LIMIT 1').get(reg.telefone))
    || db.prepare('SELECT * FROM estabelecimentos WHERE cidade = ?').all(reg.cidade).find((l) => mesmoEstabelecimento(registroDaLinha(l), reg));

  if (existente) {
    const vazios = Object.entries(CAMPOS).filter(([campo, coluna]) => reg[campo] != null && reg[campo] !== '' && existente[coluna] == null);
    if (vazios.length) {
      const sets = vazios.map(([, coluna]) => `${coluna} = ?`).join(', ');
      db.prepare(`UPDATE estabelecimentos SET ${sets} WHERE id = ?`).run(...vazios.map(([campo]) => reg[campo]), existente.id);
    }
    if (reg.tipoTelefone === 'celular' && existente.status === 'sem_whatsapp' && existente.tem_whatsapp == null) {
      db.prepare("UPDATE estabelecimentos SET status = 'pronto' WHERE id = ?").run(existente.id);
    }
    return { id: existente.id, novo: false };
  }

  const status = reg.tipoTelefone === 'celular' ? 'pronto' : 'sem_whatsapp';
  const presentes = Object.entries(CAMPOS).filter(([campo]) => reg[campo] != null);
  const colunas = [...presentes.map(([, c]) => c), 'status'];
  const valores = [...presentes.map(([campo]) => reg[campo]), status];
  const r = db.prepare(`INSERT INTO estabelecimentos (${colunas.join(', ')}) VALUES (${colunas.map(() => '?').join(', ')})`).run(...valores);
  return { id: Number(r.lastInsertRowid), novo: true };
}

export function listarEstabelecimentos(db, filtros = {}) {
  const where = [];
  const args = [];
  if (filtros.cidade) { where.push('cidade = ?'); args.push(filtros.cidade); }
  if (filtros.status) { where.push('status = ?'); args.push(filtros.status); }
  if (filtros.remold) { where.push('trabalha_remold = ?'); args.push(filtros.remold); }
  if (filtros.whatsapp === 'sim') where.push('tem_whatsapp = 1');
  if (filtros.whatsapp === 'nao') where.push('(tem_whatsapp = 0 OR tem_whatsapp IS NULL)');
  const sql = `SELECT * FROM estabelecimentos ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY cidade, nome`;
  return db.prepare(sql).all(...args);
}

export function obterEstabelecimento(db, id) {
  return db.prepare('SELECT * FROM estabelecimentos WHERE id = ?').get(id);
}

export function buscarPorTelefone(db, telefone) {
  return db.prepare('SELECT * FROM estabelecimentos WHERE telefone = ?').get(telefone);
}

// O WhatsApp às vezes registra celulares antigos sem o 9º dígito; por isso guardamos o id que ele devolve.
export function buscarPorWhatsappId(db, whatsappId) {
  return db.prepare('SELECT * FROM estabelecimentos WHERE whatsapp_id = ?').get(whatsappId);
}

// Acha quem mandou a mensagem: por id do WhatsApp/LID ou pelo telefone (com e sem 9º dígito).
export function encontrarPorContato(db, { ids = [], numeros = [] }) {
  for (const id of ids.filter(Boolean)) {
    const e = db.prepare('SELECT * FROM estabelecimentos WHERE whatsapp_id = ? OR lid = ? ORDER BY id LIMIT 1').get(id, id);
    if (e) return e;
  }
  for (const n of numeros.filter(Boolean)) {
    for (const v of variacoesDoNumero(n)) {
      const e = buscarPorTelefone(db, v);
      if (e) return e;
    }
  }
  return undefined;
}

// Opt-out vale para todo cadastro com o mesmo número/id.
export function marcarOptout(db, { telefone, whatsapp_id: whatsappId, lid }) {
  db.prepare(`UPDATE estabelecimentos SET optout = 1, status = 'optout'
    WHERE (telefone IS NOT NULL AND telefone = ?) OR (whatsapp_id IS NOT NULL AND whatsapp_id = ?) OR (lid IS NOT NULL AND lid = ?)`)
    .run(telefone ?? null, whatsappId ?? null, lid ?? null);
}

export function atualizarEstabelecimento(db, id, campos) {
  const entradas = Object.entries(campos).filter(([c]) => COLUNAS_EDITAVEIS.has(c));
  if (!entradas.length) return;
  const sets = entradas.map(([c]) => `${c} = ?`).join(', ');
  db.prepare(`UPDATE estabelecimentos SET ${sets} WHERE id = ?`).run(...entradas.map(([, v]) => v), id);
}

export function registrarMensagem(db, { estabelecimentoId, direcao, texto, campanha = null, dataHora = new Date().toISOString() }) {
  db.prepare('INSERT INTO mensagens (estabelecimento_id, direcao, texto, campanha, data_hora) VALUES (?, ?, ?, ?, ?)')
    .run(estabelecimentoId, direcao, texto, campanha, dataHora);
}

export function listarMensagens(db, estabelecimentoId) {
  return db.prepare('SELECT * FROM mensagens WHERE estabelecimento_id = ? ORDER BY data_hora').all(estabelecimentoId);
}

export function salvarColeta(db, { estabelecimentoId, dataPrevista, qtdPrevista = null }) {
  const r = db.prepare('INSERT INTO coletas (estabelecimento_id, data_prevista, qtd_pneus_prevista) VALUES (?, ?, ?)')
    .run(estabelecimentoId, dataPrevista, qtdPrevista);
  return Number(r.lastInsertRowid);
}

export function atualizarColeta(db, id, { qtdReal, status, valor }) {
  db.prepare('UPDATE coletas SET qtd_pneus_real = COALESCE(?, qtd_pneus_real), status = COALESCE(?, status), valor = COALESCE(?, valor) WHERE id = ?')
    .run(qtdReal ?? null, status ?? null, valor ?? null, id);
  return db.prepare('SELECT * FROM coletas WHERE id = ?').get(id);
}

export function listarColetas(db, { data, cidades, estabelecimentoId } = {}) {
  const where = [];
  const args = [];
  if (data) { where.push('c.data_prevista = ?'); args.push(data); }
  if (estabelecimentoId) { where.push('c.estabelecimento_id = ?'); args.push(estabelecimentoId); }
  if (cidades?.length) { where.push(`e.cidade IN (${cidades.map(() => '?').join(', ')})`); args.push(...cidades); }
  const sql = `SELECT c.*, e.nome, e.cidade, e.endereco, e.lat, e.lng, e.telefone
    FROM coletas c JOIN estabelecimentos e ON e.id = c.estabelecimento_id
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY c.data_prevista, e.cidade`;
  return db.prepare(sql).all(...args);
}

export function lerAjuste(db, chave) {
  return db.prepare('SELECT valor FROM ajustes WHERE chave = ?').get(chave)?.valor ?? null;
}

export function gravarAjuste(db, chave, valor) {
  db.prepare('INSERT INTO ajustes (chave, valor) VALUES (?, ?) ON CONFLICT(chave) DO UPDATE SET valor = excluded.valor').run(chave, String(valor));
}

// Registro de todas as conversas do número (rastreamento). Repetir a mesma mensagem não duplica.
export function registrarWhatsapp(db, m, { peloRobo = false } = {}) {
  db.prepare(`INSERT OR IGNORE INTO whatsapp_mensagens (id_msg, jid, jid_alt, numero, de_mim, pelo_robo, texto, quando)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(m.id ?? null, m.jid, m.jidAlt ?? null, numeroDoJid(m.jid) ?? numeroDoJid(m.jidAlt), m.deMim ? 1 : 0, peloRobo ? 1 : 0, m.texto ?? null, m.quando);
}

export function lerChat(db, numero, limite = 200) {
  return db.prepare(`SELECT de_mim, pelo_robo, texto, quando FROM whatsapp_mensagens
    WHERE numero = ? ORDER BY quando DESC LIMIT ?`).all(numero, limite).reverse();
}

export function conversasRecentes(db, limite = 50) {
  return db.prepare(`SELECT COALESCE(numero, jid) AS numero, COUNT(*) AS total, MAX(quando) AS ultima,
      (SELECT texto FROM whatsapp_mensagens w2 WHERE COALESCE(w2.numero, w2.jid) = COALESCE(w.numero, w.jid) ORDER BY quando DESC LIMIT 1) AS ultima_mensagem,
      (SELECT de_mim FROM whatsapp_mensagens w2 WHERE COALESCE(w2.numero, w2.jid) = COALESCE(w.numero, w.jid) ORDER BY quando DESC LIMIT 1) AS ultima_foi_minha
    FROM whatsapp_mensagens w GROUP BY COALESCE(numero, jid) ORDER BY ultima DESC LIMIT ?`).all(limite);
}
