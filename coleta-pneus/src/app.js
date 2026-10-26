// Programa completo para a nuvem: npm start
// Os segredos e os dados da empresa vêm do arquivo .env (lido por config/config.js).
import { spawn } from 'node:child_process';
import config from '../config/config.js';
import { abrirBanco, gravarAjuste, lerAjuste, listarColetas } from './db.js';
import { criarApp } from './painel/servidor.js';
import { criarConexao } from './whatsapp/conexao.js';
import { criarRobo } from './whatsapp/robo.js';
import { tarefasDevidas, textoRota } from './agendador.js';
import { montarRota } from './rota.js';
import { proximoDiaUtil } from './atendente/decisao.js';
import { dataLocalISO } from './agenda.js';
import { verificarConfig } from './verificar-config.js';
import { decidirComClaudeCode, primeiraMensagemComClaudeCode } from './atendente/claude-code.js';

const env = process.env;
const faltando = ['PAINEL_USUARIO', 'PAINEL_SENHA', 'MCP_TOKEN'].filter((k) => !env[k]);
if (faltando.length) {
  console.error(`Faltam no .env: ${faltando.join(', ')}`);
  process.exit(1);
}
verificarConfig(config);

// Quem conversa: Claude Code com a assinatura (padrão) ou a API (opcional, ATENDENTE=api).
const atendente = env.ATENDENTE || 'claude-code';
let decidir = decidirComClaudeCode;
let primeiraMensagem = (est) => primeiraMensagemComClaudeCode(est);
if (atendente === 'api') {
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const { interpretar } = await import('./atendente/ia.js');
  const cliente = new Anthropic();
  decidir = (a) => interpretar(cliente, a);
  primeiraMensagem = undefined; // modelos prontos
} else if (!env.CLAUDE_CODE_OAUTH_TOKEN) {
  console.warn('Atenção: CLAUDE_CODE_OAUTH_TOKEN vazio no .env — o atendimento automático vai falhar até você colar o token (claude setup-token).');
}

process.on('unhandledRejection', (e) => console.error('Erro não tratado:', e));

const db = abrirBanco();
let mapeando = false;

function mapear(cidade) {
  if (mapeando) return console.log('Já existe um mapeamento em andamento.');
  mapeando = true;
  const args = ['src/mapeamento/rodar.js', '--headless', ...(cidade ? ['--cidade', cidade] : [])];
  spawn(process.execPath, args, { stdio: 'inherit' }).on('exit', (codigo) => {
    mapeando = false;
    console.log(`Mapeamento terminou (código ${codigo}).`);
    robo.verificarNovos();
  });
}

// Painel + MCP, só na máquina (o Caddy publica com HTTPS).
criarApp(db, { usuario: env.PAINEL_USUARIO, senha: env.PAINEL_SENHA, mcpToken: env.MCP_TOKEN, aoMapear: mapear })
  .listen(3000, '127.0.0.1', () => console.log('Painel e MCP em http://127.0.0.1:3000'));

let robo = null;
const conexao = criarConexao({
  aoMudar: (estado, qr) => {
    gravarAjuste(db, 'whatsapp_status', estado);
    gravarAjuste(db, 'whatsapp_qr', qr ?? '');
    if (estado === 'conectado') robo?.verificarNovos();
  },
  aoMensagem: (m) => robo?.aoMensagem(m),
});
robo = criarRobo({ db, conexao, decidir, primeiraMensagem, donoNumero: env.DONO_WHATSAPP });
await conexao.iniciar();

async function rotaDiaria(agora) {
  const data = proximoDiaUtil(agora);
  const coletas = listarColetas(db, { data }).filter((c) => c.status === 'agendada');
  const texto = textoRota(montarRota({ lat: config.empresa.lat, lng: config.empresa.lng }, coletas), data);
  if (!(await robo.avisarDono(texto))) throw new Error('rota não entregue ao dono (WhatsApp desconectado?)');
  gravarAjuste(db, 'ultima_rota_diaria', dataLocalISO(agora)); // só marca depois de entregue
  if (env.MOTORISTA_WHATSAPP) {
    try {
      const { jid } = await conexao.numeroNoWhatsapp(env.MOTORISTA_WHATSAPP);
      if (jid) await conexao.enviarTexto(jid, texto, { msPorCaractere: 0 });
    } catch (e) {
      console.warn('Rota não chegou ao motorista:', e.message);
    }
  }
}

async function agendador() {
  const agora = new Date();
  const ultimas = { rota_diaria: lerAjuste(db, 'ultima_rota_diaria'), remapeamento: lerAjuste(db, 'ultimo_remapeamento') };
  for (const tarefa of tarefasDevidas(agora, ultimas)) {
    try {
      if (tarefa === 'rota_diaria') await rotaDiaria(agora);
      if (tarefa === 'remapeamento') {
        gravarAjuste(db, 'ultimo_remapeamento', dataLocalISO(agora));
        mapear(null);
      }
    } catch (e) {
      console.error(`Rotina ${tarefa} falhou:`, e.message);
    }
  }
}

function repetir(fn, ms) {
  let rodando = false;
  setInterval(async () => {
    if (rodando) return;
    rodando = true;
    try { await fn(); } catch (e) { console.error(e); } finally { rodando = false; }
  }, ms);
}

repetir(() => robo.passoDeEnvio(), 30 * 1000);
repetir(() => robo.verificarNovos(), 60 * 60 * 1000);
repetir(agendador, 60 * 1000);
console.log(`Robô da coleta rodando (atendente: ${atendente}).`);
