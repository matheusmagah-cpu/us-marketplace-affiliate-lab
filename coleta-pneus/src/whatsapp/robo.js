// O robô completo: verifica números, envia a prospecção, atende respostas (Claude) e avisa o dono.
// Trabalha sobre uma "conexão" (Baileys em produção; falsa nos testes).
import config from '../../config/config.js';
import { montarMensagem } from '../../config/mensagens.js';
import {
  listarEstabelecimentos, atualizarEstabelecimento, registrarMensagem, listarMensagens,
  encontrarPorContato, marcarOptout, lerAjuste, gravarAjuste, obterEstabelecimento, registrarWhatsapp,
} from '../db.js';
import { dentroDaJanela, limiteDoDia, proximoEnvio } from '../agenda.js';
import { ehOptout } from '../optout.js';
import { proximaTarefa, enviadosNoDia, respostasManuaisPendentes, MAX_TENTATIVAS_MANUAL } from './fila.js';
import { proximaTarefaRemold } from '../remold.js';
import { numeroDoJid } from './mensagem.js';
import { aplicarDecisao } from '../atendente/decisao.js';
import { podeResponder } from '../atendente/travas.js';

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
const PAUSA_DONO_MS = 12 * 3600 * 1000;
const CONFIRMACAO_OPTOUT = 'Certo, não enviaremos mais mensagens. Obrigado!';

export function criarRobo({
  db, conexao, decidir, primeiraMensagem = async (est) => montarMensagem('coleta', est, config),
  donoNumero = null, log = console, esperaAgruparMs = 5000, msPorCaractere = 40,
}) {
  const envio = { msPorCaractere };
  const pendentes = new Map(); // estabelecimento_id -> timer de agrupamento
  const emAtendimento = new Set(); // contatos com o Claude decidindo agora
  const chegouNova = new Set(); // contatos que mandaram mensagem durante a decisão
  let filaClaude = Promise.resolve(); // um Claude por vez, para não estourar a memória do servidor
  const avisosDados = new Set(); // evita repetir o mesmo aviso ao dono
  let donoJid = null;

  async function avisarDono(texto) {
    if (!donoNumero) return false;
    try {
      donoJid ??= (await conexao.numeroNoWhatsapp(donoNumero)).jid;
      if (!donoJid) return false;
      await conexao.enviarTexto(donoJid, texto, { msPorCaractere: 0 });
      return true;
    } catch (e) {
      log.warn('Não consegui avisar o dono:', e.message);
      return false;
    }
  }

  async function avisarUmaVez(chave, texto) {
    if (avisosDados.has(chave)) return;
    if (await avisarDono(texto)) avisosDados.add(chave);
  }

  async function enviarPara(est, texto, campanha) {
    await conexao.enviarTexto(est.whatsapp_id || est.lid, texto, envio);
    registrarMensagem(db, { estabelecimentoId: est.id, direcao: 'enviada', texto, campanha });
  }

  function emSerie(fn) {
    const p = filaClaude.then(fn, fn);
    filaClaude = p.catch(() => {});
    return p;
  }

  // Relê o contato: pode ter saído, ficado inválido ou o dono assumido enquanto o Claude pensava.
  function contatoLiberado(estId) {
    const est = obterEstabelecimento(db, estId);
    if (!est || est.optout || est.status === 'invalido') return { est: null, trava: null };
    const trava = podeResponder(db, est, new Date());
    return trava.ok ? { est, trava: null } : { est: null, trava: { est, motivo: trava.motivo } };
  }

  async function responder(estId) {
    pendentes.delete(estId);
    if (emAtendimento.has(estId)) return chegouNova.add(estId); // a decisão em andamento é refeita com a mensagem nova
    emAtendimento.add(estId);
    try {
      for (;;) {
        chegouNova.delete(estId);
        const antes = contatoLiberado(estId);
        if (!antes.est) return antes.trava && tratarTrava(antes.trava.est, antes.trava.motivo);
        let decisao;
        try {
          decisao = await emSerie(() => decidir({ est: antes.est, historico: listarMensagens(db, estId).slice(-20), hoje: new Date() }));
        } catch (e) {
          log.warn(`Atendente falhou para ${antes.est.nome}: ${e.message}`);
          await avisarDono(`O atendimento automático não respondeu ${antes.est.nome} (${antes.est.cidade}). Responda pelo painel ou pelo celular. Motivo: ${e.message}`);
          return;
        }
        if (chegouNova.has(estId)) continue; // chegou mensagem nova: decide de novo com a conversa completa
        const { est } = contatoLiberado(estId);
        if (!est) return;
        const { resposta, avisarDono: aviso } = aplicarDecisao(db, est, decisao, new Date());
        if (resposta) {
          try {
            await enviarPara(est, resposta, 'atendente');
          } catch (e) {
            // O banco já foi atualizado: a resposta vai para a fila e é reenviada em até 30 s.
            db.prepare("INSERT INTO fila_envio (estabelecimento_id, campanha, texto) VALUES (?, 'manual', ?)").run(est.id, resposta);
            log.warn(`Resposta para ${est.nome} ficou na fila: ${e.message}`);
          }
        }
        if (aviso) await avisarDono(aviso);
        log.log(`Atendente: ${est.nome} (${est.cidade}) -> ${decisao.intencao}`);
        return;
      }
    } finally {
      emAtendimento.delete(estId);
    }
  }

  async function tratarTrava(est, motivo) {
    if (motivo === 'teto') await avisarUmaVez(`teto:${est.id}`, `${est.nome} (${est.cidade}) já recebeu muitas respostas automáticas hoje; pausei o atendimento com esse contato. Veja a conversa.`);
    if (motivo === 'repeticao') await avisarUmaVez(`rep:${est.id}`, `${est.nome} (${est.cidade}) parece ser uma resposta automática repetida; parei de responder para não entrar em loop.`);
  }

  // Toda mensagem do número passa aqui (Baileys -> conexao -> robô).
  async function aoMensagem(m) {
    registrarWhatsapp(db, m, { peloRobo: m.peloRobo });
    if (!m.tempoReal) return; // histórico antigo: só registra

    const numeros = [numeroDoJid(m.jid), numeroDoJid(m.jidAlt)];
    if (m.jid.endsWith('@lid') && !m.jidAlt) numeros.push(numeroDoJid(await conexao.telefoneDoLid(m.jid)));
    const est = encontrarPorContato(db, { ids: [m.jid, m.jidAlt], numeros });
    if (!est) return; // clientes normais da empresa: só rastreamento, o robô não responde
    if (m.jid.endsWith('@lid') && !est.lid) atualizarEstabelecimento(db, est.id, { lid: m.jid });

    if (m.deMim) {
      if (m.peloRobo) return;
      // O dono escreveu pelo celular: ele assumiu a conversa, o atendente fica de fora por 12 h.
      registrarMensagem(db, { estabelecimentoId: est.id, direcao: 'enviada', texto: m.texto, campanha: 'dono', dataHora: m.quando });
      atualizarEstabelecimento(db, est.id, { pausado_ate: new Date(Date.now() + PAUSA_DONO_MS).toISOString() });
      clearTimeout(pendentes.get(est.id));
      pendentes.delete(est.id);
      return;
    }

    registrarMensagem(db, { estabelecimentoId: est.id, direcao: 'recebida', texto: m.texto, campanha: null, dataHora: m.quando });
    if (est.optout || est.status === 'invalido') return; // já saiu: só registra, nunca responde

    if (ehOptout(m.texto)) {
      marcarOptout(db, { telefone: est.telefone, whatsapp_id: est.whatsapp_id, lid: est.lid || (m.jid.endsWith('@lid') ? m.jid : null) });
      if (podeResponder(db, est).motivo === 'nao_prospectado') return; // nunca falamos com ele: só marca
      try {
        await conexao.enviarTexto(m.jid, CONFIRMACAO_OPTOUT, { msPorCaractere: 0 });
        registrarMensagem(db, { estabelecimentoId: est.id, direcao: 'enviada', texto: CONFIRMACAO_OPTOUT, campanha: 'sistema' });
      } catch (e) {
        log.warn('Falha ao confirmar opt-out:', e.message);
      }
      return;
    }

    if (emAtendimento.has(est.id)) chegouNova.add(est.id);
    clearTimeout(pendentes.get(est.id));
    pendentes.set(est.id, setTimeout(() => responder(est.id), esperaAgruparMs));
  }

  async function verificarNovos() {
    if (!conexao.estaConectado()) return;
    const aVerificar = listarEstabelecimentos(db).filter((e) => e.telefone && e.tem_whatsapp == null && !e.optout && e.status !== 'invalido');
    for (const e of aVerificar) {
      try {
        const r = await conexao.numeroNoWhatsapp(e.telefone);
        atualizarEstabelecimento(db, e.id, r.existe
          ? { tem_whatsapp: 1, whatsapp_id: r.jid, confianca: r.ehBusiness ? 'alta' : 'media', status: e.status === 'sem_whatsapp' ? 'pronto' : e.status }
          : { tem_whatsapp: 0, status: e.status === 'pronto' ? 'sem_whatsapp' : e.status });
      } catch (err) {
        log.warn(`Falha ao verificar ${e.nome}: ${err.message}`);
        if (!conexao.estaConectado()) return;
      }
      await esperar(1500 + Math.random() * 2500);
    }
  }

  async function enviarManuais() {
    for (const r of respostasManuaisPendentes(db)) {
      try {
        await conexao.enviarTexto(r.whatsapp_id || r.lid, r.texto, envio);
        registrarMensagem(db, { estabelecimentoId: r.estabelecimento_id, direcao: 'enviada', texto: r.texto, campanha: 'manual' });
        db.prepare("UPDATE fila_envio SET status = 'enviada' WHERE id = ?").run(r.id);
      } catch (e) {
        const tentativa = r.tentativa + 1;
        db.prepare('UPDATE fila_envio SET tentativa = ?, status = ? WHERE id = ?')
          .run(tentativa, tentativa >= MAX_TENTATIVAS_MANUAL ? 'falhou' : 'pendente', r.id);
        log.warn(`Falha na resposta manual ${r.id}: ${e.message}`);
      }
    }
  }

  let proximoHorario = new Date();
  let falhas = 0;

  async function passoDeEnvio() {
    if (!conexao.estaConectado() || lerAjuste(db, 'envios_pausados') === '1') return;
    await enviarManuais();
    const agora = new Date();
    const inicio = new Date(`${config.envio.inicioCampanha}T08:30:00-03:00`);
    if (!dentroDaJanela(agora) || agora < proximoHorario || enviadosNoDia(db, agora) >= limiteDoDia(inicio, agora)) return;

    const tarefa = proximaTarefa(db, agora) || proximaTarefaRemold(db, agora);
    if (!tarefa) return;
    const { tipo, estabelecimento: e } = tarefa;
    try {
      const texto = tipo === 'coleta' ? await primeiraMensagem(e) : montarMensagem(tipo, e, config);
      // A 1ª mensagem do Claude pode levar até 1 min: confere de novo antes de enviar.
      const atual = obterEstabelecimento(db, e.id);
      if (!atual || atual.optout || atual.status === 'invalido' || lerAjuste(db, 'envios_pausados') === '1' || !dentroDaJanela(new Date())) return;
      await enviarPara(e, texto, tipo);
      if (tipo === 'coleta') atualizarEstabelecimento(db, e.id, { status: 'enviado' });
      log.log(`[${agora.toLocaleString('pt-BR')}] ${tipo} -> ${e.nome} (${e.cidade})`);
      falhas = 0;
    } catch (err) {
      falhas++;
      log.warn(`Falha ao enviar para ${e.nome}: ${err.message}`);
      // Só invalida se o WhatsApp confirmar que o número não existe.
      const r = await conexao.numeroNoWhatsapp(e.telefone).catch(() => null);
      if (r && !r.existe) atualizarEstabelecimento(db, e.id, { status: 'invalido', tem_whatsapp: 0 });
      if (falhas >= config.envio.falhasParaParar) {
        gravarAjuste(db, 'envios_pausados', '1');
        await avisarDono(`${falhas} falhas seguidas no envio: os envios foram PAUSADOS. Confira o WhatsApp e retome pelo painel.`);
      }
    }
    proximoHorario = proximoEnvio(new Date());
  }

  return { aoMensagem, verificarNovos, passoDeEnvio, avisarDono, responder };
}
