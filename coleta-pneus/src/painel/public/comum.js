// Funções compartilhadas pelas páginas do painel.
export async function api(caminho, metodo = 'GET', corpo) {
  const r = await fetch(caminho, { method: metodo, headers: { 'Content-Type': 'application/json' }, body: corpo ? JSON.stringify(corpo) : undefined });
  const json = await r.json();
  if (!r.ok) throw new Error(json.erro || r.statusText);
  return json;
}

// Cria elemento com texto seguro (nomes vindos do Maps nunca viram HTML).
export function el(tag, texto, atributos = {}) {
  const e = document.createElement(tag);
  if (texto != null) e.textContent = String(texto);
  for (const [k, v] of Object.entries(atributos)) e.setAttribute(k, v);
  return e;
}

export const NOMES_STATUS = {
  pronto: 'Pronto para contatar', sem_whatsapp: 'Sem WhatsApp', enviado: 'Mensagem enviada', respondeu: 'Respondeu',
  aceitou: 'Aceitou', recusou: 'Recusou', optout: 'Pediu para sair', coleta_agendada: 'Coleta agendada', recolhido: 'Recolhido', invalido: 'Número inválido',
};

export const reais = (v) => (v ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export async function montarCabecalho() {
  const estado = await api('/api/estado');
  const botao = document.getElementById('pausa');
  botao.textContent = estado.pausado ? 'Retomar envios' : 'Pausar envios';
  botao.className = estado.pausado ? '' : 'perigo';
  botao.onclick = async () => { await api(estado.pausado ? '/api/retomar' : '/api/pausar', 'POST'); montarCabecalho(); };
  return estado;
}
