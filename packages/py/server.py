"""server.py — gRPC DiscoveryService over HTTP/2 + Protocol Buffers."""
import json
import os
from concurrent import futures

import grpc

from proto import SAMPLE_TOOLS_PATH, tools_pb2, tools_pb2_grpc

with open(SAMPLE_TOOLS_PATH, encoding="utf-8") as fh:
    TOOLS = json.load(fh)


class DiscoveryService(tools_pb2_grpc.DiscoveryServiceServicer):
    def GetAvailableTools(self, request, context):
        return tools_pb2.ToolListResponse(
            tools=[
                tools_pb2.Tool(
                    name=t["name"],
                    description=t["description"],
                    input_schema=t["input_schema"],
                )
                for t in TOOLS
            ]
        )


def serve() -> None:
    host = os.environ.get("GRPC_HOST", "0.0.0.0:50051")
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    tools_pb2_grpc.add_DiscoveryServiceServicer_to_server(DiscoveryService(), server)
    server.add_insecure_port(host)
    server.start()
    print(f"✅ [py] DiscoveryService listening on {host}")
    server.wait_for_termination()


if __name__ == "__main__":
    serve()
