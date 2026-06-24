# `ts` package — TypeScript gRPC discovery

The same gRPC `DiscoveryService` **server + client** as the `mjs` package, in
TypeScript. The dynamic proto loader is untyped by nature, so `src/proto.ts`
declares the contract shapes and casts the loaded descriptor to them — the rest
of the code is fully typed. Run directly with [`tsx`](https://www.npmjs.com/package/tsx);
type-check with `tsc`.

## Files

| File | Role |
|------|------|
| `src/index.ts` | **entry point** — `tsx src/index.ts <server\|discover>` |
| `src/proto.ts` | loads `../../proto/tools.proto`, declares `Tool` / `ToolListResponse` |
| `src/server.ts` | serves the tool list from `../../proto/tools.sample.json` |
| `src/discover.ts` | connects and calls `GetAvailableTools` (Promise-wrapped) |

## Make targets

| Target | What it does |
|--------|--------------|
| `make install` | `npm install` |
| `make typecheck` | `tsc --noEmit` |
| `make run` | boot server, run the client, tear down (self-contained; used by CI) |
| `make server` / `make discover` | run one half (foreground) |
| `make ci` | `install` + `typecheck` + `run` |

```bash
make install
make ci           # typecheck + round-trip
```

Env: `GRPC_HOST` (server bind, default `0.0.0.0:50051`), `GRPC_TARGET` (client
dial, default `localhost:50051`).
