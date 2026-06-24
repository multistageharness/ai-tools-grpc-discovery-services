"""Shared loader: parse ../proto/tools.proto at runtime.

`grpc.protos()` / `grpc.services()` compile the .proto in-memory (no committed
*_pb2.py stubs), mirroring @grpc/proto-loader on the JS side. They require the
`grpcio-tools` package and the proto's directory on sys.path.
"""
import os
import sys

import grpc

PROTO_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "proto"))
SAMPLE_TOOLS_PATH = os.path.join(PROTO_DIR, "tools.sample.json")

# Make "tools.proto" importable by the dynamic loader.
if PROTO_DIR not in sys.path:
    sys.path.insert(0, PROTO_DIR)

# tools_pb2 -> messages (EmptyRequest, Tool, ToolListResponse)
# tools_pb2_grpc -> DiscoveryServiceStub / Servicer / registration helper
tools_pb2 = grpc.protos("tools.proto")
tools_pb2_grpc = grpc.services("tools.proto")
