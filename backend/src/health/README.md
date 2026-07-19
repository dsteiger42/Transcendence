# Backend Health Check

## Objetivo

O endpoint `/health` permite verificar se o backend NestJS e as suas dependências principais estão operacionais.

Este endpoint é utilizado pelo Docker Compose através de um `healthcheck` para garantir que os serviços dependentes (como Nginx e frontend) apenas arrancam quando o backend estiver realmente pronto.

---

# Endpoint

## GET `/health`

### Descrição

Verifica:

- Estado do backend NestJS
- Ligação ao PostgreSQL através do Prisma

Futuramente pode ser expandido para verificar outros serviços como:

- Redis
- Vault
- Outros serviços externos

---

# Respostas

## 200 OK

Quando todas as dependências estão disponíveis:

```json
{
  "status": "ok",
  "database": "up"
}