#!/usr/bin/env bash
# Baixa a versão mais nova do GitHub e reinicia o robô.  Uso: bash deploy/atualizar.sh
set -euo pipefail
cd /opt/coleta
git pull --ff-only
cd coleta-pneus
PUPPETEER_SKIP_DOWNLOAD=1 npm ci --omit=dev
npx playwright install chromium
sudo systemctl restart coleta-pneus
echo "Atualizado. Logs: journalctl -u coleta-pneus -f"
