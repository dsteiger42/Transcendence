# 1. Guardar secrets
vault kv put secret/postgres user="${POSTGRES_USER}" password="${POSTGRES_PASSWORD}"
vault kv put secret/redis password="${REDIS_PASSWORD}"

# 2. Carregar a policy
vault policy write backend-policy /etc/vault/config/backend-policy.hcl

# 3. Ativar AppRole (idempotente — não falha se já existir)
vault auth enable approle || true

# 4. Criar a role com TTLs definidos
vault write auth/approle/role/backend-role \
  token_policies="backend-policy" \
  token_ttl=1h \
  token_max_ttl=4h \
  secret_id_ttl=24h

# 5. Obter o RoleID (fixo)
vault read auth/approle/role/backend-role/role-id

# 6. Gerar o SecretID (sensível, expira em 24h)
vault write -f auth/approle/role/backend-role/secret-id