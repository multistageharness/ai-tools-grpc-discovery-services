# py package — Python gRPC DiscoveryService (dynamic .proto loading).
PORT ?= 50051
BOOT_WAIT ?= 2
VENV ?= .venv
PY := $(VENV)/bin/python
PIP := $(VENV)/bin/pip

.PHONY: install run server discover ci clean

install:
	python3 -m venv --clear $(VENV)
	$(PIP) install -q --upgrade pip
	$(PIP) install -e .

# Self-contained round-trip: boot server, discover, tear down. Doubles as CI.
run:
	@$(PY) main.py server & SRV=$$!; \
	sleep $(BOOT_WAIT); \
	$(PY) main.py discover; STATUS=$$?; \
	kill $$SRV 2>/dev/null || true; \
	lsof -ti tcp:$(PORT) | xargs kill 2>/dev/null || true; \
	exit $$STATUS

server:
	$(PY) main.py server

discover:
	$(PY) main.py discover

ci: install run

clean:
	rm -rf $(VENV) *.egg-info __pycache__
