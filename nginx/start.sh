#!/bin/bash

# Cria a pasta caso ela não exista
mkdir -p nginx/certs

# Gera o certificado e a chave privada dentro da pasta correta
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/certs/localhost.key \
  -out nginx/certs/localhost.crt \
  -subj "/C=PT/ST=Lisboa/L=Lisboa/O=Transcendence/CN=localhost"