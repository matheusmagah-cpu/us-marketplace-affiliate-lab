# Coleta de Pneus — Manual

Sistema que **mapeia borracharias e auto centers** de 14 cidades vizinhas de Volta Redonda, **chama pelo WhatsApp** imitando uma pessoa, **responde sozinho com o Claude** (pela sua assinatura, sem chave de API), organiza tudo num **painel** e monta as **rotas de coleta** (R$1,50 por pneu). Depois faz a **campanha de pneu remold**.

Volta Redonda é só o ponto de saída das rotas (Av. Adalberto Barros Nunes, Retiro); não é prospectada.

Cidades: Barra Mansa, Pinheiral, Porto Real, Quatis, Resende, Itatiaia, Barra do Piraí, Piraí, Rio Claro, Valença, Mendes, Engenheiro Paulo de Frontin, Miguel Pereira e Vassouras.

## Como funciona

```
Google Maps + OpenStreetMap ──► mapeamento (só números confirmados no WhatsApp)
                                      │
                                      ▼
   servidor Oracle (24 h) ──► robô: 1ª mensagem escrita pelo Claude ──► WhatsApp Business (seu número)
          │                         │                                         │
          │                         └── resposta chega ──► Claude decide (5–10 s) ──► responde / agenda coleta
          │
          ├── painel (celular/navegador): contatos, conversas, coletas, rotas, QR do WhatsApp
          ├── 17h: rota do dia seguinte no seu WhatsApp (e do motorista)
          └── /mcp: você conversa comigo (Claude) sobre tudo quando quiser
```

- **WhatsApp:** conexão direta com os servidores do WhatsApp (biblioteca Baileys), sem navegador. Se cair, reconecta sozinha; a sessão fica salva e só pede QR de novo se você desconectar o aparelho no celular.
- **Atendente:** o servidor chama o **Claude Code** com o seu token de assinatura. Cada resposta leva uns 7 segundos. O Claude só **interpreta** a mensagem (aceitou, recusou, quantos pneus, que dia, pergunta…); preço, datas e confirmação são montados pelo programa, então ele não inventa desconto nem promessa.
- **Tudo fica registrado:** cada mensagem que entra ou sai do número (inclusive as que você manda pelo celular) vai para o banco, e você lê tudo pelo painel ou pelo MCP.

---

## 1. Contas (uma vez)

1. **Oracle Cloud:** crie a conta em https://www.oracle.com/cloud/free/ (pede cartão só para verificar; o plano "Always Free" não cobra).
2. **Claude:** a sua assinatura (Pro ou Max). Não precisa de chave de API.

## 2. Criar o servidor

No painel da Oracle:

1. **Compute > Instances > Create instance**.
2. Imagem **Ubuntu 24.04**; formato **Ampere (VM.Standard.A1.Flex)** com 2 OCPUs e 12 GB (dentro do grátis).
3. Em "Add SSH keys", deixe gerar a chave e **baixe a chave privada**.
4. Crie. Anote o **IP público**.
5. Abra as portas do site: na página da instância, clique na **Subnet > Security List > Add Ingress Rules**: origem `0.0.0.0/0`, protocolo TCP, portas `80,443`.

## 3. Instalar

Entre no servidor (pelo **Cloud Shell** da Oracle, ícone `>_` no topo, ou com `ssh ubuntu@IP`) e rode:

```
curl -fsSL https://raw.githubusercontent.com/matheusmagah-cpu/us-marketplace-affiliate-lab/feat/coleta-pneus/coleta-pneus/deploy/instalar.sh -o instalar.sh
bash instalar.sh
```

O instalador coloca Node.js, Claude Code, o navegador do mapeamento, HTTPS (Caddy) e o serviço que liga sozinho. No final mostra o **endereço do painel** (ex.: `https://150-230-10-20.sslip.io`).

## 4. Configurar e ligar

1. Gere o token do Claude **no servidor** (aparece um link: abra, entre com a sua conta e cole o código de volta):

   ```
   claude setup-token
   ```

2. Abra a configuração:

   ```
   nano /opt/coleta/coleta-pneus/.env
   ```

   Preencha `EMPRESA_NOME`, `DONO_WHATSAPP` (seu número pessoal, recebe rota e avisos), `OFERTA_REMOLD` (com preço de verdade), `CLAUDE_CODE_OAUTH_TOKEN` (o token do passo 1) e, se quiser, `MOTORISTA_WHATSAPP`. A senha do painel e o token do MCP já foram gerados. Salve (`Ctrl+O`, Enter, `Ctrl+X`). O robô **não liga** enquanto esses campos estiverem vazios ou com valor de exemplo.

3. Ligue:

   ```
   sudo systemctl start coleta-pneus
   ```

4. Abra o painel no navegador ou no celular, entre com usuário e senha (`PAINEL_USUARIO` / `PAINEL_SENHA` do `.env`), vá em **WhatsApp** e leia o QR code com o **WhatsApp Business da empresa** (Aparelhos conectados > Conectar aparelho). Só precisa fazer isso uma vez.

5. Primeiro mapeamento (algumas horas, trabalha devagar de propósito):

   ```
   cd /opt/coleta/coleta-pneus && npm run mapear -- --headless
   ```

   Para conferir antes, comece por uma cidade: `npm run mapear -- --headless --cidade "Quatis"`. Depois o robô remapeia sozinho toda segunda.

## 5. O que o robô faz sozinho

- Confere quais números **têm WhatsApp de verdade**; quem não tem não recebe nada (aparece no painel em "Sem WhatsApp").
- Manda a 1ª mensagem (escrita pelo Claude, com o nome da borracharia e o preço) só de **segunda a sexta, 8h30–17h30, e sábado, 8h30–12h**.
- Começa com **20 mensagens por dia**, sobe 10 por semana até 60, com **3 a 9 minutos** entre elas e "digitando…".
- **1 lembrete** só, 3 dias úteis depois, para quem não respondeu.
- Responde em 5–10 segundos (a qualquer hora em que a borracharia escrever), agenda a coleta em dia útil (o pedido, ou o próximo dia útil) e confirma.
- Às **17h** (seg–sex) manda a **rota do dia seguinte** no seu WhatsApp, na ordem do caminho mais curto, com link do Google Maps.
- **3 dias depois** de uma coleta feita, oferece o pneu remold.

### Travas de segurança

- Só responde quem **foi prospectado** por ele. Clientes, amigos e família no mesmo número são ignorados.
- Se **você** responder alguém pelo celular, o robô **fica quieto com aquele contato por 12 horas**.
- No máximo 8 respostas automáticas por contato em 24 h, e para se a pessoa repetir a mesma mensagem (evita conversa infinita com outro robô). Nos dois casos você é avisado.
- "Sair", "pare", "não quero", "pode parar"… → nunca mais recebe mensagem. Um "não" sozinho **não** conta como sair.
- "Número errado" → marcado como inválido.
- Se não souber responder, ou se o Claude falhar, diz que vai confirmar e **avisa você no WhatsApp**.
- Se der 3 erros de envio seguidos, **pausa os envios** e avisa você.

## 6. Painel

- **Contatos:** funil por cidade, filtros e a lista. Clique no nome para abrir a ficha.
- **Ficha:** conversa completa, responder, mudar status, marcar "trabalha com remold" e **agendar coleta** (data e quantidade).
- **Rotas:** escolha a data e clique em **Gerar rota**. Depois da coleta, informe na ficha a quantidade real e clique em **Recolhido**.
- **WhatsApp:** status da conexão e QR code.
- **Pausar envios:** botão vermelho no topo.

## 7. Falar comigo (Claude) sobre o sistema — MCP

No seu computador, com o Claude Code instalado (troque o endereço e o token pelos seus; o token é o `MCP_TOKEN` do `.env`):

```
claude mcp add --transport http coleta https://SEU-ENDERECO.sslip.io/mcp --header "Authorization: Bearer SEU_MCP_TOKEN"
```

Depois é só pedir em português. Ferramentas disponíveis:

| Pergunta | Ferramenta |
|---|---|
| "Como está o funil?" | `funil` |
| "Quem respondeu?" / "Quem não respondeu há 2 dias?" | `responderam`, `sem_resposta` |
| "Quais conversas mexeram hoje?" | `conversas_recentes` |
| "Lê a conversa com 24 99999-8888" | `ler_chat`, `conversa` |
| "Lista as borracharias de Resende" | `listar_contatos` |
| "Agenda 40 pneus na Borracharia X dia 12" | `agendar_coleta` |
| "Responde a Borracharia X dizendo…" | `responder` |
| "Monta a rota de amanhã" | `rota` |
| "Mapeia Valença de novo" | `mapear_cidade` |
| "Pausa / retoma os envios" | `pausar`, `retomar` |

## 8. Manutenção

- Ver o que o robô está fazendo: `journalctl -u coleta-pneus -f`
- Atualizar para a versão nova do GitHub: `bash /opt/coleta/coleta-pneus/deploy/atualizar.sh`
- Cópia de segurança: a pasta `/opt/coleta/coleta-pneus/dados` (banco e sessão do WhatsApp). **Nunca** coloque essa pasta ou o `.env` no GitHub.
- Token do Claude expirou ou foi trocado: rode `claude setup-token` de novo, cole no `.env` e `sudo systemctl restart coleta-pneus`.
- Prefere pagar por uso em vez da assinatura: `ATENDENTE=api` e `ANTHROPIC_API_KEY=` no `.env`.

## Cuidados

- O WhatsApp usado aqui **não é o oficial**: existe risco de bloqueio do número. Os limites, os horários e a personalização existem para reduzir isso. **Não aumente os limites no começo.**
- O uso pelo Claude conta dentro dos limites da sua assinatura e segue os termos da Anthropic.
- O mapeamento usa o Google Maps de forma automatizada, o que vai contra os termos do Google; o volume é pequeno, mas o risco existe.

## Rodar no seu computador (opcional, para testes)

Com Node.js 24 e o Claude Code instalados, nesta pasta: `npm install`, copie `.env.exemplo` para `.env` e preencha (incluindo `NUMEROS_TESTE`).

```
npm run whatsapp -- --teste   # manda a 1ª mensagem só para os seus números de teste e responde como faria de verdade
npm run painel                # painel em http://localhost:3000
npm test                      # testes da lógica
```
