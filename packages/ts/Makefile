# ts package — TypeScript gRPC DiscoveryService (run via tsx).
PORT ?= 50051
BOOT_WAIT ?= 3

.PHONY: install run server discover typecheck ci clean

install:
	npm install --no-fund --no-audit

# Self-contained round-trip: boot server, discover, tear down. Doubles as CI.
run:
	@npx tsx src/index.ts server & SRV=$$!; \
	sleep $(BOOT_WAIT); \
	npx tsx src/index.ts discover; STATUS=$$?; \
	kill $$SRV 2>/dev/null || true; \
	lsof -ti tcp:$(PORT) | xargs kill 2>/dev/null || true; \
	exit $$STATUS

server:
	npm run server

discover:
	npm run discover

typecheck:
	npm run typecheck

ci: install typecheck run

clean:
	rm -rf node_modules dist
