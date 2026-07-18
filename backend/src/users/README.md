# Backend API - Transcendence

## Introdução

Este documento explica como o frontend deve comunicar com o backend da aplicação Transcendence.

O backend está desenvolvido em **NestJS** e expõe uma API REST.

URL base em desenvolvimento:

```
http://localhost:8000
```

Quando estiver através do Nginx:

```
https://localhost/api
```

---

# Users

## Criar um novo utilizador

### Endpoint

```
POST /users
```

### Headers

```http
Content-Type: application/json
```

### Body

Enviar um objeto JSON com os dados do utilizador:

```json
{
  "username": "pedro",
  "email": "pedro@test.com",
  "password": "12345678"
}
```

### Exemplo usando JavaScript (fetch)

```javascript
fetch("http://localhost:8000/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    username: "pedro",
    email: "pedro@test.com",
    password: "12345678"
  })
})
.then(response => response.json())
.then(data => {
  console.log(data);
});
```

### Resposta esperada

```json
{
  "id": 1,
  "username": "pedro",
  "email": "pedro@test.com"
}
```

---

# Listar utilizadores

## Endpoint

```
GET /users
```

### Exemplo

```javascript
fetch("http://localhost:8000/users")
.then(response => response.json())
.then(users => {
  console.log(users);
});
```

### Resposta

```json
[
  {
    "id": 1,
    "username": "pedro",
    "email": "pedro@test.com"
  }
]
```

---

# Validação dos dados

O backend valida automaticamente os campos enviados.

## Username

Obrigatório:

```json
{
  "username": "pedro"
}
```

---

## Email

Tem de ser um email válido:

Aceite:

```json
{
  "email": "pedro@test.com"
}
```

Rejeitado:

```json
{
  "email": "pedro"
}
```

---

## Password

Mínimo:

```
8 caracteres
```

Exemplo válido:

```json
{
  "password": "12345678"
}
```

---

# Erros possíveis

## 400 Bad Request

Dados inválidos.

Exemplo:

```json
{
  "message": [
    "email must be an email",
    "password must be longer than or equal to 8 characters"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

---

## 404 Not Found

Endpoint inexistente.

Exemplo:

```json
{
  "message": "Cannot GET /teste",
  "error": "Not Found",
  "statusCode": 404
}
```

---

# Estrutura de comunicação recomendada no frontend

Criar um ficheiro para centralizar chamadas API:

Exemplo:

```
src/
 └── api/
     └── users.js
```

Conteúdo:

```javascript
const API_URL = "http://localhost:8000";

export async function createUser(user) {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  });

  return response.json();
}


export async function getUsers() {
  const response = await fetch(`${API_URL}/users`);

  return response.json();
}
```

Depois no React:

```javascript
import { createUser } from "./api/users";

async function register() {
  const user = await createUser({
    username: "pedro",
    email: "pedro@test.com",
    password: "12345678"
  });

  console.log(user);
}
```

---

# Fluxo de Registo

O frontend deve:

1. Mostrar formulário:

   * Username
   * Email
   * Password

2. Validar campos no frontend.

3. Fazer:

```
POST /users
```

4. Guardar a resposta.

5. Redirecionar o utilizador para a página inicial/login.

---

# Portas Docker

| Serviço    | Porta |
| ---------- | ----: |
| Frontend   |  3000 |
| Backend    |  8000 |
| PostgreSQL |  5432 |
| Redis      |  6379 |
| Grafana    |  3001 |
| Prometheus |  9090 |

---

# Estado atual da API

Disponível:

✅ Criar utilizador
✅ Listar utilizadores
✅ Validação DTO

A implementar:

⬜ Login
⬜ JWT Authentication
⬜ Password hashing
⬜ Base de dados PostgreSQL
⬜ Perfil de utilizador
⬜ Avatar
⬜ Estatísticas de jogo
