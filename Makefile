COMPOSE = docker compose -f ./docker-compose.yml
SERVICES = nginx nginx_exporter vault grafana prometheus redis redis_exporter postgres postgres_exporter

all: clean build up
	@echo "Transcendence started!"

build:
	@echo "Building images..."
	$(COMPOSE) build

up:
	@echo "Upping all the containers..."
	$(COMPOSE) up -d

down:
	@echo "Stopping and removing containers..."
	$(COMPOSE) down

clean:
	@echo "Cleaning Docker..."
	$(COMPOSE) down
	docker system prune -f

fclean:
	@echo "Full cleaning Docker..."
	-docker stop $$(docker ps -qa)
	-docker rm $$(docker ps -qa)
	-docker rmi -f $$(docker images -qa)
	-docker volume rm $$(docker volume ls -q)
	-docker network rm $$(docker network ls -q) 2>/dev/null
	$(COMPOSE) down -v

logs:
	@echo "Check specific service logs (ex: make logs SERVICE=backend)"
	$(COMPOSE) logs -f $(SERVICE)

exec:
	@echo "Entering on the container (ex: make exec SERVICE=backend)"
	$(COMPOSE) exec $(SERVICE) sh

re: clean build up
	@echo "Restarting all the containers..."

.PHONY: all build up down clean fclean logs exec re