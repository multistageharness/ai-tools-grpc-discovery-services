# `py` package — Python gRPC discovery

The same gRPC `DiscoveryService` **server + client** as the JS packages, in
Python. It uses [`grpcio`](https://pypi.org/project/grpcio/) +
[`grpcio-tools`](https://pypi.org/project/grpcio-tools/) and loads the contract
**at runtime** via `grpc.protos()` / `grpc.services()` — the direct analogue of
`@grpc/proto-loader`, so there are **no committed `*_pb2.py` stubs**.

## Files

| File | Role |
|------|------|
| `main.py` | **entry point** — `python main.py <server\|discover>` |
| `proto.py` | runtime-loads `../proto/tools.proto` → `tools_pb2`, `tools_pb2_grpc` |
| `server.py` | serves the tool list from `../proto/tools.sample.json` |
| `discover.py` | connects and calls `GetAvailableTools` |

## Make targets

| Target | What it does |
|--------|--------------|
| `make install` | create `.venv` and `pip install -e .` |
| `make run` | boot server, run the client, tear down (self-contained; used by CI) |
| `make server` / `make discover` | run one half (foreground) |
| `make ci` | `install` + `run` |

```bash
make install      # builds .venv with grpcio + grpcio-tools
make run          # one-shot round-trip
```

`grpcio-tools` is a hard requirement — `grpc.protos()`/`grpc.services()` invoke
it to compile the `.proto` in memory.

Env: `GRPC_HOST` (server bind, default `0.0.0.0:50051`), `GRPC_TARGET` (client
dial, default `localhost:50051`).
