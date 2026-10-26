# Coleta de Pneus v2 (nuvem + automação) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Rodar o sistema 24 h na Oracle Cloud, com atendimento automático (Claude Haiku 5.5), verificação rigorosa de números, rotinas agendadas, painel com login e QR code, e servidor MCP sob demanda.

**Architecture:** Um processo `src/app.js` (systemd) junta cliente WhatsApp, agendador, atendente, painel Express e MCP (`/mcp`). Lógica de decisão pura e testada; integrações finas. Caddy faz HTTPS via `IP.sslip.io`.

**Tech Stack:** Node 24, node:sqlite, whatsapp-web.js 1.34, @anthropic-ai/sdk 1.3 (`messages.parse` + `zodOutputFormat`), zod 4, @modelcontextprotocol/sdk 1.32 (`McpServer.registerTool`, `StreamableHTTPServerTransport` stateless), qrcode, Caddy.

**Spec:** `docs/superpowers/specs/2026-10-26-coleta-pneus-design.md` §15.

## Global Constraints
- Modelo do atendente: `claude-haiku-5-5`, `output_config.effort: "low"`, saída estruturada.
- Preço R$1,50/pneu vindo de `config.precoPorPneu`; nada de desconto/prazo inventado.
- Ninguém recebe mensagem sem `tem_whatsapp = 1`; `invalido`/`optout` nunca recebem.
- Segredos só no `.env` do servidor: `ANTHROPIC_API_KEY`, `PAINEL_USUARIO`, `PAINEL_SENHA`, `MCP_TOKEN`, `DONO_WHATSAPP`, `MOTORISTA_WHATSAPP`.
- Painel e MCP exigem autenticação; sem `.env` válido o app não sobe o painel.

## Review Focus
1. Resposta da IA com intenção `aceitou` sem data → agenda próximo dia útil, nunca domingo. (Task 2)
2. Falha da API da Anthropic → não responde e avisa o dono, sem travar o processo. (Task 2)
3. "número errado"/"não é borracharia" → `invalido`, sai da fila para sempre. (Task 1/2)
4. Rotina das 17h rodando duas vezes no mesmo dia (reinício) → envia a rota uma vez só. (Task 3)
5. MCP/painel sem token/senha → 401. (Task 4)

### Task 1: Verificação e confiança dos números
- Create `src/numeros.js`: `confiancaDoNumero({ ehBusiness, nomePerfil, nomeEstabelecimento }) -> 'alta'|'media'`; `extrairWhatsappDoHtml(html) -> string[]` (números de links `wa.me/…`, `api.whatsapp.com/send?phone=…`, normalizados).
- Modify `src/db.js`: colunas `confianca`, `site`; status `invalido` aceito.
- Modify `src/whatsapp/fila.js`: ordena `confianca='alta'` antes de `media`; ignora `invalido`.
- Modify `src/mapeamento/maps.js`: guarda `site` (botão `a[data-item-id="authority"]`); `src/mapeamento/site.js` busca o HTML do site e retorna WhatsApp encontrado (timeout 10 s).
- Verificação passa a testar fixos também; usa `client.getContactById(wid)` → `isBusiness`, `pushname`/`verifiedName`.
- Tests: confiança (business → alta; nome parecido → alta; resto → media), extração de wa.me/api.whatsapp, fila ordena alta primeiro e pula invalido.

### Task 2: Atendente automático
- Create `src/atendente/decisao.js` (puro): `aplicarDecisao(db, est, decisao, agora) -> { resposta: string|null, avisarDono: string|null }` — aceitou → agenda coleta (data informada ou próximo dia útil), status `coleta_agendada`; recusou → `recusou`; optout → `marcarOptout`; numero_errado → `invalido`; pergunta/outro → resposta + aviso ao dono quando `precisaDono`; remold sim/nao grava `trabalha_remold`.
- Create `src/atendente/ia.js`: `interpretar(cliente, { est, historico, hoje, config }) -> Decisao` com `messages.parse`, `zodOutputFormat(EsquemaDecisao)`, system prompt com as regras fixas da spec §15; erros → lança `ErroAtendente`.
- Tests: aplicarDecisao para cada intenção; data inválida/passada → próximo dia útil; ia.js com cliente falso (objeto com `messages.parse`) devolve decisão e propaga erro.

### Task 3: Agendador e textos
- Create `src/agendador.js` (puro): `tarefasDevidas(agora, ultimas: {rotaDiaria?, remapeamento?}) -> ('rota_diaria'|'remapeamento')[]` (rota 17:00 seg–sáb, uma vez por dia; remapeamento seg 06:00, uma vez por semana); `textoRota(rota, data) -> string`; remold automático elegível 3 dias após `recolhido`.
- Tests: horários, não repetir no mesmo dia, texto com links e total em R$.

### Task 4: App único, painel com login/QR e MCP
- Create `src/whatsapp/robo.js` (extraído de `rodar.js`): `iniciarRobo({ db, client, config, atendente, avisarDono })` com recebimento (atendente) e laço de envio; `rodar.js` passa a usá-lo.
- Create `src/mcp.js`: `criarMcp(db) -> McpServer` com ferramentas `funil`, `listar_contatos`, `conversa`, `agendar_coleta`, `responder`, `rota`, `pausar`, `retomar`, `mapear_cidade`.
- Modify `src/painel/servidor.js`: `criarApp(db, { usuario, senha, mcpToken })` com Basic Auth no painel/API, `POST /mcp` com Bearer, `GET /api/qr` (PNG data URL do QR salvo em `ajustes`).
- Create `src/app.js`: lê `.env`, abre banco, sobe painel (0.0.0.0:3000 atrás do Caddy), conecta WhatsApp (QR → ajuste), inicia robô + agendador.
- Tests: 401 sem senha/token; MCP `tools/list` e `funil` via HTTP com token.

### Task 5: Deploy
- Create `deploy/instalar.sh`, `deploy/atualizar.sh`, `deploy/coleta-pneus.service`, `deploy/Caddyfile.modelo`, `.env.exemplo`; README seção "Nuvem (Oracle)".
- Verificação: `bash -n` nos scripts; `npm test` verde.
