# Coleta de Pneus — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Programa local que mapeia borracharias/auto centers de 14 cidades, contata pelo WhatsApp (não oficial) com regras anti-bloqueio, administra o funil num painel e gera rotas de coleta a R$1,50/pneu, com campanha de remold depois.

**Architecture:** Um app Node.js em `coleta-pneus/`. Lógica pura (telefone, deduplicação, agenda de envio, opt-out, rota, preço) em módulos testados com `node:test`. Integrações (Playwright/Google Maps, Overpass/OSM, whatsapp-web.js) são finas e verificadas manualmente no Windows do dono. Persistência em SQLite via `node:sqlite` (sem dependência nativa). Painel = Express + HTML estático.

**Tech Stack:** Node.js ≥ 22.13, `node:sqlite`, `node:test`, Express 4, Playwright (chromium), whatsapp-web.js, qrcode-terminal.

**Spec:** `docs/superpowers/specs/2026-10-26-coleta-pneus-design.md`

## Global Constraints

- Cidades (exatamente 14): Barra Mansa, Pinheiral, Porto Real, Quatis, Resende, Itatiaia, Barra do Piraí, Piraí, Rio Claro, Valença, Mendes, Engenheiro Paulo de Frontin, Miguel Pereira, Vassouras. **Nunca Volta Redonda.**
- Preço: R$1,50 por pneu (`PRECO_POR_PNEU = 1.5`).
- Termos de busca: "borracharia", "auto center", "pneus", "alinhamento e balanceamento", "recapagem", "loja de pneus".
- Envio: seg–sex 08:30–17:30, sáb 08:30–12:00, horário America/Sao_Paulo; domingo nunca.
- Limite diário: semana 1 = 20; +10 por semana; teto 60.
- Intervalo entre envios: aleatório 3–9 min; "digitando" proporcional ao texto.
- Máximo 1 lembrete, após 3 dias úteis sem resposta. Nunca mais que isso.
- Opt-out imediato e permanente; toda mensagem inicial termina com: `Se não quiser receber mensagens, é só responder "sair".`
- Parar envios após 3 falhas seguidas.
- Rota: até 10 paradas por link do Google Maps.
- Tudo grátis: nenhuma API paga; nenhum envio real sem teste prévio em números do dono.
- Textos para o usuário em português do Brasil.

## Review Focus

1. Telefones em formatos sujos ("(24) 3322-1100", "024 99999-0000", "+55 24 9…", 0800, sem DDD) → normaliza ou descarta; fixo nunca vira WhatsApp. Teste em Task 1.
2. Opt-out com acento/maiúscula/frase ("NÃO", "nao quero", "Pode parar", "sair!") → marca optout; "não tenho pneus agora" NÃO é opt-out. Teste em Task 4.
3. Mesmo estabelecimento vindo de Maps e OSM com nome levemente diferente; e duas filiais da mesma rede com telefones distintos → uma linha para o primeiro caso, duas no segundo. Teste em Task 2.
4. Envio agendado caindo fora do horário (sexta 17:20 + intervalo, sábado 11:58, feriado não considerado) → empurra para a próxima janela válida. Teste em Task 4.
5. Coleta sem coordenadas ou >10 paradas → rota ignora/sinaliza sem coordenadas e divide em vários links. Teste em Task 6.

---

## File Structure

```
coleta-pneus/
  package.json
  README.md                      # instalação e uso no Windows
  config/config.js               # cidades, termos, limites, preço, empresa, saída
  config/mensagens.js            # modelos de mensagem (coleta, lembrete, remold)
  src/telefone.js                # normalização e classificação
  src/dedup.js                   # chave e mesclagem de estabelecimentos
  src/db.js                      # abre SQLite, cria esquema, funções de acesso
  src/agenda.js                  # janela de envio, limite diário, próximo horário, lembrete
  src/optout.js                  # detecção de opt-out
  src/rota.js                    # vizinho mais próximo, divisão, link, valor
  src/remold.js                  # elegibilidade da campanha remold
  src/mapeamento/osm.js          # Overpass -> registros
  src/mapeamento/maps.js         # Playwright Google Maps -> registros
  src/mapeamento/rodar.js        # CLI: npm run mapear [-- --cidade X]
  src/exportar.js                # CLI: npm run exportar -> dados/estabelecimentos.csv
  src/whatsapp/cliente.js        # whatsapp-web.js: login, verificar, enviar, receber
  src/whatsapp/rodar.js          # CLI: npm run whatsapp (worker de envio)
  src/painel/servidor.js         # Express API + estáticos; npm run painel
  src/painel/public/index.html   # lista, filtros, funil
  src/painel/public/ficha.html   # ficha + conversa + aceite
  src/painel/public/rotas.html   # gerar rota
  test/*.test.js
```

---

### Task 1: Projeto, configuração e telefone

**Files:**
- Create: `coleta-pneus/package.json`, `coleta-pneus/config/config.js`, `coleta-pneus/src/telefone.js`, `coleta-pneus/test/telefone.test.js`

**Interfaces:**
- Produces: `config` (default export object) com `cidades: string[]`, `termos: string[]`, `precoPorPneu: 1.5`, `envio: { janelas, limiteInicial: 20, incrementoSemanal: 10, teto: 60, intervaloMinMin: 3, intervaloMaxMin: 9, diasUteisLembrete: 3, falhasParaParar: 3 }`, `empresa: { nome, cidadeBase, endereco, lat, lng }`, `uf: 'RJ'`, `dddPadrao: '24'`.
- Produces: `normalizarTelefone(bruto: string, dddPadrao?: string) -> { numero: string|null, tipo: 'celular'|'fixo'|'invalido' }` (numero no formato `55DDNNNNNNNNN`).

- [ ] **Step 1: Write the failing tests** (`test/telefone.test.js`, `node:test` + `assert`)

```js
assert.deepEqual(normalizarTelefone('(24) 99876-5432'), { numero: '5524998765432', tipo: 'celular' });
assert.deepEqual(normalizarTelefone('+55 24 3322-1100'), { numero: '552433221100', tipo: 'fixo' });
assert.deepEqual(normalizarTelefone('024 99876-5432'), { numero: '5524998765432', tipo: 'celular' });
assert.deepEqual(normalizarTelefone('99876-5432', '24'), { numero: '5524998765432', tipo: 'celular' });
assert.equal(normalizarTelefone('0800 123 4567').tipo, 'invalido');
assert.equal(normalizarTelefone('').tipo, 'invalido');
assert.equal(normalizarTelefone('123').tipo, 'invalido');
```

- [ ] **Step 2:** Run `cd coleta-pneus && node --test` → FAIL (module not found).
- [ ] **Step 3:** Create `package.json` (`"type": "module"`, `"engines": {"node": ">=22.13"}`, scripts: `test: node --test`, `mapear`, `exportar`, `whatsapp`, `painel`; deps: express, playwright, whatsapp-web.js, qrcode-terminal), `config/config.js` with the Global Constraints values (empresa fields as `'PREENCHER'` placeholders the owner edits), and implement `normalizarTelefone` (strip non-digits; drop leading `0` trunk; drop `55`; prepend `dddPadrao` if 8–9 digits; celular = 11 digits after DDD-prefix with 3rd digit `9`; fixo = 10 digits with 3rd digit 2–5; else invalido; `0800/0300/0500` invalido).
- [ ] **Step 4:** Run `node --test` → PASS.
- [ ] **Step 5:** Commit `feat(coleta): project setup, config and phone normalization`.

### Task 2: Banco e deduplicação

**Files:**
- Create: `src/db.js`, `src/dedup.js`, `test/dedup.test.js`, `test/db.test.js`

**Interfaces:**
- Consumes: `normalizarTelefone`.
- Produces: `abrirBanco(caminho = 'dados/coleta.db') -> db` (creates tables `estabelecimentos`, `mensagens`, `coletas`, `fila_envio` with columns from spec §4; `:memory:` allowed in tests).
- Produces: `mesmoEstabelecimento(a, b) -> boolean`; `distanciaMetros(lat1, lng1, lat2, lng2) -> number`.
- Produces on db module: `salvarEstabelecimento(db, reg) -> { id, novo: boolean }` (merges into existing if `mesmoEstabelecimento`, filling empty fields), `listarEstabelecimentos(db, filtros?) -> reg[]`, `atualizarEstabelecimento(db, id, campos)`, `registrarMensagem(db, { estabelecimentoId, direcao, texto, campanha, dataHora })`, `salvarColeta(db, coleta) -> id`, `listarColetas(db, { data, cidades })`.
- Registro: `{ nome, cidade, endereco, lat, lng, telefoneBruto, telefone, tipoTelefone, fonte: 'maps'|'osm', nota, avaliacoes, linkMaps }`.

- [ ] **Step 1: Write failing tests**

```js
// mesmo telefone normalizado => mesmo
assert.ok(mesmoEstabelecimento({ telefone: '5524998765432', nome: 'A', lat: 0, lng: 0 }, { telefone: '5524998765432', nome: 'B', lat: 1, lng: 1 }));
// nome parecido + < 80 m => mesmo
assert.ok(mesmoEstabelecimento({ nome: 'Borracharia do Zé', lat: -22.5, lng: -44.1 }, { nome: 'BORRACHARIA DO ZE', lat: -22.5003, lng: -44.1 }));
// mesmo nome, telefones diferentes, 2 km => diferentes (filiais)
assert.ok(!mesmoEstabelecimento({ nome: 'Pneus Sul', telefone: '5524999990001', lat: -22.5, lng: -44.1 }, { nome: 'Pneus Sul', telefone: '5524999990002', lat: -22.518, lng: -44.1 }));
// db: salvar duplicado mescla e preenche telefone vazio
const db = abrirBanco(':memory:');
const r1 = salvarEstabelecimento(db, { nome: 'Borracharia do Zé', cidade: 'Quatis', lat: -22.5, lng: -44.1, fonte: 'osm' });
const r2 = salvarEstabelecimento(db, { nome: 'Borracharia do Ze', cidade: 'Quatis', lat: -22.5002, lng: -44.1, telefone: '5524998765432', fonte: 'maps' });
assert.equal(r2.id, r1.id); assert.equal(r2.novo, false);
assert.equal(listarEstabelecimentos(db)[0].telefone, '5524998765432');
```

- [ ] **Step 2:** `node --test` → FAIL.
- [ ] **Step 3:** Implement. Name comparison: lowercase, strip accents (`normalize('NFD')`), remove non-alphanumerics, then equal or one contains the other. Distance by haversine. New estabelecimento status = `pronto` if celular, `sem_whatsapp` otherwise (later refined by verification), default `trabalha_remold = 'desconhecido'`, `optout = 0`.
- [ ] **Step 4:** `node --test` → PASS.
- [ ] **Step 5:** Commit `feat(coleta): sqlite schema and deduplication`.

### Task 3: Mapeamento (OSM + Google Maps) e exportação

**Files:**
- Create: `src/mapeamento/osm.js`, `src/mapeamento/maps.js`, `src/mapeamento/rodar.js`, `src/exportar.js`, `test/osm.test.js`, `test/fixtures/overpass.json`

**Interfaces:**
- Consumes: `config`, `normalizarTelefone`, `abrirBanco`, `salvarEstabelecimento`.
- Produces: `consultaOverpass(cidade: string, uf: string) -> string` (Overpass QL: area by `name`+`boundary=administrative`+`admin_level=8` inside RJ; nodes/ways with `shop=tyres`, `shop=car_repair`, `craft=car_repair`; `out center tags`), `converterOverpass(json, cidade) -> Registro[]`, `buscarOsm(cidade) -> Promise<Registro[]>` (POST https://overpass-api.de/api/interpreter).
- Produces: `buscarMaps(page, cidade, termo) -> Promise<Registro[]>` (Playwright page; query `"${termo} em ${cidade} RJ"`).
- CLI: `npm run mapear` (all cities) / `npm run mapear -- --cidade "Quatis"`; prints per city: encontrados, novos, com celular. `npm run exportar` writes `dados/estabelecimentos.csv` (UTF-8 with BOM, `;` separator for Excel BR).

- [ ] **Step 1: Write failing test** for `converterOverpass` with fixture containing: a node with `name`, `phone="+55 24 99876-5432"`, `shop=tyres`; a way with `center` and `contact:phone`; an element without name (must be skipped). Assert 2 registros, `fonte: 'osm'`, lat/lng from node or `center`, `telefone: '5524998765432'`, `tipoTelefone: 'celular'`. Also assert `consultaOverpass('Quatis','RJ')` contains `"Quatis"` and `shop"="tyres"` and never contains `Volta Redonda`.
- [ ] **Step 2:** `node --test` → FAIL.
- [ ] **Step 3:** Implement OSM conversion/query. Implement `buscarMaps`: open `https://www.google.com/maps/search/<query>`, scroll the results feed (`div[role="feed"]`) until "Você chegou ao final da lista" or no growth for 3 scrolls; for each result link (`a[href*="/maps/place/"]`) open it and read name (`h1`), address button (`button[data-item-id="address"]`), phone button (`button[data-item-id^="phone"]`), rating, reviews, URL; parse lat/lng from URL `!3d<lat>!4d<lng>`. Random waits 2–6 s. Skip results whose address does not contain the target city (Maps leaks nearby cities; Volta Redonda results discarded). `rodar.js`: launch Chromium **headful**, loop cities × termos, OSM first then Maps, save each via `salvarEstabelecimento`.
- [ ] **Step 4:** `node --test` → PASS. Manual (owner, Windows): `npm run mapear -- --cidade "Quatis"` then `npm run exportar`; open CSV in Excel and spot-check 10 rows against Google Maps.
- [ ] **Step 5:** Commit `feat(coleta): OSM and Google Maps mapping with CSV export`.

### Task 4: Agenda de envio e opt-out

**Files:**
- Create: `src/agenda.js`, `src/optout.js`, `test/agenda.test.js`, `test/optout.test.js`

**Interfaces:**
- Consumes: `config.envio`.
- Produces: `dentroDaJanela(data: Date) -> boolean`; `proximoHorarioValido(data: Date) -> Date`; `limiteDoDia(dataInicioCampanha: Date, hoje: Date) -> number`; `proximoEnvio(ultimoEnvio: Date, rng = Math.random) -> Date` (ultimo + 3..9 min, empurrado para janela válida); `precisaLembrete(enviadoEm: Date, agora: Date, jaLembrado: boolean, respondeu: boolean) -> boolean` (3 dias úteis, seg–sex); `ehOptout(texto: string) -> boolean`.
- All times interpreted in America/Sao_Paulo (use `Intl.DateTimeFormat` parts; tests build dates with explicit `-03:00`).

- [ ] **Step 1: Write failing tests**

```js
assert.ok(dentroDaJanela(new Date('2026-11-03T10:00:00-03:00')));          // terça
assert.ok(!dentroDaJanela(new Date('2026-11-03T17:31:00-03:00')));
assert.ok(dentroDaJanela(new Date('2026-11-07T11:59:00-03:00')));          // sábado
assert.ok(!dentroDaJanela(new Date('2026-11-07T12:01:00-03:00')));
assert.ok(!dentroDaJanela(new Date('2026-11-08T10:00:00-03:00')));         // domingo
assert.equal(proximoHorarioValido(new Date('2026-11-06T17:40:00-03:00')).toISOString(), new Date('2026-11-07T08:30:00-03:00').toISOString());
assert.equal(proximoHorarioValido(new Date('2026-11-07T12:05:00-03:00')).toISOString(), new Date('2026-11-09T08:30:00-03:00').toISOString());
const ini = new Date('2026-11-02T08:30:00-03:00');
assert.equal(limiteDoDia(ini, new Date('2026-11-04T09:00:00-03:00')), 20);
assert.equal(limiteDoDia(ini, new Date('2026-11-10T09:00:00-03:00')), 30);
assert.equal(limiteDoDia(ini, new Date('2027-01-10T09:00:00-03:00')), 60);
const p = proximoEnvio(new Date('2026-11-03T10:00:00-03:00'), () => 0); // 3 min
assert.equal(p.toISOString(), new Date('2026-11-03T10:03:00-03:00').toISOString());
assert.ok(precisaLembrete(new Date('2026-11-06T10:00:00-03:00'), new Date('2026-11-11T10:00:00-03:00'), false, false)); // sex -> qua = 3 dias úteis
assert.ok(!precisaLembrete(new Date('2026-11-06T10:00:00-03:00'), new Date('2026-11-10T10:00:00-03:00'), false, false));
assert.ok(!precisaLembrete(new Date('2026-11-06T10:00:00-03:00'), new Date('2026-11-20T10:00:00-03:00'), true, false));
for (const t of ['sair', 'SAIR!', 'Não', 'nao quero', 'pode parar', 'remove meu número', 'não tenho interesse']) assert.ok(ehOptout(t), t);
for (const t of ['não tenho pneus agora, semana que vem', 'tenho uns 40', 'quanto custa?']) assert.ok(!ehOptout(t), t);
```

- [ ] **Step 2:** `node --test` → FAIL.
- [ ] **Step 3:** Implement. Opt-out: normalize (lowercase, no accents, no punctuation); true if text equals one of `sair|nao|para|pare|parar|stop|cancelar` or contains `nao quero`, `pode parar`, `nao tenho interesse`, `remove`, `nao me mande`, `nao mande`, `descadastr`. A message that only starts with "nao" but continues (e.g. "nao tenho pneus agora") is not opt-out unless it matches a phrase above.
- [ ] **Step 4:** `node --test` → PASS.
- [ ] **Step 5:** Commit `feat(coleta): sending schedule rules and opt-out detection`.

### Task 5: WhatsApp (verificação, envio, recebimento)

**Files:**
- Create: `config/mensagens.js`, `src/whatsapp/cliente.js`, `src/whatsapp/rodar.js`, `test/mensagens.test.js`

**Interfaces:**
- Consumes: `abrirBanco`, `listarEstabelecimentos`, `atualizarEstabelecimento`, `registrarMensagem`, agenda functions, `ehOptout`, `config`.
- Produces: `montarMensagem(tipo: 'coleta'|'lembrete'|'remold', est, config, rng = Math.random) -> string` (picks one of ≥3 variants; fills `{nome}`, `{cidade}`, `{empresa}`, `{cidade_base}`, `{preco}`="R$1,50"; coleta and remold end with the opt-out sentence from Global Constraints).
- Produces: `criarCliente() -> Promise<Client>` (whatsapp-web.js `LocalAuth` at `dados/sessao-whatsapp`, QR in terminal), `verificarNumero(client, numero) -> Promise<boolean>`, `enviar(client, numero, texto) -> Promise<void>` (sendStateTyping, wait `min(15s, 40ms × chars)`, sendMessage).
- CLI `npm run whatsapp`: (1) verifies all `pronto` estabelecimentos with unknown `tem_whatsapp`; (2) loop: if `dentroDaJanela(now)` and sent today < `limiteDoDia`, send next (`coleta` for status `pronto`, `lembrete` when `precisaLembrete`), set status `enviado`, schedule via `proximoEnvio`; (3) on incoming message from a known number: `registrarMensagem(recebida)`, status `respondeu`, and if `ehOptout` → `optout=1`, status `optout`, reply once "Certo, não enviaremos mais mensagens. Obrigado!"; (4) 3 consecutive send errors → stop and print warning; (5) `--teste` flag sends only to `config.numerosTeste` (owner's numbers) and ignores limits.

- [ ] **Step 1: Write failing test** for `montarMensagem`: with `{ nome: 'Borracharia do Zé', cidade: 'Quatis' }`, coleta text contains `Borracharia do Zé`, `Quatis`, `R$1,50`, ends with the opt-out sentence; never contains `{`; with `rng` returning 0, 0.5, 0.99 at least 2 distinct texts.
- [ ] **Step 2:** `node --test` → FAIL.
- [ ] **Step 3:** Implement `mensagens.js` (spec §6 example as variant 1; 2 more variants same content) and the WhatsApp client/worker. Optout/never-contact guard: worker never selects rows with `optout=1` or status in `recusou|optout`.
- [ ] **Step 4:** `node --test` → PASS. Manual (owner): fill `numerosTeste` in config, `npm run whatsapp -- --teste`, scan QR with the separate chip, confirm 3 messages arrive with typing indicator, reply "sair" from one and confirm it becomes optout in the DB/painel.
- [ ] **Step 5:** Commit `feat(coleta): WhatsApp verification, paced sending and inbound handling`.

### Task 6: Rotas e valor da coleta

**Files:**
- Create: `src/rota.js`, `test/rota.test.js`

**Interfaces:**
- Consumes: `distanciaMetros`, `config.empresa`, `config.precoPorPneu`.
- Produces: `ordenarParadas(origem: {lat,lng}, paradas: {id,lat,lng}[]) -> paradas[]` (vizinho mais próximo); `dividirRota(paradas, max = 10) -> paradas[][]`; `linkGoogleMaps(origem, paradas) -> string` (`https://www.google.com/maps/dir/?api=1&origin=lat,lng&destination=<última>&waypoints=<resto separados por %7C>&travelmode=driving`); `valorColeta(qtdPneus: number) -> number` (qtd × 1.5, 2 casas); `montarRota(origem, coletas) -> { rotas: { link, paradas }[], semCoordenadas: coleta[], totalPneus, totalValor }`.

- [ ] **Step 1: Write failing tests**: ordering of 3 points on a line returns nearest-first; 23 stops → 3 chunks (10,10,3); link for 2 stops has `origin=`, `destination=` second stop, `waypoints=` first stop; `valorColeta(40) === 60`; `valorColeta(7) === 10.5`; coleta without lat/lng goes to `semCoordenadas` and is not in any route; totals sum `qtd_pneus_prevista`.
- [ ] **Step 2:** `node --test` → FAIL.
- [ ] **Step 3:** Implement. Each chunk after the first starts from the last stop of the previous chunk.
- [ ] **Step 4:** `node --test` → PASS.
- [ ] **Step 5:** Commit `feat(coleta): collection route planning and pricing`.

### Task 7: Painel web

**Files:**
- Create: `src/painel/servidor.js`, `src/painel/public/index.html`, `src/painel/public/ficha.html`, `src/painel/public/rotas.html`, `test/painel.test.js`

**Interfaces:**
- Consumes: db functions, `montarRota`, `valorColeta`, `config`.
- Produces: `criarApp(db) -> express.Application` with JSON API:
  - `GET /api/estabelecimentos?cidade=&status=&whatsapp=&remold=` → list
  - `GET /api/funil` → `{ [cidade]: { mapeados, comWhatsapp, enviados, responderam, aceitaram, recolhidos } }`
  - `GET /api/estabelecimentos/:id` → registro + mensagens + coletas
  - `PATCH /api/estabelecimentos/:id` → `{ status?, trabalha_remold?, observacoes? }`
  - `POST /api/estabelecimentos/:id/responder` → `{ texto }` enfileira resposta manual (worker envia; fica em `fila_envio` campanha `manual`)
  - `POST /api/coletas` → `{ estabelecimentoId, dataPrevista, qtdPrevista }` (status estabelecimento → `coleta_agendada`)
  - `PATCH /api/coletas/:id` → `{ qtdReal, status: 'feita'|'cancelada' }` (feita → estabelecimento `recolhido`, valor = `valorColeta(qtdReal)`)
  - `GET /api/rotas?data=YYYY-MM-DD&cidades=A,B` → `montarRota` result
  - `POST /api/pausar` / `POST /api/retomar` → flag `envios_pausados` lida pelo worker
- `npm run painel` serves on `http://localhost:3000`.

- [ ] **Step 1: Write failing test** (`node:test`, start app on port 0, use `fetch`): seed 2 estabelecimentos in `:memory:`; `GET /api/funil` counts them under their city; `POST /api/coletas` then `GET /api/rotas?data=…` returns 1 stop and `totalValor = qtd × 1.5`; `PATCH /api/coletas/:id {qtdReal: 30, status:'feita'}` sets estabelecimento status `recolhido`.
- [ ] **Step 2:** `node --test` → FAIL.
- [ ] **Step 3:** Implement API and three plain HTML pages (vanilla JS `fetch`, sem framework): lista com filtros e contadores do funil; ficha com conversa, botão responder, campos aceite (qtd, data) e remold sim/não; rotas com seleção de data/cidades, links abertos em nova aba e resumo (paradas, pneus, R$). Botão "Pausar envios" no topo.
- [ ] **Step 4:** `node --test` → PASS. Manual: `npm run painel`, open browser, navigate the three pages.
- [ ] **Step 5:** Commit `feat(coleta): local management panel`.

### Task 8: Campanha remold e README

**Files:**
- Create: `src/remold.js`, `test/remold.test.js`, `coleta-pneus/README.md`
- Modify: `src/whatsapp/rodar.js` (flag `--campanha remold`), `config/mensagens.js` (remold variants with `{oferta}` from config)

**Interfaces:**
- Produces: `elegivelRemold(est, jaEnviouRemold: boolean) -> boolean` (true only if status `recolhido` or `aceitou`, `optout=0`, not yet sent remold).

- [ ] **Step 1: Write failing tests**: recolhido → true; aceitou → true; enviado/respondeu/recusou → false; optout=1 → false; já enviado → false.
- [ ] **Step 2:** `node --test` → FAIL.
- [ ] **Step 3:** Implement; worker with `--campanha remold` uses same pacing rules, only elegíveis, `montarMensagem('remold', …)`. Write README in Portuguese for Windows: instalar Node LTS, `npm install`, `npx playwright install chromium`, editar `config/config.js` (empresa, endereço, lat/lng de saída, números de teste, texto da oferta remold), comandos (`mapear`, `exportar`, `whatsapp -- --teste`, `whatsapp`, `painel`, `whatsapp -- --campanha remold`), rotina diária sugerida e cuidados anti-bloqueio.
- [ ] **Step 4:** `node --test` → all PASS.
- [ ] **Step 5:** Commit `feat(coleta): remold campaign and Windows README`.
