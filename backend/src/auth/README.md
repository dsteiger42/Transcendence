# Authentication Module - Transcendence Backend

## Overview

This module implements user management and authentication for the Transcendence backend.

The authentication system uses:

- NestJS
- Prisma ORM
- PostgreSQL
- JWT (JSON Web Token)
- Passport
- bcrypt password hashing

The objective is to allow users to register, authenticate, and access protected API routes using JWT tokens.

---

# Features

## User Management

Implemented:

- Create users
- List users
- Store user data in PostgreSQL
- Validate incoming data using DTOs
- Hash passwords before storing them

User fields:

```json
{
  "id": 1,
  "username": "pedro",
  "email": "pedro@test.com",
  "password": "$2b$10$...",
  "wallet": 10000,
  "avatar": null,
  "wins": 0,
  "losses": 0,
  "createdAt": "2026-07-18T14:15:50.101Z",
  "updatedAt": "2026-07-18T14:15:50.101Z"
}
````

---

# Authentication Flow

The authentication process works as follows:

```
Register User
      |
      v
Password Hashing (bcrypt)
      |
      v
Save User in PostgreSQL


Login
      |
      v
Find User by Email
      |
      v
Compare Password Hash
      |
      v
Generate JWT Token
      |
      v
Access Protected Routes
```

---

# Dependencies

Installed packages:

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
```

Development dependencies:

```bash
npm install -D @types/passport-jwt @types/bcrypt
```

---

# Project Structure

```
src
├── auth
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   └── jwt-auth-guard.ts
│
├── users
│   ├── users.controller.ts
│   ├── users.module.ts
│   ├── users.service.ts
│   └── create-user.dto.ts
│
├── prisma
│   ├── prisma.module.ts
│   └── prisma.service.ts
│
└── main.ts
```

---

# API Endpoints

## Create User

### Request

```
POST /users
```

Example:

```bash
curl -X POST http://localhost:8000/users \
-H "Content-Type: application/json" \
-d '{
  "username":"pedro",
  "email":"pedro@test.com",
  "password":"12345678",
  "wallet":10000
}'
```

Response:

```json
{
  "id":4,
  "username":"pedro",
  "email":"pedro@test.com",
  "wallet":10000
}
```

The password is stored encrypted using bcrypt.

---

# Login

## Request

```
POST /auth/login
```

Example:

```bash
curl -X POST http://localhost:8000/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email":"pedro@test.com",
  "password":"12345678"
}'
```

Response:

```json
{
  "access_token":"eyJhbGciOiJIUzI1Ni..."
}
```

The token must be used to access protected routes.

---

# Protected Routes

Routes protected by JWT require:

```
Authorization: Bearer <TOKEN>
```

Example:

```bash
curl -X GET http://localhost:8000/users \
-H "Authorization: Bearer eyJhbGciOiJIUzI1Ni..."
```

Without a token:

Response:

```json
{
  "message":"Unauthorized",
  "statusCode":401
}
```

---

# JWT Guard

Protected controllers use:

```typescript
@UseGuards(JwtAuthGuard)
@Get()
findAll() {
  return this.usersService.findAll();
}
```

The guard verifies:

1. JWT exists
2. Signature is valid
3. Token is not expired

---

# Password Security

Passwords are never stored in plain text.

Before saving:

```typescript
const hash = await bcrypt.hash(password, 10);
```

During login:

```typescript
bcrypt.compare(password, hash)
```

Example:

Original:

```
12345678
```

Stored:

```
$2b$10$dH2XGNhLh3knvnz0YtFMf...
```

---

# Docker

The backend runs inside Docker:

```
backend
 |
 |-- NestJS
 |
 |-- Prisma
 |
 |-- PostgreSQL
```

Build:

```bash
docker compose build backend
```

Start:

```bash
docker compose up -d
```

Check logs:

```bash
docker logs backend
```

---

# Environment Variables

Current authentication configuration:

```env
DATABASE_URL=postgresql://user:pass@postgres:5432/appdb

JWT_SECRET=secret123
JWT_EXPIRES=1h
```

> In production, JWT secrets should be stored in Vault instead of `.env`.

---

# Testing Authentication

## 1. Create account

```bash
POST /users
```

## 2. Login

```bash
POST /auth/login
```

Copy:

```
access_token
```

## 3. Access protected routes

```bash
GET /users
Authorization: Bearer TOKEN
```

---

# Future Improvements

Planned:

* Move JWT secret to Hashicorp Vault
* Refresh tokens
* Logout / token invalidation
* Role based authorization
* Two-factor authentication
* Hide password field from API responses
* Add email verification

```
