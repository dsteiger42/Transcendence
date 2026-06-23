# Variáveis
NODE_BIN = ./backend/node_modules/.bin
NPM = npm --prefix backend

.PHONY: all install build dev clean

# Comando padrão (compila o projeto)
all: build

# Instala as dependências do projeto
install:
	@echo "Instalando dependências..."
	$(NPM) install

# Compila o projeto TypeScript
build: clean
	@echo "Compilando o projeto..."
	$(NPM) run build

# Executa o projeto em modo de desenvolvimento (com watch/reload)
dev:
	@echo "Iniciando em modo de desenvolvimento..."
	$(NPM) run start:dev

# Limpa a pasta de distribuição (dist)
clean:
	@echo "Limpando a pasta dist..."
	@if [ -d "backend/dist" ]; then \
		rm -rf backend/dist 2>/dev/null || sudo rm -rf backend/dist; \
	fi