.PHONY: test lint help

help:
	@echo "Available targets:"
	@echo "  make test  - Run tests"
	@echo "  make lint  - Run linter"

test:
	@npm run test

lint:
	@npm run lint
