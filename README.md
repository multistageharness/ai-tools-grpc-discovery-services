# ai-tools-grpc-discovery-services

A polyglot example of a **gRPC tool-discovery service** — an MCP-style
"what tools do you have?" endpoint — implemented three times over the **same
`.proto` contract**: in **Node ESM (`mjs/`)**, **TypeScript (`ts/`)**, and
**Python (`py/`)**.

Each language ships **both** a server and a discovery client, and because gRPC
is cross-language, **any client can talk to any server**. Start the Python
server, discover it from the TypeScript client — it just works.

## Why not `fetch`?

You **cannot** use native Node `fetch` to talk to a standard gRPC server.
Unlike a JSON-over-HTTP/1.1 API, gRPC relies on **HTTP/2 streams** and **binary
Protocol Buffers** — a dialect `fetch` doesn't speak. So the Node clients here
use the real modules:

- **`@grpc/grpc-js`** — the pure-JS network client/server.
- **`@grpc/proto-loader`** — parses the `.proto` contract at runtime.

Python mirrors this with **`grpcio`** + **`grpcio-tools`**, using
`grpc.protos()` / `grpc.services()` to compile the contract in-memory (no
committed `*_pb2.py` stubs).

## The contract — [`packages/proto/tools.proto`](packages/proto/tools.proto)

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

All three servers load [`packages/proto/tools.sample.json`](packages/proto/tools.sample.json)
and return the **identical** tool list (`echo`, `add`, `get_time`), so you can
prove interop by mixing languages.

## Layout

Each language lives in its own package under `packages/*` with an **entry file**,
a **Makefile** (`install` / `run` for CI), and a **README**:

```
packages/
├── proto/   # the contract — tools.proto (entry) + tools.sample.json + Makefile (validate)
├── mjs/      # Node ESM   — index.mjs (entry) · server.mjs · discover.mjs · Makefile
├── ts/       # TypeScript — src/index.ts (entry) · server.ts · discover.ts · Makefile (tsx)
└── py/       # Python     — main.py (entry) · server.py · discover.py · Makefile
Makefile      # root orchestrator — delegates into each package
```

Every package Makefile exposes the same verbs: `make install`, `make run`
(self-contained server→discover round-trip, used by CI), and `make ci`.

## Quick start

Install once per language (or `make install`):

```bash
make install          # mjs (npm), ts (npm), py (venv + pip -e .)
```

One-shot round-trip per language (boots a server, discovers, tears down):

```bash
make run-mjs          # or: run-ts / run-py
```

Or run a server in one terminal and a client in another — **mix languages**:

```bash
# terminal 1 — start ONE server
make server-mjs       # or: server-ts / server-py

# terminal 2 — discover from ANY client
make discover-py      # or: discover-mjs / discover-ts
```

Expected client output:

```
Connecting to gRPC server at localhost:50051...
✅ Discovered Tools:
[
  { "name": "echo",     "description": "Echoes back the provided message verbatim.", "input_schema": "..." },
  { "name": "add",      "description": "Adds two numbers and returns the sum.",       "input_schema": "..." },
  { "name": "get_time", "description": "Returns the current server time in ISO 8601.","input_schema": "..." }
]
```

Override the address with env vars: `GRPC_HOST` (server bind) and `GRPC_TARGET`
(client dial).

## "Blind" discovery (no `.proto`)

These clients know the contract because they load `tools.proto`. Querying a
**completely unknown** server ("what methods do you have?") instead requires
**gRPC Server Reflection**. `@grpc/grpc-js` ships a reflection *server* but no
built-in reflection *client* — you'd add a community package such as
`grpc-js-reflection-client` (Node) or use `grpcurl` / `grpc.reflection`
(Python). That's a separate mechanism from the contract-driven discovery shown
here.
