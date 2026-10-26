# Coleta de Pneus v3 (Claude Code + Baileys) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Trocar a conexão por Baileys e o atendente por Claude Code na assinatura (`claude -p`), com as travas de segurança da spec §16 e rastreamento completo via MCP.

**Architecture:** Um adaptador `src/whatsapp/conexao.js` (Baileys) expõe a mesma interface usada pelo robô (`numeroNoWhatsapp`, `enviarTexto`, `digitando`, `aoReceber`). O atendente vira uma interface `decidir(est, historico)` com dois backends: `claude-code` (padrão) e `api` (opcional). Decisões e travas continuam em módulos puros testados.

**Tech Stack:** Node 24, baileys 7.0.0-rc14, Claude Code CLI (`claude -p --output-format json --json-schema --tools "" --model haiku --no-session-persistence`), zod 4 (`z.toJSONSchema`), node:sqlite.

**Spec:** `docs/superpowers/specs/2026-10-26-coleta-pneus-design.md` §16 (e §15 para o que permanece).

## Global Constraints
- Sem `ANTHROPIC_API_KEY` por padrão; `ATENDENTE=claude-code` usa `CLAUDE_CODE_OAUTH_TOKEN`.
- Resposta só para contatos prospectados; pausa de 12 h quando o dono assume; teto 8 respostas/24 h/contato.
- Inválido só com `exists: false`.
- `whatsapp-web.js` removido do projeto.

## Review Focus
1. Cliente normal da empresa escreve → nada é respondido, só registrado. (Task 3)
2. Outro robô repete a mesma mensagem → para e avisa o dono. (Task 3)
3. `claude -p` demora/falha/limite → contato não recebe resposta inventada; dono avisado; primeira mensagem cai no modelo pronto. (Task 2)
4. Mensagem do dono pelo celular → atendente pausa o contato. (Task 3)
5. Reconexão Baileys → um único socket, sem listeners duplicados. (Task 1)

### Task 1: Conexão Baileys + registro de todas as conversas
- Create `src/whatsapp/conexao.js`: `criarConexao({ pastaSessao, aoMudar, aoMensagem, log }) -> { numeroNoWhatsapp(numero) -> {existe, jid, ehBusiness}, enviarTexto(jid, texto, {digitandoMs}) -> idMensagem, idsEnviadosPeloRobo: Set, parar() }`; reconecta salvo `loggedOut` (aí limpa sessão e pede QR); um socket por vez.
- Create `src/whatsapp/mensagem.js` (puro): `extrairMensagem(m) -> { jid, jidAlt, deMim, texto, id, quando } | null` (ignora grupos/status/protocolo).
- Modify `src/db.js`: tabela `whatsapp_mensagens` (jid, jid_alt, de_mim, texto, id_msg UNIQUE, quando, pelo_robo); `PRAGMA busy_timeout = 5000`.
- Tests: extrairMensagem (texto simples, extendedText, legenda de imagem, grupo ignorado, LID com remoteJidAlt), gravação idempotente.

### Task 2: Atendente via Claude Code
- Create `src/atendente/claude-code.js`: `executarClaude(prompt, { esquema, sistema, modelo='haiku', timeoutMs=60000, spawnFn }) -> objeto` (spawn `claude -p … --output-format json --json-schema <json> --tools "" --no-session-persistence --system-prompt <sistema>`; lê `structured_output`/`result` do JSON; erro/timeout → `ErroAtendente`).
- `decidirComClaudeCode({ est, historico, hoje })` usando `EsquemaDecisao` (resposta pode ser vazia) e as mesmas instruções de `ia.js` (extraídas para `src/atendente/instrucoes.js`).
- `primeiraMensagemComClaudeCode(est)` → `{ texto }`; garante preço R$1,50 e frase de saída (anexa se faltar); falha → modelo pronto.
- Tests com `spawnFn` falso: sucesso, JSON inválido, código de saída ≠ 0, timeout.

### Task 3: Travas de segurança e robô v3
- Create `src/atendente/travas.js` (puro): `podeResponder(db, est, agora) -> { ok, motivo }` (prospectado? pausado pelo dono? teto 24 h? repetição de mensagem recebida?).
- Modify `src/optout.js`: "não" isolado deixa de ser opt-out.
- Modify `src/whatsapp/robo.js`: usa conexão Baileys e `decidir`; registra `fromMe` manual como "dono assumiu" (pausa 12 h); resposta vazia não envia; rota/avisos via conexão.
- Tests: cada trava; opt-out; robô com conexão falsa (cliente normal ignorado, dono assumiu, loop interrompido).

### Task 4: App, agendador, config e MCP de rastreamento
- `src/app.js`: conexão Baileys, `ATENDENTE` escolhe backend, rota diária com marcador após entrega ao dono e motorista separado.
- `src/verificar-config.js`: recusa valores de exemplo do `.env.exemplo` e exige `EMPRESA_NOME`, `DONO_WHATSAPP`, `OFERTA_REMOLD`.
- `src/mcp.js`: `sem_resposta`, `responderam`, `conversas_recentes`, `ler_chat`.
- Remover `whatsapp-web.js`, `src/whatsapp/cliente.js`, `src/whatsapp/verificacao.js` (substituídos), atualizar `rodar.js` (modo local) para Baileys.
- Tests: config, ferramentas MCP novas.

### Task 5: Deploy e README
- `deploy/instalar.sh`: instala Claude Code CLI (`npm i -g @anthropic-ai/claude-code`), `DEBIAN_FRONTEND=noninteractive`, usuário do serviço = usuário do instalador.
- `.env.exemplo`: `ATENDENTE=claude-code`, `CLAUDE_CODE_OAUTH_TOKEN=`, campos da empresa vazios.
- README: gerar token com `claude setup-token`, colar no `.env`.
