// Modo local (no seu computador). Na nuvem use `npm start` (src/app.js).
// Uso: npm run whatsapp            (campanha automática)
//      npm run whatsapp -- --teste (só envia para os seus números de teste)
import Anthropic from '@anthropic-ai/sdk';
import config from '../../config/config.js';
import { montarMensagem } from '../../config/mensagens.js';
import { abrirBanco, salvarEstabelecimento, atualizarEstabelecimento, registrarMensagem } from '../db.js';
import { criarCliente, verificarNumero, enviar } from './cliente.js';
import { criarRobo } from './robo.js';
import { verificarConfig } from '../verificar-config.js';

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
const modoTeste = process.argv.includes('--teste');

verificarConfig(config);
const db = abrirBanco();
const client = await criarCliente();
const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null;
const robo = criarRobo({ db, client, anthropic, donoWhatsapp: process.env.DONO_WHATSAPP || null });
client.on('message', robo.aoReceber);

if (modoTeste) {
  if (!config.numerosTeste.length) {
    console.error('Preencha numerosTeste em config/config.js antes de usar --teste.');
    process.exit(1);
  }
  for (const [i, numero] of config.numerosTeste.entries()) {
    const { id } = salvarEstabelecimento(db, { nome: `Teste ${i + 1}`, cidade: 'Teste', telefone: numero, tipoTelefone: 'celular', fonte: 'teste' });
    const wid = await verificarNumero(client, numero);
    if (!wid) { console.warn(`${numero} não tem WhatsApp.`); continue; }
    atualizarEstabelecimento(db, id, { tem_whatsapp: 1, whatsapp_id: wid, optout: 0, status: 'enviado', observacoes: 'número de teste' });
    const texto = montarMensagem('coleta', { nome: `Teste ${i + 1}`, cidade: config.cidades[0] }, config);
    await enviar(client, wid, texto);
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
