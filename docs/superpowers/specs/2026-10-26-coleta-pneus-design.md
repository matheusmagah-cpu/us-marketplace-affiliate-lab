# Coleta de pneus + prospecção de remold — Especificação de Design

- **Data:** 2026-10-26
- **Status:** aprovado pelo dono em 26/10/2026 (licenciamento e destinação ficam a cargo do dono, fora do escopo)
- **Pasta do código:** `coleta-pneus/` neste repositório
- **Onde roda:** no computador do dono (Windows, premissa), ligado no horário comercial. A sessão na nuvem não acessa Google Maps nem WhatsApp (rede bloqueada, testado em 26/10/2026).

---

## 1. Objetivo

Captar, sem gastar com anúncios, borracharias e auto centers de 14 cidades vizinhas a Volta Redonda (excluindo Volta Redonda) para:

1. **Fase 1 — Coleta:** recolher pneus de descarte no local, cobrando **R$1,50 por pneu**, organizando rotas de coleta.
2. **Fase 2 — Remold:** depois do primeiro contato bem-sucedido, oferecer o **pneu remold fabricado pela empresa do dono**.

### Cidades (14)
Barra Mansa, Pinheiral, Porto Real, Quatis, Resende, Itatiaia, Barra do Piraí, Piraí, Rio Claro, Valença, Mendes, Engenheiro Paulo de Frontin, Miguel Pereira, Vassouras.

## 2. Decisões do dono vs. premissas

| Item | Decisão / premissa |
|---|---|
| Custo | Tudo grátis: sem API paga, sem anúncio, sem mensalidade. (decisão) |
| WhatsApp | Não oficial, simulando pessoa (WhatsApp Web). (decisão) |
| Preço da coleta | R$1,50 por pneu. (decisão) |
| Sistema operacional | Windows. (premissa) |
| Número de WhatsApp | Chip separado só para a coleta. (premissa recomendada) |
| Ponto de saída das rotas | Av. Adalberto Barros Nunes, bairro Retiro, Volta Redonda (decisão). Volta Redonda é só origem, não é prospectada. |
| Respostas | O dono (ou alguém da empresa) responde as conversas; o sistema não responde sozinho na v1. (premissa) |

## 3. Critérios de sucesso

- Mapa com **todas as borracharias/auto centers encontráveis** nas 14 cidades, sem duplicados, com telefone quando existir.
- Para cada contato, saber se o número **tem WhatsApp**.
- Envio de mensagens sem bloqueio do número nas primeiras 4 semanas.
- Painel mostrando o funil: mapeados → contatados → responderam → aceitaram → recolhidos.
- Rota de coleta gerada em 1 clique por cidade/dia, com total de pneus e valor a cobrar.

## 4. Arquitetura

Um único programa Node.js (`coleta-pneus/`), com módulos independentes que conversam por um banco SQLite local (`dados/coleta.db`).

```
mapeamento/     -> busca no Google Maps (Playwright) + OpenStreetMap (Overpass)
whatsapp/       -> conexão WhatsApp Web (whatsapp-web.js), verificação de número, fila de envio
painel/         -> servidor web local (http://localhost:3000) com lista, filtros, conversa e rotas
rotas/          -> agrupamento e ordenação de paradas, link do Google Maps
banco/          -> esquema SQLite e funções de acesso
config/         -> cidades, termos de busca, modelos de mensagem, limites de envio
```

### Fluxo de dados
1. `mapeamento` grava estabelecimentos em `estabelecimentos`.
2. `whatsapp` verifica cada telefone e marca `tem_whatsapp`.
3. `whatsapp` consome a `fila_envio` respeitando limites e grava em `mensagens`.
4. Respostas recebidas viram registros em `mensagens` e atualizam o `status`.
5. O dono atualiza no `painel`: aceitou, quantidade de pneus, data, trabalha com remold.
6. `rotas` monta a rota com quem tem coleta agendada.

### Tabelas principais
- `estabelecimentos`: id, nome, cidade, endereço, latitude, longitude, telefone, telefone_normalizado, tem_whatsapp, fonte (maps/osm), nota, avaliações, link_maps, status, trabalha_remold (sim/não/desconhecido), optout, observações.
- `mensagens`: id, estabelecimento_id, direção (enviada/recebida), texto, data_hora, campanha (coleta/remold).
- `coletas`: id, estabelecimento_id, data_prevista, qtd_pneus_prevista, qtd_pneus_real, valor (= qtd × 1,50), status (agendada/feita/cancelada).
- `fila_envio`: id, estabelecimento_id, campanha, agendado_para, tentativa, status.

Status do estabelecimento: `mapeado → sem_whatsapp | pronto → enviado → respondeu → aceitou | recusou | optout → coleta_agendada → recolhido`.

## 5. Módulo de mapeamento

- **Termos de busca por cidade:** "borracharia", "auto center", "pneus", "alinhamento e balanceamento", "recapagem", "loja de pneus".
- **Google Maps (Playwright, navegador visível):** rolar a lista de resultados até o fim, abrir cada item e extrair nome, endereço, telefone, nota, nº de avaliações, horário, coordenadas e link. Pausas aleatórias de 2–6 s entre ações; uma cidade por vez.
- **OpenStreetMap (Overpass):** `shop=tyres`, `craft=*` relacionados e `shop=car_repair` dentro dos limites de cada município, para completar a lista.
- **Deduplicação:** mesmo telefone normalizado, ou nome parecido + distância < 80 m.
- **Normalização de telefone:** formato `55DDXXXXXXXXX`; celular (9 dígitos começando com 9) é candidato a WhatsApp; fixo vai para "ligar".
- **Saída extra:** exportação em planilha (CSV/Excel) para conferência.

## 6. Módulo de WhatsApp

- Biblioteca **whatsapp-web.js** (grátis, não oficial), sessão salva localmente; login pelo QR code uma vez.
- **Verificação:** `isRegisteredUser` em cada celular antes de enfileirar.
- **Regras anti-bloqueio (configuráveis):**
  - Envio só seg–sex 8h30–17h30 e sáb 8h30–12h.
  - Semana 1: até 20 mensagens/dia; aumenta ~10/dia por semana até no máximo 60/dia.
  - Intervalo aleatório de 3–9 minutos entre mensagens; simula "digitando" proporcional ao tamanho do texto.
  - Variações de texto (3–5 modelos) sorteadas, sempre com nome do estabelecimento e cidade.
  - Uma mensagem inicial + no máximo 1 lembrete após 3 dias úteis sem resposta. Nunca mais que isso.
  - Resposta com "não", "pare", "sair", "não quero" etc. → `optout` imediato, nunca mais contata.
  - Parada automática se várias mensagens falharem seguidas (sinal de bloqueio).
- **Modelo da mensagem de coleta (exemplo):**
  > Bom dia, pessoal da {nome}! Aqui é da {empresa}, de {cidade_base}. Fazemos recolha de pneus de descarte aí em {cidade}: buscamos no local e cobramos só R$1,50 por pneu. Vocês têm pneus parados para descartar? Se não quiser receber mensagens, é só responder "sair".
- **Respostas:** chegam no painel e no celular; o dono responde. (Resposta automática com IA fica para uma versão futura.)

## 7. Painel (localhost)

- Lista com filtros por cidade, status, tem WhatsApp, remold.
- Ficha do estabelecimento: dados, mapa, histórico da conversa, botão de responder, campos de aceite (qtd de pneus, data) e "trabalha com remold".
- Contadores do funil por cidade.
- Botão "pausar envios".

## 8. Rotas de coleta

- Selecionar data e cidade(s) → lista de coletas agendadas.
- Ordenação por vizinho mais próximo a partir do ponto de saída (endereço da empresa, configurável).
- Gera link do Google Maps com até 10 paradas por rota (limite do link); acima disso, divide em rotas.
- Resumo: nº de paradas, pneus previstos, valor a cobrar (qtd × R$1,50), lista para impressão/WhatsApp do motorista.
- Após a coleta: registrar quantidade real e marcar `recolhido`.

## 9. Fase 2 — Remold

- Disparo só para quem tem status `recolhido` ou `aceitou`, e não `optout`.
- Mensagem própria da campanha "remold" (texto a definir com o dono: medidas, preço, prazo).
- Mesmas regras anti-bloqueio. Marca `trabalha_remold` e interesse.

## 10. Testes

- Testes automáticos de: normalização de telefone, deduplicação, regras de horário/limite da fila, detecção de opt-out, ordenação da rota e cálculo de valor.
- Teste manual guiado: mapear 1 cidade pequena (ex.: Quatis), conferir a planilha, enviar para 3 números de teste do próprio dono antes de qualquer envio real.

## 11. Fases de entrega

| Fase | Entrega | Critério para avançar |
|---|---|---|
| 1 | Mapeamento das 14 cidades + planilha | Dono confere amostra e aprova |
| 2 | WhatsApp: verificação + envio com limites + painel | 1 semana sem bloqueio e respostas registradas |
| 3 | Rotas de coleta | Primeira rota real executada |
| 4 | Campanha remold | Após primeiras coletas feitas |

## 12. Fora do escopo (v1)

- Resposta automática por IA.
- API oficial do WhatsApp, anúncios pagos.
- App de celular para o motorista.
- Volta Redonda.

## 13. Riscos conhecidos

- **Bloqueio do número** (WhatsApp não oficial e contato frio): mitigado com chip separado, limites, personalização e opt-out. Risco não é zero.
- **Termos de uso do Google Maps** proíbem raspagem automática; o volume aqui é pequeno (14 cidades), mas o risco existe. OpenStreetMap é a fonte limpa complementar.
- **LGPD:** dados são de empresas (contato comercial público); manter opt-out e não compartilhar a base.
- **Concorrência gratuita:** a Reciclanip/ecopontos municipais podem receber pneus de graça; a mensagem deve vender a conveniência de buscar no local.

## 14. Pendências

- Confirmar sistema operacional do computador e o chip separado.
- Nome da empresa (para as mensagens). Saída das rotas definida: Av. Adalberto Barros Nunes, Retiro, Volta Redonda.
- Texto e condições da campanha de remold.
