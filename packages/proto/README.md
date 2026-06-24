# `proto` package — the contract

The single source-of-truth for the whole repo. Every language package loads
these files **at runtime**; nothing here is generated or committed as stubs.

## Entry file — [`tools.proto`](tools.proto)

Defines the `api.DiscoveryService`:

```proto
service DiscoveryService {
  rpc GetAvailableTools (EmptyRequest) returns (ToolListResponse);
}

message Tool {
  string name = 1;
  string description = 2;
  string input_schema = 3;   // JSON Schema (MCP `inputSchema`)
}
message ToolListResponse { repeated Tool tools = 1; }
```

## Fixture — [`tools.sample.json`](tools.sample.json)

The shared tool list every server returns (`echo`, `add`, `get_time`), so all
three language servers answer **identically** and interop is provable.

## Makefile

| Target | What it does |
|--------|--------------|
| `make install` | no-op (nothing to install) |
| `make validate` / `make run` | parse-check `tools.proto` via `buf`, `protoc`, or `grpc_tools` (whichever exists; skips gracefully if none) |
| `make ci` | alias for `validate` |

Field names stay snake_case (`input_schema`) on the wire; the JS loaders use
`keepCase: true` so all three languages agree.
