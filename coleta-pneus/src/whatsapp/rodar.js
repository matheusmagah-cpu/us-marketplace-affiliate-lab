// Modo local (no seu computador), com a mesma conexão e atendente da nuvem.
// Uso: npm run whatsapp            (campanha automática)
//      npm run whatsapp -- --teste (só envia para os números de NUMEROS_TESTE)
import config from '../../config/config.js';
import { abrirBanco, salvarEstabelecimento, atualizarEstabelecimento, registrarMensagem } from '../db.js';
import { criarConexao } from './conexao.js';
import { criarRobo } from './robo.js';
import { verificarConfig } from '../verificar-config.js';
import { decidirComClaudeCode, primeiraMensagemComClaudeCode } from '../atendente/claude-code.js';
import qrcode from 'qrcode';

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
const modoTeste = process.argv.includes('--teste');

verificarConfig(config);
const db = abrirBanco();
let robo = null;
let conectado;
const pronto = new Promise((r) => { conectado = r; });
const conexao = criarConexao({
  aoMudar: async (estado, qr) => {
    if (qr) console.log(await qrcode.toString(qr, { type: 'terminal', small: true }));
    if (estado === 'conectado') conectado();
  },
  aoMensagem: (m) => robo?.aoMensagem(m),
});
robo = criarRobo({ db, conexao, decidir: decidirComClaudeCode, primeiraMensagem: primeiraMensagemComClaudeCode, donoNumero: process.env.DONO_WHATSAPP });
await conexao.iniciar();
console.log('Se aparecer um QR code, leia com o WhatsApp (Aparelhos conectados > Conectar aparelho).');
await pronto;

if (modoTeste) {
  if (!config.numerosTeste.length) {
    console.error('Preencha NUMEROS_TESTE no .env antes de usar --teste.');
    process.exit(1);
  }
  for (const [i, numero] of config.numerosTeste.entries()) {
    const { id } = salvarEstabelecimento(db, { nome: `Teste ${i + 1}`, cidade: config.cidades[0], telefone: numero, tipoTelefone: 'celular', fonte: 'teste' });
    const r = await conexao.numeroNoWhatsapp(numero);
    if (!r.existe) { console.warn(`${numero} não tem WhatsApp.`); continue; }
    atualizarEstabelecimento(db, id, { tem_whatsapp: 1, whatsapp_id: r.jid, optout: 0, status: 'enviado', observacoes: 'número de teste' });
    const est = { id, nome: `Teste ${i + 1}`, cidade: config.cidades[0] };
    const texto = await primeiraMensagemComClaudeCode(est);
    await conexao.enviarTexto(r.jid, texto);
    registrarMensagem(db, { estabelecimentoId: id, direcao: 'enviada', texto, campanha: 'teste' });
    console.log(`Teste enviado para ${numero}. Responda como se fosse uma borracharia (ou "sair").`);
    await esperar(5000);
  }
  console.log('Modo teste: ouvindo respostas. Feche com Ctrl+C.');
} else {
  await robo.verificarNovos();
  for (;;) {
    await robo.passoDeEnvio();
    await esperar(30000);
  }
}
