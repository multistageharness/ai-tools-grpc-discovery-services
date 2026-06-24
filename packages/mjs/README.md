# `mjs` package — Node ESM gRPC discovery

A gRPC `DiscoveryService` **server + client** in pure Node ESM, using
[`@grpc/grpc-js`](https://www.npmjs.com/package/@grpc/grpc-js) (HTTP/2 +
protobuf transport) and [`@grpc/proto-loader`](https://www.npmjs.com/package/@grpc/proto-loader)
(runtime `.proto` parsing). Native `fetch` cannot speak gRPC — that's the whole
reason these modules exist.

## Files

| File | Role |
|------|------|
| `index.mjs` | **entry point** — `node index.mjs <server\|discover>` |
| `proto.mjs` | loads `../proto/tools.proto` at runtime, exports the `DiscoveryService` descriptor |
| `server.mjs` | serves the tool list from `../proto/tools.sample.json` |
| `discover.mjs` | connects and calls `GetAvailableTools` |

## Make targets

| Target | What it does |
|--------|--------------|
| `make install` | `npm install` |
| `make run` | boot server, run the client, tear down (self-contained; used by CI) |
| `make server` | run only the server (foreground) |
| `make discover` | run only the client |
| `make ci` | `install` + `run` |

```bash
make install
make run          # one-shot round-trip
# or, two terminals:
make server
make discover
```

Env: `GRPC_HOST` (server bind, default `0.0.0.0:50051`), `GRPC_TARGET` (client
dial, default `localhost:50051`).
