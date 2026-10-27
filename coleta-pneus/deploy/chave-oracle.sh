#!/usr/bin/env bash
# Roda no Cloud Shell da Oracle. Cria a chave de acesso à API (para o Claude criar o servidor)
# e a chave SSH, cadastra a chave da API no seu usuário e mostra as variáveis para colar
# nas configurações do ambiente do Claude. Não baixa nada para o seu computador.
set -euo pipefail
mkdir -p ~/.oci ~/.ssh
test -f ~/.oci/coleta.pem || openssl genrsa -out ~/.oci/coleta.pem 2048 2>/dev/null
chmod 600 ~/.oci/coleta.pem
openssl rsa -pubout -in ~/.oci/coleta.pem -out ~/.oci/coleta_pub.pem 2>/dev/null
test -f ~/.ssh/id_ed25519 || ssh-keygen -q -t ed25519 -N "" -f ~/.ssh/id_ed25519

USUARIO="${OCI_CS_USER_OCID:-}"
TENANCY="${OCI_TENANCY:-}"
REGIAO="${OCI_REGION:-sa-saopaulo-1}"
if [ -z "$USUARIO" ] || [ -z "$TENANCY" ]; then
  echo "Não achei seu usuário/tenancy no Cloud Shell. Avise o Claude."; exit 1
fi
DIGITAL=$(openssl rsa -pubout -outform DER -in ~/.oci/coleta.pem 2>/dev/null | openssl md5 -c | awk '{print $NF}')
if oci iam user api-key list --user-id "$USUARIO" --query "data[].fingerprint" --raw-output 2>/dev/null | grep -q "$DIGITAL"; then
  echo "Chave da API já estava cadastrada."
else
  oci iam user api-key upload --user-id "$USUARIO" --key-file ~/.oci/coleta_pub.pem >/dev/null
  echo "Chave da API cadastrada no seu usuário."
fi

cat <<FIM

=====  COPIE AS 6 LINHAS ABAIXO (são segredos: não cole no chat)  =====
OCI_USER=$USUARIO
OCI_TENANCY=$TENANCY
OCI_REGION=$REGIAO
OCI_FINGERPRINT=$DIGITAL
OCI_SSH_PUBKEY=$(cat ~/.ssh/id_ed25519.pub)
OCI_KEY=$(base64 -w0 ~/.oci/coleta.pem)
=====================================================================
FIM
