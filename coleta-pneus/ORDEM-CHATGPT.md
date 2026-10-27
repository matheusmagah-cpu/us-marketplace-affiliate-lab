# ORDEM — Colocar no ar a Coleta de Pneus, 100% na nuvem

> Copie tudo daqui para baixo e cole no ChatGPT.

---

Você vai me guiar, **um passo de cada vez**, para colocar no ar um sistema que **já está pronto**. Eu não sou programador. **Tudo vai ser feito na nuvem, pelo navegador.** Não vou instalar nada no meu computador, não vou usar PowerShell nem terminal do Windows, e não vou guardar nenhum arquivo no computador. Serve qualquer navegador: computador, tablet ou celular.

## Regras para você (ChatGPT)

1. **Não crie, não reescreva e não "melhore" nenhum código.** O sistema já está pronto e testado no GitHub. O seu trabalho é me guiar na instalação, na configuração e no uso.
2. **Nada no computador local.** Todo comando é digitado no **Cloud Shell da Oracle**, um terminal que abre dentro do navegador, e de lá dentro do servidor. Nunca me mande baixar programa, salvar arquivo, abrir PowerShell, CMD ou terminal do Windows ou Mac.
3. **Um passo por vez.** Diga exatamente onde clicar ou o que colar e o que eu devo ver na tela. Espere eu responder "feito" (ou colar o que apareceu) antes de seguir.
4. **Comandos exatamente como estão aqui.** Não troque nomes de pastas, arquivos ou variáveis. Não invente opções.
5. **Nunca me peça senhas, tokens ou chaves.** Não peça o token do Claude, o `MCP_TOKEN`, a `PAINEL_SENHA`, o endereço secreto do conector nem chaves SSH. Esses valores ficam só no servidor. Se eu colar algum deles por engano, me avise para trocar.
6. **Se der erro**, peça para eu colar a mensagem (sem segredos) e consulte a seção "Problemas comuns" antes de sugerir outra coisa.
7. **No fim de cada etapa**, faça a verificação indicada antes de seguir.
8. **Fale em português simples.**

## Só eu posso fazer (avise quando chegar a hora)

- Criar a conta da Oracle, com cartão e verificação.
- Autorizar o Claude com a minha conta (etapa 6).
- Ler o QR code com o celular do WhatsApp Business (etapa 9).

Todo o resto você me guia, sempre pela nuvem.

## O que é o sistema (para você entender)

- O código está no GitHub, repositório `matheusmagah-cpu/us-marketplace-affiliate-lab`, branch `feat/coleta-pneus`, pasta `coleta-pneus`.
- Ele roda num servidor **grátis da Oracle Cloud** (Ubuntu 24.04), ligado 24 horas.
- Funções:
  - mapeia borracharias e auto centers de 14 cidades vizinhas de Volta Redonda-RJ (o próprio servidor acessa a internet);
  - manda mensagem pelo **WhatsApp Business do dono** (conexão não oficial, por QR code);
  - responde as borracharias usando o **Claude Code com a assinatura do dono**;
  - agenda as coletas (R$1,50 por pneu);
  - manda a rota do dia seguinte às 17h no WhatsApp do dono;
  - tem um **painel web** com login e um **conector para o Claude** (claude.ai), para eu acompanhar tudo pelo navegador ou pelo app do Claude no celular.
- Um instalador automático (`deploy/instalar.sh`) instala tudo no servidor: Node.js 24, Claude Code, navegador para o mapeamento, HTTPS grátis em `IP.sslip.io`, firewall e o serviço `coleta-pneus`.
- Configuração: `/opt/coleta/coleta-pneus/.env`.
- Logs: `journalctl -u coleta-pneus -f`.

## Como colar no Cloud Shell

- Colar: **Ctrl+Shift+V**, ou botão direito > Colar. No celular, toque e segure.
- Copiar: selecione o texto com o mouse e use **Ctrl+Shift+C**.
- Se o Cloud Shell fechar ou cair, é só abrir de novo (ícone `>_`) e rodar `ssh ubuntu@MEU_IP` para voltar ao servidor. O robô continua rodando.

---

## ETAPA 1 — Criar a conta da Oracle Cloud

1. Acesse https://www.oracle.com/cloud/free/ e clique em **Start for free**.
2. Preencha os dados. O cartão é só para verificação; o plano **Always Free** não cobra.
3. **Home Region:** escolha **Brazil East (Sao Paulo)**. Ela não pode ser trocada depois.
4. Espere o e-mail de conta ativa e entre em https://cloud.oracle.com.

**Verificação:** vejo o painel da Oracle com o menu ☰ no canto superior esquerdo.

## ETAPA 2 — Criar a chave de acesso (no Cloud Shell) e o servidor

**2.1 — Chave de acesso, criada na própria nuvem**

1. No topo do painel da Oracle, clique no ícone **`>_` (Cloud Shell)**. Um terminal abre na parte de baixo da página. Espere ficar pronto.
2. Cole este comando e aperte Enter:

```
ssh-keygen -t ed25519 -N "" -f ~/.ssh/id_ed25519 && cat ~/.ssh/id_ed25519.pub
```

3. Aparece uma linha que começa com `ssh-ed25519 …`. Copie a linha inteira. Essa é a chave **pública**: ela pode ser colada na Oracle e não é segredo.

A chave fica guardada no Cloud Shell, na nuvem. Não baixe nada.

**2.2 — Servidor**

1. Menu ☰ > **Compute** > **Instances** > **Create instance**.
2. **Name:** `coleta-pneus`.
3. **Image and shape** > **Edit**:
   - **Change image** > **Canonical Ubuntu** > **24.04** (não a "Minimal") > Select.
   - **Change shape** > **Ampere** > **VM.Standard.A1.Flex** > **2 OCPUs** e **12 GB** > Select.
4. **Networking:** deixe criar a rede nova e marque **Assign a public IPv4 address**.
5. **Add SSH keys:** escolha **Paste public keys** e cole a linha `ssh-ed25519 …` do passo 2.1.
6. Clique em **Create** e espere ficar **RUNNING** (verde).
7. Anote o **Public IP address** (exemplo: `150.230.10.20`).

Se aparecer **"Out of capacity"**:
- tente outro **Availability Domain** ou mais tarde; ou
- use **VM.Standard.E2.1.Micro** (AMD, também grátis). Ele é mais fraco, mas o instalador cria memória extra.

**Verificação:** a instância está RUNNING e tenho o IP anotado.

## ETAPA 3 — Abrir as portas do site (80 e 443)

1. Na página da instância, em **Primary VNIC**, clique no link da **Subnet**.
2. Clique na **Security List** (Default Security List…).
3. **Add Ingress Rules** e preencha:
   - Source CIDR: `0.0.0.0/0`
   - IP Protocol: `TCP`
   - Destination Port Range: `80,443`
4. Salve.

**Verificação:** aparece uma regra com as portas 80,443.

## ETAPA 4 — Entrar no servidor pelo Cloud Shell

No Cloud Shell (ícone `>_`), troque `MEU_IP` pelo IP anotado:

```
ssh ubuntu@MEU_IP
```

Se perguntar `Are you sure you want to continue connecting`, digite `yes` e Enter.

**Verificação:** a linha mudou para algo como `ubuntu@coleta-pneus:~$`.

## ETAPA 5 — Rodar o instalador

1. Confira no GitHub, pelo navegador, se o repositório está **público**: em `github.com/matheusmagah-cpu/us-marketplace-affiliate-lab`, o nome deve mostrar "Public". Se estiver "Private": **Settings** > lá embaixo **Change visibility** > **Public**.
2. No servidor (Cloud Shell), cole os dois comandos:

```
curl -fsSL https://raw.githubusercontent.com/matheusmagah-cpu/us-marketplace-affiliate-lab/feat/coleta-pneus/coleta-pneus/deploy/instalar.sh -o instalar.sh
bash instalar.sh
```

- Demora de 5 a 15 minutos. Se pedir confirmação, aperte Enter.
- Se o Cloud Shell cair no meio, volte ao servidor (etapa 4) e rode `bash instalar.sh` de novo. Ele continua de onde parou.
- No final aparece **"Instalação concluída."** com:
  - o **endereço do painel** (`https://150-230-10-20.sslip.io`): anote;
  - o **endereço do conector do Claude** (`…/mcp/…`): é **secreto**, não cole no ChatGPT. Vamos usar na etapa 12.

**Verificação:** `node -v` mostra uma versão que começa com `v24`, e `claude --version` mostra uma versão.

## ETAPA 6 — Autorizar o Claude (assinatura Pro ou Max)

No servidor:

```
claude setup-token
```

1. Ele mostra um **link**. Copie e abra numa **nova aba** do navegador (ou no celular).
2. Entre com a conta do Claude e autorize.
3. Copie o código que aparecer e cole de volta no Cloud Shell. Enter.
4. Ele mostra um token comprido que começa com `sk-ant-oat01-`. Copie e use só na próxima etapa. **Não cole no ChatGPT.**

**Verificação:** estou com o token copiado.

## ETAPA 7 — Preencher a configuração (.env)

No servidor:

```
nano /opt/coleta/coleta-pneus/.env
```

Mova com as setas e preencha **depois do `=`**, sem espaços e sem aspas:

| Campo | O que colocar | Exemplo |
|---|---|---|
| `EMPRESA_NOME` | Nome que aparece nas mensagens | `Recicla Pneus VR` |
| `OFERTA_REMOLD` | Oferta do remold com **preço de verdade** | `pneus remold aro 13 a 15, a partir de R$ 180, entrega na região` |
| `INICIO_CAMPANHA` | Dia do 1º envio real (AAAA-MM-DD), **2 ou 3 dias à frente** para dar tempo de conferir o mapeamento | `2026-11-02` |
| `DONO_WHATSAPP` | **Meu número pessoal**, que recebe a rota e os avisos: 55 + DDD + número, só números. **Diferente** do número da empresa | `5524999998888` |
| `MOTORISTA_WHATSAPP` | Opcional: número do motorista | `5524988887777` |
| `ATENDENTE` | Deixe `claude-code` | `claude-code` |
| `CLAUDE_CODE_OAUTH_TOKEN` | Token da etapa 6 | `sk-ant-oat01-…` |
| `PAINEL_USUARIO` | Pode deixar `dono` | `dono` |

**Não mexa** em `EMPRESA_LAT`, `EMPRESA_LNG`, `PAINEL_SENHA` e `MCP_TOKEN`.

Salvar: **Ctrl+O**, Enter, **Ctrl+X**.

Ver a senha do painel (guarde no gerenciador de senhas do navegador, não no ChatGPT):

```
grep PAINEL_ /opt/coleta/coleta-pneus/.env
```

**Verificação:** a saída deste comando pode me ser mandada, porque não mostra segredos:

```
grep -E "^(EMPRESA_NOME|OFERTA_REMOLD|INICIO_CAMPANHA|DONO_WHATSAPP|ATENDENTE)=" /opt/coleta/coleta-pneus/.env
```

## ETAPA 8 — Ligar o robô

```
sudo systemctl start coleta-pneus
sudo systemctl status coleta-pneus --no-pager
```

**Verificação:**
- Aparece **active (running)**.
- Em `journalctl -u coleta-pneus -n 30 --no-pager` aparecem "Painel e MCP em http://127.0.0.1:3000" e "Robô da coleta rodando (atendente: claude-code)".
- Se aparecer **"Preencha no arquivo .env antes de ligar o robô: …"**, volte à etapa 7, corrija os campos citados e rode `sudo systemctl restart coleta-pneus`.

O robô liga sozinho sempre que o servidor reiniciar.

## ETAPA 9 — Conectar o WhatsApp Business (QR code)

1. Abra o endereço do painel (`https://…sslip.io`) num navegador e entre com `PAINEL_USUARIO` e `PAINEL_SENHA`.
2. Menu **WhatsApp**: aparece um QR code, que se renova sozinho.
3. No celular do **WhatsApp Business da empresa**: Configurações > **Dispositivos conectados** > **Conectar dispositivo** > aponte para o QR.

O QR precisa estar numa tela **diferente** do celular que vai ler: computador, tablet ou outro celular.

**Verificação:**
- O painel mostra **Conectado ✅**.
- **Nunca remova esse dispositivo pelo celular**, senão precisa ler o QR de novo.

## ETAPA 10 — Mapear as borracharias (o servidor faz sozinho)

Primeiro uma cidade pequena, para conferir. O mapeamento continua rodando no servidor mesmo se eu fechar o navegador:

```
cd /opt/coleta/coleta-pneus
nohup npm run mapear -- --headless --cidade "Quatis" > mapeamento.log 2>&1 &
tail -f mapeamento.log
```

Para parar de acompanhar: **Ctrl+C**. O mapeamento continua.

Quando terminar, abra o painel > **Contatos** e confira 5 nomes de Quatis. Se estiver certo, mapeie todas as cidades (algumas horas):

```
cd /opt/coleta/coleta-pneus
nohup npm run mapear -- --headless > mapeamento.log 2>&1 &
```

Depois disso o robô **remapeia sozinho toda segunda-feira**.

**Verificação:**
- Aparecem contatos de várias cidades no painel.
- Os números sem WhatsApp vão para o filtro "Sem WhatsApp" e não recebem mensagem.

## ETAPA 11 — Cópia de segurança automática (no próprio servidor)

Cole no servidor. Isso cria uma cópia diária às 3h (banco + sessão do WhatsApp + configuração) e mantém as últimas 14:

```
mkdir -p ~/backups && (crontab -l 2>/dev/null; echo '0 3 * * * tar czf ~/backups/coleta-$(date +\%F).tgz -C /opt/coleta/coleta-pneus dados .env && ls -1t ~/backups/coleta-*.tgz | tail -n +15 | xargs -r rm') | crontab -
```

**Verificação:** `crontab -l` mostra a linha. No dia seguinte, `ls ~/backups` mostra um arquivo.

## ETAPA 12 — Acompanhar tudo pelo Claude (navegador ou app do celular)

1. No servidor, mostre o endereço secreto do conector:

```
echo "https://$(grep -m1 -o '[0-9-]*\.sslip\.io' /etc/caddy/Caddyfile)/mcp/$(grep ^MCP_TOKEN= /opt/coleta/coleta-pneus/.env | cut -d= -f2)"
```

2. Copie o endereço (**não cole no ChatGPT**).
3. Em https://claude.ai: **Configurações** > **Conectores** > **Adicionar conector personalizado**.
   - Nome: `Coleta de Pneus`
   - URL: o endereço copiado
   - Salve.
4. Numa conversa nova no claude.ai (ou no app do Claude no celular), ative o conector "Coleta de Pneus" no menu de ferramentas e pergunte:
   - "como está o funil?"
   - "quem respondeu hoje?"
   - "quem não respondeu há 2 dias?"
   - "lê a conversa com a Borracharia X"
   - "monta a rota de amanhã"
   - "pausa os envios"

**Verificação:** o Claude responde com os números reais do painel.

---

## Dia a dia (tudo pelo navegador)

| Para quê | Onde / comando |
|---|---|
| Ver contatos, conversas, coletas e rotas | Painel `https://…sslip.io` |
| Pausar ou retomar envios | Botão **Pausar envios** / **Retomar envios** no painel, ou pedir ao Claude |
| Perguntar qualquer coisa | claude.ai ou app do Claude, com o conector |
| Ver o robô trabalhando | Cloud Shell > `ssh ubuntu@MEU_IP` > `journalctl -u coleta-pneus -f` |
| Reiniciar | `sudo systemctl restart coleta-pneus` |
| Atualizar para a versão nova do GitHub | `bash /opt/coleta/coleta-pneus/deploy/atualizar.sh` |

**Nunca** coloque a pasta `dados`, o arquivo `.env` ou o endereço do conector no GitHub ou no ChatGPT.

## Problemas comuns

| Sintoma | Causa provável | O que fazer |
|---|---|---|
| `ssh: connect … timed out` | IP errado ou instância parada | Confira o IP e se a instância está RUNNING |
| `Permission denied (publickey)` | A chave colada na etapa 2 não é a deste Cloud Shell | Na instância: **Edit** > adicione de novo a chave do `cat ~/.ssh/id_ed25519.pub`; ou crie a instância de novo |
| Painel não abre / erro de certificado | Portas 80/443 fechadas | Refaça a etapa 3 e rode `sudo systemctl restart caddy` |
| `404` no curl da etapa 5 | Repositório privado | Deixe público (etapa 5, item 1) |
| `Faltam no .env` / `Preencha no arquivo .env` | Campo vazio ou com exemplo | Etapa 7 e reiniciar |
| "CLAUDE_CODE_OAUTH_TOKEN vazio" ou "O atendimento automático não respondeu" | Token ausente, errado ou vencido | Refaça a etapa 6, troque no `.env` e reinicie |
| QR não aparece | Robô desligado | `sudo systemctl status coleta-pneus` e `journalctl -u coleta-pneus -n 50 --no-pager` |
| Pede QR de novo | O dispositivo foi removido no celular | Etapa 9 |
| "3 falhas seguidas… PAUSADOS" no meu WhatsApp | Problema no número ou na conexão | Confira o WhatsApp no celular e clique em **Retomar envios** |
| Ninguém recebe mensagem | Ainda não chegou a `INICIO_CAMPANHA`, está fora do horário (seg–sex 8h30–17h30, sáb 8h30–12h) ou não há contatos com WhatsApp | Confira |
| Conector do Claude dá erro | Endereço copiado errado ou robô desligado | Rode de novo o comando da etapa 12 e confira se o painel abre |

## Cuidados que você deve me lembrar

- A conexão do WhatsApp não é oficial: existe risco de bloqueio do número. **Não aumente os limites de envio no começo.**
- As respostas usam o limite da minha assinatura do Claude.
- O mapeamento lê o Google Maps automaticamente, o que vai contra os termos do Google. O volume é baixo, mas o risco existe.
- O endereço do conector dá acesso às conversas: trate-o como uma senha.

Comece pela **ETAPA 1** e espere eu dizer "feito".
