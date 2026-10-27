# ORDEM — ChatGPT (modo Agente) coloca no ar a Coleta de Pneus, 100% na nuvem

> **Antes de colar:** no ChatGPT, abra uma conversa nova e ligue o **modo Agente**. Ele fica no botão **+** ou em **Ferramentas** > **Agente** (planos Plus, Pro ou Team). Prefira acompanhar pelo **computador**: na etapa 9 você vai ler, com o celular, um QR code que aparece na tela do agente.
>
> Depois copie tudo daqui para baixo e cole.

---

Você está em **modo Agente**, com navegador e terminal próprios. **Faça você mesmo, do começo ao fim**, a instalação de um sistema que **já está pronto** no GitHub. Tudo acontece na nuvem: no seu navegador, no Console da Oracle, no Cloud Shell da Oracle e no servidor. Eu só entro quando você me chamar para assumir o controle.

## Regras

1. **Execute, não me ensine.** Clique, digite e rode os comandos você mesmo. Só me peça algo nos momentos da lista "Quando me chamar".
2. **Não crie, não reescreva e não "melhore" nenhum código.** Use exatamente o repositório, o instalador e os comandos desta ordem. Não troque nomes de pastas, arquivos ou variáveis.
3. **Segredos:** token do Claude, `MCP_TOKEN`, `PAINEL_SENHA`, o endereço do conector (`…/mcp/…`) e chaves SSH.
   - Você pode copiar e colar esses valores entre as telas quando a ordem mandar.
   - **Nunca escreva nenhum deles no chat**, nem em resumo, nem parcialmente.
   - Quando eu precisar deles, me peça para olhar na tela.
4. **Nada no meu computador.** Não baixe arquivos e não me peça para instalar nada.
5. **Antes de cada etapa**, diga em uma linha o que vai fazer. **Depois**, faça a verificação indicada e me diga em uma linha se passou.
6. **Se der erro**, tente o que está em "Problemas comuns". Se não resolver em 2 tentativas, pare e me mostre o erro, sem segredos.
7. **Não pule etapas** e não siga para a próxima com uma verificação falhando.
8. Fale em português simples.

## Quando me chamar (assumir o controle)

- **Etapa 1:** captcha, link de verificação do e-mail, senha, endereço, telefone/SMS, cartão e login da Oracle.
- **Etapa 5, só se for preciso:** entrar no GitHub para deixar o repositório público.
- **Etapa 6:** entrar na minha conta do Claude e autorizar.
- **Etapa 7:** confirmar com você os dados da empresa. Pergunte em **uma** mensagem só:
  - nome da empresa;
  - meu WhatsApp pessoal;
  - WhatsApp do motorista (opcional);
  - texto e preço do remold;
  - data de início dos envios.
- **Etapa 9:** ler o QR code com o celular do WhatsApp Business.
- **Etapa 12:** entrar no claude.ai, se pedir login.

Em qualquer tela de login, senha, cartão, código por SMS/e-mail ou captcha, **pare e me peça para assumir**. Nunca invente nem tente adivinhar dados meus.

## O que é o sistema

- **Código:** GitHub `matheusmagah-cpu/us-marketplace-affiliate-lab`, branch `feat/coleta-pneus`, pasta `coleta-pneus`.
- **Onde roda:** um servidor grátis da Oracle Cloud (Ubuntu 24.04), ligado 24 h.
- **O que faz:**
  - mapeia borracharias de 14 cidades vizinhas de Volta Redonda-RJ;
  - manda mensagem pelo WhatsApp Business do dono (QR code);
  - responde as borracharias usando o Claude Code com a assinatura do dono;
  - agenda as coletas (R$1,50 por pneu) e manda a rota diária às 17h;
  - tem um painel web com login e um conector MCP para o claude.ai.
- **Instalador:** `deploy/instalar.sh` instala tudo. Configuração em `/opt/coleta/coleta-pneus/.env`. Logs com `journalctl -u coleta-pneus -f`.

---

## ETAPA 1 — Conta da Oracle Cloud (você conduz, eu só assumo nos dados pessoais)

O cadastro acontece **no seu navegador** (o do agente), não no meu. Se eu tiver começado um cadastro no meu Chrome, ignore: comece do zero no seu.

1. Abra https://signup.cloud.oracle.com.
2. Preencha:
   - **País/Território:** Brasil
   - **Nome Próprio:** Matheus
   - **Apelido:** Magalhaes
   - **Email:** me pergunte qual usar.
3. **Captcha "Sou humano":** se aparecer desafio, **me chame para assumir**.
4. Clique em **Confirmar o meu endereço de email**.
5. **Me chame para assumir.** Diga: "Abra seu e-mail, copie o link de verificação da Oracle e cole na barra de endereço do meu navegador". Eu assumo, colo o link e te devolvo o controle.
6. Na tela seguinte, preencha você:
   - **Cloud Account Name:** `coletapneus` (se estiver em uso, `coletapneusvr`, depois `coletapneus2`). Escreva o nome que ficou no chat, porque ele não é segredo e eu preciso dele para fazer login.
   - **Home Region:** **Brazil East (Sao Paulo)**. Confira duas vezes: não dá para trocar depois.
7. **Senha:** **me chame para assumir.** Eu digito a senha; você nunca a vê nem escreve.
8. **Endereço, telefone e código SMS:** **me chame para assumir.**
9. **Cartão (verificação, cerca de US$ 1, devolvido; o Always Free não cobra):** **me chame para assumir.**
10. Aceite os termos e clique em **Iniciar o meu teste gratuito / Start my free trial**.
11. Espere a tela "Sua conta está sendo provisionada". Pode levar de minutos a algumas horas.
    - A cada 5 minutos, tente entrar em https://cloud.oracle.com com o Cloud Account Name. Na tela de login, **me chame para assumir** (senha).
    - Se demorar mais de 30 minutos, me avise e pare. Eu volto quando chegar o e-mail "Your account is ready".
12. Se a Oracle **recusar o cadastro** (comum com cartão pré-pago ou virtual), pare e me diga a mensagem exata. Não tente de novo com outros dados.

**Verificação:** o Console da Oracle está aberto (menu ☰ no canto superior esquerdo) e a região no topo é **Brazil East (Sao Paulo)**.

## ETAPA 2 — Chave de acesso (no Cloud Shell) e servidor

**2.1 — Chave.** No topo do Console, abra o **Cloud Shell** (ícone `>_`) e rode:

```
test -f ~/.ssh/id_ed25519 || ssh-keygen -t ed25519 -N "" -f ~/.ssh/id_ed25519; cat ~/.ssh/id_ed25519.pub
```

Copie a linha `ssh-ed25519 …`. Ela é pública: pode colar na Oracle.

**2.2 — Servidor.** Menu ☰ > **Compute** > **Instances** > **Create instance**:

- **Name:** `coleta-pneus`.
- **Image:** Canonical Ubuntu **24.04** (não a Minimal).
- **Shape:** Ampere **VM.Standard.A1.Flex**, **2 OCPUs**, **12 GB**.
- **Networking:** criar VCN e subnet públicas novas e marcar **Assign a public IPv4 address**.
- **Add SSH keys:** **Paste public keys** e cole a linha da 2.1.
- **Create.** Espere ficar **RUNNING** e anote o **Public IP address** (o IP não é segredo).

Se aparecer **"Out of capacity"**, tente nesta ordem:
1. outro **Availability Domain**;
2. **1 OCPU / 6 GB**;
3. **VM.Standard.E2.1.Micro** (AMD, grátis).

Me avise qual foi usado.

**Verificação:** a instância está RUNNING e o IP está anotado.

## ETAPA 3 — Portas 80 e 443

Na página da instância: **Primary VNIC** > link da **Subnet** > **Security List** padrão > **Add Ingress Rules**:

- Source CIDR: `0.0.0.0/0`
- Protocol: `TCP`
- Destination Port Range: `80,443`

Salve.

**Verificação:** a regra 80,443 aparece na lista.

## ETAPA 4 — Entrar no servidor

No Cloud Shell, troque `IP` pelo IP anotado:

```
ssh -o StrictHostKeyChecking=accept-new ubuntu@IP
```

**Verificação:** o prompt mostra `ubuntu@coleta-pneus`. Se der timeout, espere 1–2 minutos (o servidor pode estar iniciando) e tente de novo.

## ETAPA 5 — Instalar

No servidor:

```
curl -fsSL https://raw.githubusercontent.com/matheusmagah-cpu/us-marketplace-affiliate-lab/feat/coleta-pneus/coleta-pneus/deploy/instalar.sh -o instalar.sh && bash instalar.sh
```

- Se o curl der **404**, o repositório está privado. Abra https://github.com/matheusmagah-cpu/us-marketplace-affiliate-lab/settings, **me chame para fazer o login** e mude em **Danger Zone** > **Change visibility** > **Public**. Depois rode o comando de novo.
- O instalador leva de 5 a 15 minutos. Se o Cloud Shell cair, volte (etapa 4) e rode `bash instalar.sh` de novo; ele continua de onde parou.
- No final aparece "Instalação concluída." com o endereço do painel (`https://IP-com-traços.sslip.io`): anote. O endereço do conector que aparece junto é **segredo**: não escreva no chat.

**Verificação:** `node -v` começa com `v24` e `claude --version` mostra uma versão.

## ETAPA 6 — Token do Claude (assinatura Pro/Max)

No servidor:

```
claude setup-token
```

1. Copie o link que ele mostra e abra numa nova aba do seu navegador.
2. **Me chame para assumir:** eu entro na minha conta do Claude e autorizo.
3. Copie o código que aparecer e cole no Cloud Shell. Enter.
4. Ele mostra um token que começa com `sk-ant-oat01-`. **Copie e guarde só para a etapa 7. Não escreva no chat.**

**Verificação:** o token está copiado.

## ETAPA 7 — Configuração

Me pergunte, numa única mensagem, os dados abaixo. Depois rode no servidor os comandos, trocando só os valores entre aspas (o token você cola direto da etapa 6):

```
cd /opt/coleta/coleta-pneus
definir() { sed -i "/^$1=/d" .env; printf '%s=%s\n' "$1" "$2" >> .env; }
definir EMPRESA_NOME "NOME DA EMPRESA"
definir DONO_WHATSAPP "55DDNUMERO"
definir MOTORISTA_WHATSAPP ""
definir OFERTA_REMOLD "pneus remold aro 13 a 15, a partir de R\$ 180, entrega na região"
definir INICIO_CAMPANHA "AAAA-MM-DD"
definir ATENDENTE "claude-code"
definir CLAUDE_CODE_OAUTH_TOKEN "COLE_AQUI_O_TOKEN"
chmod 600 .env
```

Regras dos valores:
- **Telefones:** 55 + DDD + número, só dígitos (ex.: `5524999998888`). `DONO_WHATSAPP` é o número **pessoal**, diferente do número da empresa.
- **`INICIO_CAMPANHA`:** se eu não disser, use **3 dias à frente**, para dar tempo de conferir o mapeamento.
- **`OFERTA_REMOLD`:** precisa ter preço de verdade. Escreva `R\$` com a barra.
- Não mexa em `EMPRESA_LAT`, `EMPRESA_LNG`, `PAINEL_SENHA` e `MCP_TOKEN`.

**Verificação:** rode o comando abaixo (ele não mostra segredos) e me mostre a saída:

```
grep -E "^(EMPRESA_NOME|OFERTA_REMOLD|INICIO_CAMPANHA|DONO_WHATSAPP|MOTORISTA_WHATSAPP|ATENDENTE)=" .env; grep -c "^CLAUDE_CODE_OAUTH_TOKEN=sk-ant-" .env
```

O último número tem que ser `1`.

## ETAPA 8 — Ligar o robô

```
sudo systemctl restart coleta-pneus && sleep 10 && journalctl -u coleta-pneus -n 30 --no-pager
```

**Verificação:**
- `systemctl is-active coleta-pneus` mostra `active`.
- Os logs mostram "Robô da coleta rodando (atendente: claude-code)".
- Se aparecer "Preencha no arquivo .env…", corrija os campos citados (etapa 7) e repita.

## ETAPA 9 — WhatsApp (QR code)

1. Pegue a senha do painel no servidor com `grep ^PAINEL_SENHA= /opt/coleta/coleta-pneus/.env`. Não escreva no chat.
2. No seu navegador, abra o endereço do painel. Usuário `dono`, a senha do passo 1.
3. Clique no menu **WhatsApp**. Quando o QR aparecer, **me chame**: "Leia o QR com o celular do WhatsApp Business: Configurações > Dispositivos conectados > Conectar dispositivo".
4. Mantenha a página aberta. O QR se renova sozinho.

**Verificação:** a página mostra **Conectado ✅**.

## ETAPA 10 — Mapeamento

No servidor:

```
cd /opt/coleta/coleta-pneus && nohup npm run mapear -- --headless --cidade "Quatis" > mapeamento.log 2>&1 &
```

1. Acompanhe com `tail -n 20 mapeamento.log` de vez em quando, até terminar.
2. Abra o painel > **Contatos**, confira 5 nomes de Quatis numa busca no Google Maps e me diga o resultado.
3. Se estiver certo, rode todas as cidades (leva horas e continua rodando sozinho):

```
cd /opt/coleta/coleta-pneus && nohup npm run mapear -- --headless > mapeamento.log 2>&1 &
```

**Verificação:** o painel tem contatos de Quatis, e o log da rodada completa mostra o progresso das cidades.

## ETAPA 11 — Backup automático no servidor

```
mkdir -p ~/backups && (crontab -l 2>/dev/null | grep -v coleta-; echo '0 3 * * * tar czf ~/backups/coleta-$(date +\%F).tgz -C /opt/coleta/coleta-pneus dados .env && ls -1t ~/backups/coleta-*.tgz | tail -n +15 | xargs -r rm') | crontab -
```

**Verificação:** `crontab -l` mostra a linha.

## ETAPA 12 — Conector no claude.ai

1. No servidor, gere o endereço (**segredo**, não escreva no chat):

```
echo "https://$(grep -m1 -o '[0-9-]*\.sslip\.io' /etc/caddy/Caddyfile)/mcp/$(grep ^MCP_TOKEN= /opt/coleta/coleta-pneus/.env | cut -d= -f2)"
```

2. Abra https://claude.ai. Se pedir login, **me chame**.
3. Vá em **Configurações** > **Conectores** > **Adicionar conector personalizado**. Nome: `Coleta de Pneus`. URL: cole o endereço. Salve.
4. Numa conversa nova do claude.ai, ative o conector e pergunte "como está o funil?".

**Verificação:** o Claude responde com números do sistema.

## ETAPA FINAL — Relatório para mim (sem segredos)

Me entregue:
- o formato do servidor usado e o IP;
- o endereço do **painel**;
- a data de início dos envios;
- quantos contatos foram mapeados até agora;
- o status do WhatsApp;
- se o conector do claude.ai funcionou;
- onde ver a senha do painel: no servidor, `grep PAINEL_ /opt/coleta/coleta-pneus/.env`.

---

## Problemas comuns

| Sintoma | O que fazer |
|---|---|
| `Permission denied (publickey)` | A chave da instância não é a deste Cloud Shell. Na instância, adicione a chave do `cat ~/.ssh/id_ed25519.pub`, ou recrie a instância com ela |
| SSH com timeout | Confira o IP e se está RUNNING; espere 2 min |
| Painel não abre / erro de certificado | Confira a regra 80,443 (etapa 3); rode `sudo systemctl restart caddy` e espere 1 min |
| curl 404 | Repositório privado (etapa 5) |
| "Faltam no .env" / "Preencha no arquivo .env" | Etapa 7 e depois a etapa 8 |
| "CLAUDE_CODE_OAUTH_TOKEN vazio" / "atendimento automático não respondeu" | Refaça a etapa 6, depois a 7 (só o token) e a 8 |
| QR não aparece | `journalctl -u coleta-pneus -n 50 --no-pager` |
| Instalação parou no meio | Rode `bash instalar.sh` de novo |
| Conector do claude.ai com erro | Gere o endereço de novo (etapa 12) e confira se o painel abre |

## Lembre-me no final

- O WhatsApp não é oficial: existe risco de bloqueio. **Não aumentar os limites no começo.**
- As respostas usam o limite da minha assinatura do Claude.
- O mapeamento automatizado do Google Maps vai contra os termos do Google.
- O endereço do conector e a senha do painel são segredos. Como você, agente, viu esses valores na tela, me sugira trocar a senha do painel depois. É só editar `PAINEL_SENHA` no `.env` e reiniciar.

## Comece assim

1. Na sua **primeira** mensagem, me pergunte tudo de uma vez:
   - o e-mail para a conta da Oracle;
   - os dados da etapa 7 (nome da empresa, meu WhatsApp, WhatsApp do motorista, oferta do remold com preço, data de início).

   Assim você não precisa parar depois.
2. Em seguida, comece a **ETAPA 1** sem esperar mais nada.
