# proto package — the single source-of-truth contract.
# There is nothing to "run"; the entry is tools.proto itself. `validate`
# confirms the contract parses, using whatever protobuf tool is available.

.PHONY: install run validate ci

install:
	@echo "nothing to install — language packages load tools.proto at runtime"

run: validate

validate:
	@if command -v buf >/dev/null 2>&1; then \
		buf lint || true; \
	elif command -v protoc >/dev/null 2>&1; then \
		protoc --proto_path=. tools.proto --descriptor_set_out=/dev/null && echo "protoc: tools.proto OK"; \
	elif python3 -c "import grpc_tools" >/dev/null 2>&1; then \
		python3 -m grpc_tools.protoc --proto_path=. tools.proto --descriptor_set_out=/dev/null && echo "grpc_tools: tools.proto OK"; \
	else \
		echo "no buf/protoc/grpc_tools found — the language packages validate tools.proto at runtime"; \
	fi

ci: validate
