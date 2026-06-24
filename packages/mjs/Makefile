# mjs package — Node ESM gRPC DiscoveryService.
PORT ?= 50051
BOOT_WAIT ?= 2

.PHONY: install run server discover ci clean

install:
	npm install --no-fund --no-audit

# Self-contained round-trip: boot server, discover, tear down. Doubles as CI.
run:
	@node index.mjs server & SRV=$$!; \
	sleep $(BOOT_WAIT); \
	node index.mjs discover; STATUS=$$?; \
	kill $$SRV 2>/dev/null || true; \
	lsof -ti tcp:$(PORT) | xargs kill 2>/dev/null || true; \
	exit $$STATUS

server:
	node index.mjs server

discover:
	node index.mjs discover

ci: install run

clean:
	rm -rf node_modules
