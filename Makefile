# Root orchestrator — delegates to each package's own Makefile.
# All servers bind 0.0.0.0:50051; all clients dial localhost:50051, so any
# client can talk to any server (start one server, run any discover target).

PKGS := proto mjs ts py

.PHONY: install ci validate \
        server-mjs server-ts server-py \
        discover-mjs discover-ts discover-py \
        run-mjs run-ts run-py clean

install:
	$(MAKE) -C packages/mjs install
	$(MAKE) -C packages/ts install
	$(MAKE) -C packages/py install

# Validate contract + install + round-trip each package.
ci: validate run-mjs run-ts run-py

validate:
	$(MAKE) -C packages/proto validate

# --- self-contained round-trips (boot server, discover, tear down) ---
run-mjs:
	$(MAKE) -C packages/mjs ci
run-ts:
	$(MAKE) -C packages/ts ci
run-py:
	$(MAKE) -C packages/py ci

# --- servers (run in one terminal) ---
server-mjs:
	$(MAKE) -C packages/mjs server
server-ts:
	$(MAKE) -C packages/ts server
server-py:
	$(MAKE) -C packages/py server

# --- clients (run in another terminal) ---
discover-mjs:
	$(MAKE) -C packages/mjs discover
discover-ts:
	$(MAKE) -C packages/ts discover
discover-py:
	$(MAKE) -C packages/py discover

clean:
	for p in mjs ts py; do $(MAKE) -C packages/$$p clean; done
	find . -name __pycache__ -type d -prune -exec rm -rf {} +
