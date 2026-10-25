# Robô XAUUSD (ouro) — Especificação de Design

- **Data:** 2026-10-25
- **Status:** rascunho para revisão do usuário
- **Pasta do código:** `xauusd-bot/` neste repositório (pode virar repositório próprio depois)

---

## 1. Objetivo

Construir um robô de trading automatizado para **XAUUSD** que:

1. Opere com **risco/retorno fixo de 1:3** em todas as operações.
2. Gere **muitas operações** nos tempos gráficos **M1, M5 e M15**.
3. Seja validado com rigor (backtest → dados nunca vistos → demo) **antes** de arriscar dinheiro.
4. Rode dentro das regras de uma **mesa proprietária (FTMO)**, para operar capital da mesa
   com risco do usuário limitado à taxa da avaliação.
5. Possa migrar depois para **futuros Micro Gold (MGC, CME)** trocando apenas o módulo de execução.

## 2. Decisões do usuário vs. premissas

**Decidido pelo usuário:**
- Ativo: XAUUSD (CFD) agora; Micro Gold (MGC) depois.
- Alvo fixo de **3R** e stop de **1R** (sem saída parcial).
- Tempos gráficos: M1, M5, M15.
- Mesa proprietária: FTMO (escolhida com base na análise de confiabilidade e regras para robôs).
- Corretora remunerada por comissão (relevante na fase de conta própria / futuros).

**Premissas assumidas (corrigir se estiverem erradas):**
- Execução via MetaTrader 5 com o pacote Python `MetaTrader5` → exige **Windows** (VPS Windows ou PC).
- Dados históricos gratuitos da Dukascopy (ticks/M1), 2018–2025.
- Horários definidos em **horário de Londres** (com conversão automática para o horário do servidor).

## 3. Metas e critérios de sucesso

| Item | Valor |
|---|---|
| Meta aspiracional de acerto (usuário) | 60% |
| Acerto realista esperado com 1:3 | 30%–45% |
| Acerto de empate com 1:3 (com custos) | ~27%–35%, conforme o tempo gráfico |
| Meta de retorno na mesa | 0,2%–0,3% ao dia em média (4%–6% ao mês) |

O robô **não** é aprovado por taxa de acerto, e sim pelos critérios da seção 9.
A taxa de acerto real será sempre reportada, sem ajuste forçado para atingir 60%.

## 4. Arquitetura

Python 3.11+, `pandas`, `numpy`, `pytest`. Cada módulo tem uma responsabilidade única
e se comunica por interfaces simples.

```
xauusd-bot/
  config/            # YAML: parâmetros, risco, regras da mesa, horários
  bot/
    data/            # download Dukascopy, construção de barras, reamostragem M1→M5/M15/H1/H4
    costs/           # modelo de custo: spread, comissão, derrapagem por tempo gráfico
    strategies/      # S1, S2, S3 — só geram sinais
    risk/            # tamanho de posição, limites da carteira, guarda das regras da mesa
    news/            # calendário de notícias de alto impacto e janelas de bloqueio
    backtest/        # simulador orientado a eventos
    validation/      # in-sample/out-of-sample, walk-forward, Monte Carlo da avaliação FTMO
    execution/       # interface Broker + MT5Broker, PaperBroker (IBKRBroker no futuro)
    live/            # loop ao vivo, estado, reconciliação, logs, alertas
  tests/
  reports/           # saídas de backtest (gráficos/CSV), fora do controle de versão
```

### Fluxo de dados

```
Barras (M1) ─► reamostragem ─► Estratégias ─► Sinal{lado, entrada, stop}
                                                  │
                                         Risco (alvo = entrada ± 3×|entrada−stop|,
                                         lote, limites, guarda FTMO, notícias)
                                                  │
                                      Ordem{lote, entrada, SL, TP}
                                                  │
                         Backtest (simulador)  ou  Broker (Paper / MT5 / IBKR)
```

**Regra central:** as estratégias definem só **entrada e stop**. O alvo de 3R é calculado
em um único lugar (módulo de risco), garantindo o 1:3 em toda operação.

### Interfaces principais

- `Strategy.on_bar(context) -> list[Signal]` — recebe barras do tempo de entrada e do tempo superior.
- `RiskManager.evaluate(signal, account_state) -> Order | Rejection(motivo)`
- `Broker.place(order)`, `Broker.positions()`, `Broker.account()`, `Broker.close(id)`
- Backtest e ao vivo usam **o mesmo** `Strategy` e `RiskManager` (sem código duplicado).

## 5. Estratégias

Cada estratégia roda em três combinações (tempo de entrada → filtro de tendência):

| Entrada | Filtro de tendência |
|---|---|
| M1 | M15 |
| M5 | H1 |
| M15 | H4 |

Total: 3 estratégias × 3 tempos gráficos = **9 combinações**, avaliadas separadamente.
Só as combinações aprovadas (seção 9) são ligadas.

### S1 — Rompimento do range asiático
- Range: máxima/mínima entre 00:00 e 07:00 (Londres).
- Válido só se a largura do range estiver entre `min_atr` e `max_atr` × ATR(14) do tempo de entrada.
- Entrada: fechamento acima da máxima (compra) ou abaixo da mínima (venda) + `buffer`,
  nas janelas 07:00–10:00 e 13:30–16:00 (Londres).
- Filtro: só a favor da tendência do tempo superior (preço vs. EMA 200).
- Stop: meio do range ou `k × ATR`, o que for **menor** (para manter o lote viável).
- Máximo de 1 operação por lado por sessão.

### S2 — Pullback a favor da tendência
- Tendência: preço acima (compra) / abaixo (venda) da EMA 200 do tempo superior, com a EMA inclinada a favor.
- Gatilho: o preço corrige até a zona da EMA 20–50 do tempo de entrada e fecha um candle
  de confirmação a favor da tendência.
- Stop: além da mínima/máxima do pullback + `buffer` (limitado a `k × ATR`).
- Só nas sessões de Londres e Nova York.

### S3 — Rompimento e reteste da máxima/mínima do dia anterior
- Níveis: máxima (PDH) e mínima (PDL) do dia anterior.
- Gatilho: o preço rompe o nível, volta para testá-lo em até `N` barras e fecha um candle de rejeição.
- Stop: além do extremo do reteste + `buffer`.
- Filtro de tendência do tempo superior.

### Filtros comuns
- Sessões: Londres e Nova York apenas.
- Bloqueio de notícias de alto impacto (NFP, CPI, FOMC etc.): sem abrir operações de
  **−15 a +15 min** do evento (configurável; respeita no mínimo a janela da mesa).
- Stop mínimo: `stop ≥ 4 × custo estimado da operação`; caso contrário, o sinal é descartado.

### Otimização
- Grades **pequenas** de parâmetros (poucos valores por parâmetro) para reduzir o sobreajuste.
- Preferir regiões de parâmetros **estáveis** (vizinhos também lucrativos) ao melhor ponto isolado.

## 6. Gestão de risco

| Regra | Valor padrão |
|---|---|
| Risco por operação | 0,5% do saldo |
| Posições abertas simultâneas | máx. 3 (e no máx. 1 por combinação) |
| Operações por dia (total) | máx. 20 (evita "hiperatividade") |
| Stop diário interno | −3% (limite da FTMO: −5%) |
| Stop total interno | −8% do saldo inicial (limite da FTMO: −10%) |
| Exposição na mesma direção | risco somado máx. 1,5% |
| Ordem sempre com SL e TP | **sim, no servidor** (nunca stop "mental") |

O lote é calculado a partir da distância do stop e do valor do contrato do símbolo,
arredondado para **baixo** de acordo com o passo mínimo de lote da corretora.

## 7. Regras da mesa (FTMO) embutidas

Implementadas no `PropRulesGuard` e configuráveis por YAML (os valores devem ser conferidos
nas páginas oficiais da FTMO antes da compra da avaliação):

- Perda diária máxima (inclui resultado flutuante), com o reset no horário da mesa.
- Perda total máxima.
- Bloqueio de notícias nas contas financiadas padrão.
- Proibição de estratégias de alta frequência, arbitragem e tick scalping: o robô não as usa,
  e o limite de operações por dia evita volume excessivo.
- Número mínimo de dias operados (se aplicável).
- Robô **exclusivo** (não comercial), para não gerar operações idênticas às de outros clientes.

## 8. Backtest

- Simulador orientado a eventos sobre barras **M1** (todas as combinações), usando ticks
  quando houver dúvida dentro da barra.
- **Regra conservadora:** se SL e TP forem atingidos na mesma barra sem dados de tick, conta como **stop**.
- Custos: spread variável por horário, comissão por lote e derrapagem (maior no M1 e em
  aberturas de sessão).
- Swap/rolagem noturna incluídos para operações que passam do dia.
- Saídas: taxa de acerto, expectativa (R), fator de lucro, rebaixamento máximo, sequência
  máxima de perdas, operações por dia, curva de capital e resultado por hora/sessão.

## 9. Validação e critérios de aprovação

1. **Ajuste (in-sample):** 2018–2022.
2. **Prova (out-of-sample):** 2023–2025, sem nenhum ajuste depois de olhar esses dados.
3. **Walk-forward:** janelas móveis (ex.: ajusta em 2 anos e testa nos 6 meses seguintes).
4. **Monte Carlo da avaliação FTMO:** reembaralhar as operações para estimar a probabilidade
   de passar na avaliação sem violar as perdas diária e total.

Uma combinação é **aprovada** para a demo se, nos dados out-of-sample e com custos:

| Critério | Mínimo |
|---|---|
| Número de operações | ≥ 200 |
| Expectativa por operação | ≥ +0,15R |
| Fator de lucro | ≥ 1,3 |
| Rebaixamento máximo (com risco de 0,5%) | ≤ 6% |
| Probabilidade de violar o limite diário (Monte Carlo) | ≤ 5% |
| Resultado positivo em ≥ 60% das janelas do walk-forward | sim |

## 10. Execução ao vivo

- `PaperBroker`: simula ao vivo com preços reais, sem enviar ordens (fase de teste).
- `MT5Broker`: envia ordens a mercado com SL/TP já anexados e confere a execução.
- O loop roda a cada fechamento de barra M1 e chama as combinações ativas.
- O estado (operações, P&L do dia, limites) é persistido em disco a cada evento.

### Tratamento de falhas
- **Desconexão:** não abre novas operações; as posições abertas ficam protegidas pelos SL/TP no servidor.
- **Reinício:** reconcilia o estado local com as posições reais da corretora antes de operar.
- **Ordem rejeitada / requote:** registra e não insiste além de 1 nova tentativa.
- **Botão de pânico (kill switch):** arquivo/comando que fecha tudo e para o robô.
- **Relógio:** usa o horário do servidor da corretora com conversão explícita de fuso.
- Logs estruturados e alerta (ex.: Telegram) para entradas, saídas, erros e limites atingidos.

## 11. Testes

- Unitários: cálculo de 3R, tamanho de lote, arredondamento de lote, guarda da FTMO,
  janelas de notícias e sessões, fusos horários.
- Estratégias com dados sintéticos de cenário conhecido (sinal esperado em barra conhecida).
- Simulador: casos de SL e TP na mesma barra, gaps e custos.
- Paridade: o mesmo período no `PaperBroker` e no backtest deve gerar os mesmos sinais.

## 12. Fases do projeto

| Fase | Entrega | Critério para avançar |
|---|---|---|
| 1. Dados + backtest | Pipeline de dados, 3 estratégias, simulador e relatórios | Seção 9 aprovada em ≥ 1 combinação |
| 2. Paper/demo | Robô rodando no VPS Windows (`PaperBroker` → conta de teste grátis FTMO/demo) | 4–8 semanas com resultado coerente com o backtest |
| 3. Avaliação FTMO | Compra da menor avaliação | Aprovação nas fases da mesa |
| 4. Conta financiada | Operação real + saques | Saques realizados com sucesso |
| 5. Escala / futuros | Contas maiores; `IBKRBroker` ou Topstep para o MGC | Decisão do usuário |

## 13. Fora do escopo (por enquanto)

- Machine learning / IA para gerar sinais.
- Outros ativos além do ouro.
- Interface gráfica (o acompanhamento é feito por relatórios e alertas).
- Robôs comprados prontos ou copy trading.

## 14. Riscos conhecidos

- A maioria das estratégias de varejo não tem vantagem real; o resultado pode ser
  "nenhuma combinação aprovada". Esse é um resultado válido, que evita perda de dinheiro.
- O M1 é sensível a custos e latência; pode não ser aprovado.
- As regras das mesas mudam; os valores ficam em configuração e são revisados antes de cada fase.
- Os ganhos no exterior devem ser declarados à Receita Federal.

## 15. Pendências

- Confirmar nas páginas oficiais da FTMO: limites, janela de notícias e regras para robôs.
- Escolher a fonte do calendário de notícias (feed automático ou CSV mantido manualmente).
- Escolher o VPS Windows (próximo ao servidor da FTMO/corretora).
