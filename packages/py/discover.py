"""discover.py — load the contract, connect over HTTP/2, pull the tool list.

    python discover.py
    GRPC_TARGET=host:port python discover.py
"""
import json
import os

import grpc

from proto import tools_pb2, tools_pb2_grpc


def fetch_tools() -> None:
    target = os.environ.get("GRPC_TARGET", "localhost:50051")
    print(f"Connecting to gRPC server at {target}...")

    # Insecure for local dev; use grpc.secure_channel() in production.
    with grpc.insecure_channel(target) as channel:
        stub = tools_pb2_grpc.DiscoveryServiceStub(channel)
        try:
            response = stub.GetAvailableTools(tools_pb2.EmptyRequest())
        except grpc.RpcError as err:
            print(f"❌ Failed to discover tools: {err.details()}")
            raise SystemExit(1)

    tools = [
        {
            "name": t.name,
            "description": t.description,
            "input_schema": t.input_schema,
        }
        for t in response.tools
    ]
    print("✅ Discovered Tools:")
    print(json.dumps(tools, indent=2))


if __name__ == "__main__":
    fetch_tools()
