// Uso: npm run whatsapp                      (campanha de coleta)
//      npm run whatsapp -- --teste           (só envia para os seus números de teste)
//      npm run whatsapp -- --campanha remold (fase 2)
import config from '../../config/config.js';
import { montarMensagem } from '../../config/mensagens.js';
import {
  abrirBanco, listarEstabelecimentos, atualizarEstabelecimento, registrarMensagem,
  salvarEstabelecimento, encontrarPorContato, marcarOptout, lerAjuste, gravarAjuste,
} from '../db.js';
import { dentroDaJanela, limiteDoDia, proximoEnvio } from '../agenda.js';
import { ehOptout } from '../optout.js';
import { proximaTarefa, enviadosNoDia, respostasManuaisPendentes, MAX_TENTATIVAS_MANUAL } from './fila.js';
import { proximaTarefaRemold } from '../remold.js';
import { criarCliente, verificarNumero, enviar, telefoneDoLid } from './cliente.js';

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
const modoTeste = process.argv.includes('--teste');
const campanha = process.argv.includes('--campanha') ? process.argv[process.argv.indexOf('--campanha') + 1] : 'coleta';
const CONFIRMACAO_OPTOUT = 'Certo, não enviaremos mais mensagens. Obrigado!';

// Não deixa sair mensagem com campos de configuração em branco.
const faltando = [];
if (/PREENCHER/.test(config.empresa.nome)) faltando.push('empresa.nome');
if (campanha === 'remold' && /PREENCHER/.test(config.ofertaRemold)) faltando.push('ofertaRemold');
if (faltando.length) {
  console.error(`Preencha em config/config.js antes de enviar: ${faltando.join(', ')}`);
  process.exit(1);
}

const db = abrirBanco();
const client = await criarCliente();

// 1) Recebimento de respostas
client.on('message', async (msg) => {
  try {
    if (msg.fromMe || msg.from.endsWith('@g.us') || msg.from === 'status@broadcast') return;
    const ids = [msg.from];
    const numeros = [];
    if (msg.from.endsWith('@lid')) {
      const pn = await telefoneDoLid(client, msg.from);
      if (pn) { ids.push(pn); numeros.push(pn.split('@')[0]); }
    } else {
      numeros.push(msg.from.split('@')[0]);
    }
    try {
      const contato = await msg.getContact();
      if (contato?.id?.user) numeros.push(contato.id.user);
    } catch {
      // segue com o que já temos
    }
    const est = encontrarPorContato(db, { ids, numeros });
    if (!est) {
      console.log(`Mensagem de contato fora da lista (${msg.from}): ${msg.body}`);
      return;
    }
    if (msg.from.endsWith('@lid') && !est.lid) atualizarEstabelecimento(db, est.id, { lid: msg.from });
    else if (!msg.from.endsWith('@lid') && !est.whatsapp_id) atualizarEstabelecimento(db, est.id, { whatsapp_id: msg.from });

    registrarMensagem(db, { estabelecimentoId: est.id, direcao: 'recebida', texto: msg.body || '[mídia]', campanha: null });
    if (ehOptout(msg.body)) {
      marcarOptout(db, { telefone: est.telefone, whatsapp_id: est.whatsapp_id, lid: msg.from.endsWith('@lid') ? msg.from : est.lid });
      await client.sendMessage(msg.from, CONFIRMACAO_OPTOUT);
      registrarMensagem(db, { estabelecimentoId: est.id, direcao: 'enviada', texto: CONFIRMACAO_OPTOUT, campanha: 'sistema' });
      console.log(`Opt-out: ${est.nome} (${est.cidade})`);
    } else if (est.status === 'enviado') {
      atualizarEstabelecimento(db, est.id, { status: 'respondeu' });
      console.log(`Resposta de ${est.nome} (${est.cidade}): ${msg.body}`);
    }
  } catch (e) {
    console.warn('Erro ao processar mensagem recebida:', e.message);
  }
});

// 2) Modo teste: cadastra seus números e manda 1 mensagem para cada
if (modoTeste) {
  if (!config.numerosTeste.length) {
    console.error('Preencha numerosTeste em config/config.js antes de usar --teste.');
    process.exit(1);
  }
  for (const [i, numero] of config.numerosTeste.entries()) {
    const { id } = salvarEstabelecimento(db, { nome: `Teste ${i + 1}`, cidade: 'Teste', telefone: numero, tipoTelefone: 'celular', fonte: 'teste' });
    const wid = await verificarNumero(client, numero);
    if (!wid) { console.warn(`${numero} não tem WhatsApp.`); continue; }
    atualizarEstabelecimento(db, id, { tem_whatsapp: 1, whatsapp_id: wid, optout: 0, status: 'pronto', observacoes: 'número de teste' });
    const texto = montarMensagem(campanha === 'remold' ? 'remold' : 'coleta', { nome: `Teste ${i + 1}`, cidade: config.cidades[0] }, config);
    await enviar(client, wid, texto);
    registrarMensagem(db, { estabelecimentoId: id, direcao: 'enviada', texto, campanha: 'teste' });
    atualizarEstabelecimento(db, id, { status: 'enviado' });
    console.log(`Teste enviado para ${numero}. Responda "sair" de um deles para testar o opt-out.`);
    await esperar(5000);
  }
  console.log('Modo teste: ouvindo respostas. Feche com Ctrl+C.');
} else {
  // 3) Verificação de quem tem WhatsApp (devagar)
  const aVerificar = listarEstabelecimentos(db).filter((e) => e.tipo_telefone === 'celular' && e.tem_whatsapp == null && !e.optout);
  console.log(`Verificando ${aVerificar.length} números...`);
  for (const e of aVerificar) {
    try {
      const wid = await verificarNumero(client, e.telefone);
      atualizarEstabelecimento(db, e.id, wid
        ? { tem_whatsapp: 1, whatsapp_id: wid }
        : { tem_whatsapp: 0, status: 'sem_whatsapp' });
    } catch (err) {
      console.warn(`Falha ao verificar ${e.nome}: ${err.message}`);
    }
    await esperar(1500 + Math.random() * 2500);
  }

  // 4) Laço de envio
  let proximoHorario = new Date();
  let falhas = 0;
  const inicio = new Date(`${config.envio.inicioCampanha}T08:30:00-03:00`);

  for (;;) {
    const pausado = lerAjuste(db, 'envios_pausados') === '1';
    for (const r of pausado ? [] : respostasManuaisPendentes(db)) {
      try {
        await enviar(client, r.whatsapp_id, r.texto);
        registrarMensagem(db, { estabelecimentoId: r.estabelecimento_id, direcao: 'enviada', texto: r.texto, campanha: 'manual' });
        db.prepare("UPDATE fila_envio SET status = 'enviada' WHERE id = ?").run(r.id);
      } catch (e) {
        const tentativa = r.tentativa + 1;
        db.prepare('UPDATE fila_envio SET tentativa = ?, status = ? WHERE id = ?')
          .run(tentativa, tentativa >= MAX_TENTATIVAS_MANUAL ? 'falhou' : 'pendente', r.id);
        console.warn(`Falha na resposta manual ${r.id} (tentativa ${tentativa}): ${e.message}`);
      }
    }

    const agora = new Date();
    if (!pausado && dentroDaJanela(agora) && agora >= proximoHorario && enviadosNoDia(db, agora) < limiteDoDia(inicio, agora)) {
      const tarefa = campanha === 'remold' ? proximaTarefaRemold(db) : proximaTarefa(db, agora);
      if (tarefa) {
        const { tipo, estabelecimento: e } = tarefa;
        const texto = montarMensagem(tipo, e, config);
        try {
          await enviar(client, e.whatsapp_id, texto);
          registrarMensagem(db, { estabelecimentoId: e.id, direcao: 'enviada', texto, campanha: tipo });
          if (tipo === 'coleta') atualizarEstabelecimento(db, e.id, { status: 'enviado' });
          console.log(`[${agora.toLocaleString('pt-BR')}] ${tipo} -> ${e.nome} (${e.cidade})`);
          falhas = 0;
        } catch (err) {
          falhas++;
          console.warn(`Falha ao enviar para ${e.nome}: ${err.message}`);
          if (falhas >= config.envio.falhasParaParar) {
            gravarAjuste(db, 'envios_pausados', '1');
            console.error(`${falhas} falhas seguidas: envios PAUSADOS. Confira o WhatsApp do chip e retome pelo painel.`);
          }
        }
        proximoHorario = proximoEnvio(new Date());
      }
    }
    await esperar(30000);
  }
}
