# ORDEM — Colocar no ar o sistema da Coleta de Pneus

> Copie tudo daqui para baixo e cole no ChatGPT.

---

Você vai me guiar, **um passo de cada vez**, para colocar no ar um sistema que **já está pronto**. Eu não sou programador. Siga estas regras sem exceção:

## Regras para você (ChatGPT)

1. **Não crie, não reescreva e não "melhore" nenhum código.** O sistema já está pronto e testado no GitHub. O seu trabalho é só me guiar na instalação e na configuração.
2. **Um passo por vez.** Dê o passo, diga exatamente onde clicar ou o que colar e o que eu devo ver na tela. Espere eu responder "feito" (ou colar o que apareceu) antes de ir para o próximo.
3. **Comandos exatamente como estão aqui.** Não troque nomes de pastas, de arquivos ou de variáveis. Não invente opções.
4. **Nunca me peça senhas, tokens ou chaves.** Não peça o token do Claude, o MCP_TOKEN, a PAINEL_SENHA nem a chave SSH. Esses valores ficam só no servidor. Se eu colar algum deles por engano, me avise para trocar.
5. **Se der erro**, peça para eu colar a mensagem de erro (sem segredos), consulte a seção "Problemas comuns" lá embaixo e só depois sugira outra coisa.
6. **No fim de cada etapa**, faça a verificação indicada antes de seguir.
7. **Fale em português simples.**

## O que é o sistema (para você entender)

- O código está no GitHub, repositório `matheusmagah-cpu/us-marketplace-affiliate-lab`, branch `feat/coleta-pneus`, pasta `coleta-pneus`.
- Ele roda num servidor **grátis da Oracle Cloud** (Ubuntu 24.04), ligado 24 horas.
- Funções:
  - mapeia borracharias e auto centers de 14 cidades vizinhas de Volta Redonda-RJ;
  - manda mensagem pelo **WhatsApp Business do dono** (conexão não oficial, por QR code);
  - responde as borracharias usando o **Claude Code com a assinatura do dono** (token gerado com `claude setup-token`);
  - agenda as coletas (R$1,50 por pneu);
  - manda a rota do dia seguinte às 17h;
  - tem um painel web com login e uma conexão MCP.
- Um instalador automático (`deploy/instalar.sh`) instala tudo: Node.js 24, Claude Code, navegador Chromium para o mapeamento, Caddy (HTTPS grátis em `IP.sslip.io`), firewall e o serviço `coleta-pneus`.
- Configuração: arquivo `/opt/coleta/coleta-pneus/.env`.
- Logs: `journalctl -u coleta-pneus -f`.

---

## ETAPA 1 — Criar a conta da Oracle Cloud

1. Acesse https://www.oracle.com/cloud/free/ e clique em **Start for free**.
2. Preencha os dados. O cartão é só para verificação; o plano **Always Free** não cobra.
3. Em **Home Region**, escolha **Brazil East (Sao Paulo)**. Ela não pode ser trocada depois.
4. Espere o e-mail de conta ativa e entre no painel (https://cloud.oracle.com).

**Verificação:** consigo ver o painel da Oracle com o menu ☰ no canto superior esquerdo.

## ETAPA 2 — Criar o servidor

1. Menu ☰ > **Compute** > **Instances** > **Create instance**.
2. **Name:** `coleta-pneus`.
3. **Image and shape** > **Edit**:
   - **Change image** > **Canonical Ubuntu** > versão **24.04** (não a "Minimal") > Select.
   - **Change shape** > **Ampere** > **VM.Standard.A1.Flex** > **2 OCPUs** e **12 GB** de memória > Select.
4. **Networking:** deixe criar a rede nova (VCN e subnet pública) e marque **Assign a public IPv4 address**.
5. **Add SSH keys:** **Generate a key pair for me** > clique em **Save private key** e guarde o arquivo `.key` numa pasta fácil, por exemplo `C:\oracle\`. **Não perca esse arquivo.**
6. Clique em **Create**. Espere ficar **RUNNING** (verde).
7. Anote o **Public IP address** (exemplo: `150.230.10.20`).

Se aparecer **"Out of capacity"**:
- tente de novo mais tarde ou troque o **Availability Domain**; ou
- use o formato **VM.Standard.E2.1.Micro** (AMD, também grátis). Ele é mais fraco, mas funciona; o instalador cria 4 GB de memória extra.

**Verificação:** a instância está RUNNING e eu tenho o IP público anotado.

## ETAPA 3 — Abrir as portas do site (80 e 443) na Oracle

1. Na página da instância, em **Primary VNIC**, clique no link da **Subnet**.
2. Clique na **Security List** (Default Security List…).
3. **Add Ingress Rules** e preencha:
   - Source CIDR: `0.0.0.0/0`
   - IP Protocol: `TCP`
   - Destination Port Range: `80,443`
4. Clique em **Add Ingress Rules**.

**Verificação:** a lista de regras mostra uma linha com as portas 80,443.

## ETAPA 4 — Entrar no servidor

No Windows, abra o **PowerShell** (tecla Windows, digite "PowerShell"). Troque o caminho do arquivo e o IP pelos meus:

```
ssh -i C:\oracle\NOME-DO-ARQUIVO.key ubuntu@MEU_IP
```

- Na primeira vez ele pergunta `Are you sure you want to continue connecting`: digite `yes` e Enter.
- Se der o erro **"UNPROTECTED PRIVATE KEY FILE"** ou **"bad permissions"**, rode no PowerShell (troque o caminho) e tente de novo:

```
icacls C:\oracle\NOME-DO-ARQUIVO.key /inheritance:r
icacls C:\oracle\NOME-DO-ARQUIVO.key /grant:r "$($env:USERNAME):(R)"
```

**Verificação:** a linha de comando mudou para algo como `ubuntu@coleta-pneus:~$`.

## ETAPA 5 — Rodar o instalador

Dentro do servidor, cole os dois comandos:

```
curl -fsSL https://raw.githubusercontent.com/matheusmagah-cpu/us-marketplace-affiliate-lab/feat/coleta-pneus/coleta-pneus/deploy/instalar.sh -o instalar.sh
bash instalar.sh
```

- Demora de 5 a 15 minutos. Não feche a janela.
- Se pedir confirmação de algo, aperte Enter.
- Se o primeiro comando der **404**, o repositório está privado. Nesse caso, ou eu deixo o repositório público no GitHub (Settings > Change visibility), ou faço o `git clone` com um token do GitHub.

No final aparece **"Instalação concluída."** com o endereço do painel, no formato `https://150-230-10-20.sslip.io`. **Anote esse endereço.**

**Verificação:** rodar `claude --version` e `node -v` mostra versões (o Node deve começar com `v24`).

## ETAPA 6 — Gerar o token do Claude (assinatura)

Precisa de assinatura **Claude Pro ou Max**. No servidor:

```
claude setup-token
```

1. Ele mostra um **link**. Abra esse link no navegador do computador ou do celular.
2. Entre com a conta do Claude e autorize.
3. Copie o código que aparecer e cole de volta no servidor (clique com o botão direito no PowerShell para colar). Enter.
4. Ele mostra um token comprido que começa com `sk-ant-oat01-`. **Copie esse token** e guarde-o só até a próxima etapa. **Não cole no ChatGPT.**

**Verificação:** tenho o token copiado.

## ETAPA 7 — Preencher a configuração (.env)

No servidor:

```
nano /opt/coleta/coleta-pneus/.env
```

Mova com as setas do teclado e preencha **depois do `=`**, sem espaços e sem aspas.

| Campo | O que colocar | Exemplo |
|---|---|---|
| `EMPRESA_NOME` | Nome que aparece nas mensagens | `Recicla Pneus VR` |
| `OFERTA_REMOLD` | Oferta do remold com **preço de verdade** | `pneus remold aro 13 a 15, a partir de R$ 180, entrega na região` |
| `INICIO_CAMPANHA` | Dia do 1º envio real (AAAA-MM-DD). Coloque **2 ou 3 dias à frente** para dar tempo de conferir o mapeamento | `2026-11-02` |
| `DONO_WHATSAPP` | **Meu número pessoal**, que recebe a rota e os avisos. Formato 55 + DDD + número, só números. **Diferente** do número da empresa | `5524999998888` |
| `MOTORISTA_WHATSAPP` | Opcional: número do motorista | `5524988887777` |
| `ATENDENTE` | Deixe `claude-code` | `claude-code` |
| `CLAUDE_CODE_OAUTH_TOKEN` | O token da etapa 6 | `sk-ant-oat01-…` |
| `PAINEL_USUARIO` | Pode deixar `dono` | `dono` |

**Não mexa** em `EMPRESA_LAT`, `EMPRESA_LNG`, `PAINEL_SENHA` e `MCP_TOKEN`. A senha e o token já foram gerados.

Para salvar: **Ctrl+O**, Enter, **Ctrl+X**.

Para ver a senha do painel (anote num lugar seguro, não no ChatGPT):

```
grep PAINEL_ /opt/coleta/coleta-pneus/.env
```

**Verificação:** o comando abaixo mostra os campos preenchidos. Ele não mostra os segredos, então pode me mandar a saída.

```
grep -E "^(EMPRESA_NOME|OFERTA_REMOLD|INICIO_CAMPANHA|DONO_WHATSAPP|ATENDENTE)=" /opt/coleta/coleta-pneus/.env
```

## ETAPA 8 — Ligar o robô

```
sudo systemctl start coleta-pneus
sudo systemctl status coleta-pneus --no-pager
```

**Verificação:**
- O status mostra **active (running)** em verde.
- Nos logs (`journalctl -u coleta-pneus -n 30 --no-pager`) aparecem "Painel e MCP em http://127.0.0.1:3000" e "Robô da coleta rodando (atendente: claude-code)".
- Se aparecer **"Preencha no arquivo .env antes de ligar o robô: …"**, volte na etapa 7 e preencha os campos que ele citar, depois rode `sudo systemctl restart coleta-pneus`.

## ETAPA 9 — Conectar o WhatsApp Business (QR code)

1. No navegador, abra o endereço da etapa 5 (`https://…sslip.io`) e entre com `PAINEL_USUARIO` e `PAINEL_SENHA`.
2. Clique no menu **WhatsApp**. Aparece um QR code (ele se renova sozinho).
3. No celular com o **WhatsApp Business da empresa**: ⋮ ou Configurações > **Dispositivos conectados** > **Conectar dispositivo** > leia o QR.

**Verificação:**
- A página do WhatsApp no painel mostra **conectado**.
- No celular aparece um dispositivo novo em "Dispositivos conectados".
- **Não desconecte esse dispositivo pelo celular**, senão precisa ler o QR de novo.

## ETAPA 10 — Mapear as borracharias

Primeiro uma cidade pequena, para conferir. Os comandos abaixo continuam rodando mesmo se eu fechar a janela:

```
cd /opt/coleta/coleta-pneus
nohup npm run mapear -- --headless --cidade "Quatis" > mapeamento.log 2>&1 &
tail -f mapeamento.log
```

Para sair do acompanhamento: **Ctrl+C**. O mapeamento continua rodando.

Quando terminar, abra o painel > **Contatos** e confira uns 5 nomes de Quatis no Google Maps. Se estiver certo, mapeie todas as cidades (demora algumas horas, trabalha devagar de propósito):

```
cd /opt/coleta/coleta-pneus
nohup npm run mapear -- --headless > mapeamento.log 2>&1 &
```

**Verificação:**
- No painel aparecem contatos de várias cidades.
- O robô confere sozinho quais têm WhatsApp: os números sem WhatsApp vão para o filtro "Sem WhatsApp" e **não recebem mensagem**.

## ETAPA 11 — Primeiro dia de envios

- Os envios começam sozinhos na data de `INICIO_CAMPANHA`:
  - só de segunda a sexta, das 8h30 às 17h30, e sábado, das 8h30 às 12h;
  - 20 mensagens no primeiro dia, com 3 a 9 minutos entre elas.
- Acompanhe com:

```
journalctl -u coleta-pneus -f
```

- Responda **pelo celular** quem você quiser: o robô fica 12 h sem responder aquele contato.
- Para parar tudo na hora: botão vermelho **Pausar envios** no painel.

**Verificação:** no primeiro dia, abra 3 conversas no painel e confira se as mensagens e as respostas fazem sentido.

## ETAPA 12 (opcional) — Conectar o Claude ao sistema para análises (MCP)

No meu computador, com o Claude Code instalado, rode o comando abaixo. Troque o endereço e o token: o token é o `MCP_TOKEN` do `.env`, que você vê no servidor com `grep MCP_TOKEN /opt/coleta/coleta-pneus/.env`.

```
claude mcp add --transport http coleta https://MEU-ENDERECO.sslip.io/mcp --header "Authorization: Bearer MEU_MCP_TOKEN"
```

Depois é só perguntar ao Claude: "como está o funil?", "quem respondeu?", "monta a rota de amanhã".

---

## Comandos do dia a dia

| Para quê | Comando |
|---|---|
| Ver o robô trabalhando | `journalctl -u coleta-pneus -f` |
| Reiniciar | `sudo systemctl restart coleta-pneus` |
| Parar | `sudo systemctl stop coleta-pneus` |
| Atualizar para a versão nova do GitHub | `bash /opt/coleta/coleta-pneus/deploy/atualizar.sh` |
| Cópia de segurança (banco + sessão do WhatsApp) | `tar czf ~/backup-coleta-$(date +%F).tgz -C /opt/coleta/coleta-pneus dados .env` |

**Nunca** coloque a pasta `dados` nem o arquivo `.env` no GitHub ou no ChatGPT.

## Problemas comuns

| Sintoma | Causa provável | O que fazer |
|---|---|---|
| Painel não abre / erro de certificado | Portas 80/443 fechadas | Refaça a etapa 3; depois `sudo systemctl restart caddy` |
| `Faltam no .env: …` ou `Preencha no arquivo .env…` | Campo vazio ou com valor de exemplo | Etapa 7, depois `sudo systemctl restart coleta-pneus` |
| Logs mostram "CLAUDE_CODE_OAUTH_TOKEN vazio" ou "O atendimento automático não respondeu" | Token ausente, errado ou vencido | Refaça a etapa 6, cole o token novo no `.env` e reinicie |
| QR não aparece no painel | Robô desligado ou reiniciando | `sudo systemctl status coleta-pneus` e `journalctl -u coleta-pneus -n 50 --no-pager` |
| WhatsApp desconectou e pede QR de novo | O dispositivo foi removido no celular | Etapa 9 |
| "3 falhas seguidas… PAUSADOS" no meu WhatsApp | Problema no número ou na conexão | Confira o WhatsApp no celular e depois clique em **Retomar** no painel |
| Ninguém recebe mensagem | Ainda não chegou a `INICIO_CAMPANHA`, está fora do horário, ou não há contatos com WhatsApp | Confira a data, o horário e o painel |
| Mapeamento parou | A janela foi fechada sem o `nohup` | Rode de novo com o comando da etapa 10 (os já mapeados não duplicam) |

## Cuidados que você deve me lembrar

- A conexão do WhatsApp não é oficial: existe risco de bloqueio do número. **Não aumente os limites de envio no começo.**
- As respostas usam o limite da minha assinatura do Claude.
- O mapeamento lê o Google Maps automaticamente, o que vai contra os termos do Google. O volume é baixo, mas o risco existe.

Comece pela **ETAPA 1** e espere eu dizer "feito".
