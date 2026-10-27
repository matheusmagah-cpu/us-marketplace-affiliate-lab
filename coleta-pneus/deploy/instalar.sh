#!/usr/bin/env bash
# Instala o sistema num servidor Ubuntu da Oracle Cloud (Always Free, ARM ou AMD).
# Uso (no servidor):  bash instalar.sh
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive

REPO="${REPO:-https://github.com/matheusmagah-cpu/us-marketplace-affiliate-lab.git}"
BRANCH="${BRANCH:-feat/coleta-pneus}"
DESTINO=/opt/coleta
APP="$DESTINO/coleta-pneus"

echo "==> Atualizando o sistema e instalando ferramentas"
sudo -E apt-get update -y
sudo -E apt-get install -y curl git ca-certificates gnupg debian-keyring debian-archive-keyring apt-transport-https iptables-persistent

echo "==> Node.js 24"
if ! command -v node >/dev/null || [[ "$(node -v)" != v24* ]]; then
  curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
  sudo -E apt-get install -y nodejs
fi

echo "==> Claude Code (atendente do WhatsApp, usa a sua assinatura)"
sudo npm install -g @anthropic-ai/claude-code

echo "==> Memória extra (swap de 4 GB) para o navegador do mapeamento"
if ! swapon --show | grep -q /swapfile; then
  sudo fallocate -l 4G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
fi

echo "==> Código do GitHub"
sudo mkdir -p "$DESTINO" && sudo chown "$USER":"$USER" "$DESTINO"
if [ -d "$DESTINO/.git" ]; then
  git -C "$DESTINO" fetch origin "$BRANCH" && git -C "$DESTINO" checkout "$BRANCH" && git -C "$DESTINO" pull --ff-only origin "$BRANCH"
else
  git clone --branch "$BRANCH" "$REPO" "$DESTINO"
fi

echo "==> Dependências e navegador"
cd "$APP"
PUPPETEER_SKIP_DOWNLOAD=1 npm ci --omit=dev
sudo npx playwright install-deps chromium
npx playwright install chromium

echo "==> Arquivo de configuração (.env)"
if [ ! -f .env ]; then
  cp .env.exemplo .env
  sed -i "s/^MCP_TOKEN=.*/MCP_TOKEN=$(openssl rand -hex 24)/" .env
  sed -i "s/^PAINEL_SENHA=.*/PAINEL_SENHA=$(openssl rand -base64 12 | tr -d '\/+=')/" .env
  chmod 600 .env
fi

echo "==> Liberando as portas 80 e 443 no firewall do servidor"
for porta in 80 443; do
  sudo iptables -C INPUT -p tcp --dport "$porta" -j ACCEPT 2>/dev/null || sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport "$porta" -j ACCEPT
done
sudo netfilter-persistent save

echo "==> Caddy (HTTPS automático)"
if ! command -v caddy >/dev/null; then
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
  sudo -E apt-get update -y && sudo -E apt-get install -y caddy
fi
IP=$(curl -fsS https://api.ipify.org)
DOMINIO="${IP//./-}.sslip.io"
sed "s/DOMINIO/$DOMINIO/" deploy/Caddyfile.modelo | sudo tee /etc/caddy/Caddyfile >/dev/null
sudo systemctl reload caddy || sudo systemctl restart caddy

echo "==> Serviço do robô"
sed "s/^User=.*/User=$USER/" deploy/coleta-pneus.service | sudo tee /etc/systemd/system/coleta-pneus.service >/dev/null
sudo systemctl daemon-reload
sudo systemctl enable coleta-pneus

cat <<FIM

Instalação concluída.

1) Gere o token do Claude (abre um link para entrar com a sua conta):   claude setup-token
2) Edite o arquivo de configuração:   nano $APP/.env
   (nome da empresa, seu WhatsApp, oferta de remold e o token do passo 1 em CLAUDE_CODE_OAUTH_TOKEN)
3) Ligue o robô:                       sudo systemctl start coleta-pneus
4) Abra o painel:                      https://$DOMINIO
   Usuário e senha estão no .env (PAINEL_USUARIO / PAINEL_SENHA).
5) No painel, menu "WhatsApp": leia o QR code com o WhatsApp Business da empresa.

Conector do Claude (claude.ai > Configurações > Conectores):  https://$DOMINIO/mcp/$(grep ^MCP_TOKEN= .env | cut -d= -f2)
(esse endereço é secreto: quem tiver ele lê as conversas)
Ver o que o robô está fazendo:  journalctl -u coleta-pneus -f
FIM
