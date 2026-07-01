# Variáveis
NODE_BIN = ./backend/node_modules/.bin
NPM = npm --prefix backend
DOCKER_COMPOSE = docker compose

.PHONY: all install build dev clean up down re logs

# Comando padrão (compila o projeto localmente)
all: build

# Instala as dependências do projeto localmente
install:
	@echo "Instalando dependências locais..."
	$(NPM) install

# Compila o projeto TypeScript localmente
build: clean
	@echo "Compilando o projeto..."
	$(NPM) run build

# Executa o projeto em modo de desenvolvimento local (sem Docker)
dev:
	@echo "Iniciando localmente em modo de desenvolvimento..."
	$(NPM) run start:dev

# Limpa a pasta de distribuição (dist)
clean:
	@echo "Limpando a pasta dist..."
	@if [ -d "backend/dist" ]; then \
		rm -rf backend/dist 2>/dev/null || sudo rm -rf backend/dist; \
	fi

# ==========================================
# COMANDOS DOCKER COMPOSE
# ==========================================

# Constrói as imagens e sobe os contentores em background (-d)
up:
	@echo "Subindo o ambiente Docker (Backend + Nginx)..."
	$(DOCKER_COMPOSE) up --build -d

# Derruba os contentores e remove os volumes órfãos
down:
	@echo "Parando e removendo contentores..."
	$(DOCKER_COMPOSE) down

# Reinicia os contentores do Docker
re:
	@echo "Reiniciando os serviços..."
	$(DOCKER_COMPOSE) restart

# Mostra os logs dos contentores em tempo real (Ctrl+C para sair)
logs:
	$(DOCKER_COMPOSE) logs -f