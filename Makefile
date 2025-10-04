
.PHONY: up down test topics
up:
	docker compose up -d

down:
	docker compose down -v

test:
	@echo "Run tests in each service"

topics:
	bash infra/kafka/create_topics.sh
