// Programa completo para a nuvem: npm start
// Lê os segredos do arquivo .env (veja .env.exemplo).
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import Anthropic from '@anthropic-ai/sdk';
import config from '../config/config.js';
import { abrirBanco, gravarAjuste, lerAjuste, listarColetas } from './db.js';
import { criarApp } from './painel/servidor.js';
import { criarCliente } from './whatsapp/cliente.js';
import { criarRobo } from './whatsapp/robo.js';
import { tarefasDevidas, textoRota } from './agendador.js';
import { montarRota } from './rota.js';
import { proximoDiaUtil } from './atendente/decisao.js';
import { dataLocalISO } from './agenda.js';
import { verificarConfig } from './verificar-config.js';

if (existsSync('.env')) process.loadEnvFile('.env');
const env = process.env;
const obrigatorios = ['ANTHROPIC_API_KEY', 'PAINEL_USUARIO', 'PAINEL_SENHA', 'MCP_TOKEN', 'DONO_WHATSAPP'];
const faltando = obrigatorios.filter((k) => !env[k]);
if (faltando.length) {
  console.error(`Faltam no .env: ${faltando.join(', ')}`);
  process.exit(1);
}
verificarConfig(config);

process.on('unhandledRejection', (e) => console.error('Erro não tratado:', e));

const db = abrirBanco();
let robo = null;
let mapeando = false;

function mapear(cidade) {
  if (mapeando) return console.log('Já existe um mapeamento em andamento.');
  mapeando = true;
  const args = ['src/mapeamento/rodar.js', '--headless', ...(cidade ? ['--cidade', cidade] : [])];
  const filho = spawn(process.execPath, args, { stdio: 'inherit' });
  filho.on('exit', async (codigo) => {
    mapeando = false;
    console.log(`Mapeamento terminou (código ${codigo}).`);
    await robo?.verificarNovos();
  });
}

// Painel + MCP, só na máquina (o Caddy publica com HTTPS).
criarApp(db, { usuario: env.PAINEL_USUARIO, senha: env.PAINEL_SENHA, mcpToken: env.MCP_TOKEN, aoMapear: mapear })
  .listen(3000, '127.0.0.1', () => console.log('Painel e MCP em http://127.0.0.1:3000'));

const client = await criarCliente({
  mostrarQrNoTerminal: false,
  aoMudar: (estado, qr) => {
    gravarAjuste(db, 'whatsapp_status', estado);
    gravarAjuste(db, 'whatsapp_qr', qr ?? '');
  },
});

robo = criarRobo({ db, client, anthropic: new Anthropic(), donoWhatsapp: env.DONO_WHATSAPP });
client.on('message', robo.aoReceber);

async function rotaDiaria() {
  const data = proximoDiaUtil(new Date());
  const coletas = listarColetas(db, { data }).filter((c) => c.status === 'agendada');
  const texto = textoRota(montarRota({ lat: config.empresa.lat, lng: config.empresa.lng }, coletas), data);
  await robo.avisarDono(texto);
  if (env.MOTORISTA_WHATSAPP) {
    const id = (await client.getNumberId(env.MOTORISTA_WHATSAPP))?._serialized;
    if (id) await client.sendMessage(id, texto, { sendSeen: false });
  }
}

async function agendador() {
  const agora = new Date();
  const ultimas = { rota_diaria: lerAjuste(db, 'ultima_rota_diaria'), remapeamento: lerAjuste(db, 'ultimo_remapeamento') };
  for (const tarefa of tarefasDevidas(agora, ultimas)) {
    try {
      if (tarefa === 'rota_diaria') {
        gravarAjuste(db, 'ultima_rota_diaria', dataLocalISO(agora));
        await rotaDiaria();
      }
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

await robo.verificarNovos();
repetir(robo.passoDeEnvio, 30 * 1000);
repetir(robo.verificarNovos, 60 * 60 * 1000);
repetir(agendador, 60 * 1000);
console.log('Robô da coleta rodando.');
