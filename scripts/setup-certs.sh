#!/bin/bash
set -e

# Instalar mkcert se não existir
if ! command -v mkcert &>/dev/null; then
    echo "[*] Installing mkcert..."
    sudo apt install -y libnss3-tools
    curl -Lo /tmp/mkcert https://github.com/FiloSottile/mkcert/releases/latest/download/mkcert-v1.4.4-linux-amd64
    chmod +x /tmp/mkcert
    sudo mv /tmp/mkcert /usr/local/bin/mkcert
fi

# Instalar CA local
mkcert -install

# Gerar certs
mkdir -p nginx/certs
cd nginx/certs
mkcert localhost 127.0.0.1 ::1

mv localhost+2.pem nginx.cert
mv localhost+2-key.pem nginx.key

echo "[+] Certs generated at nginx/certs/"