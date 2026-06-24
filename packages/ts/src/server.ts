// server.ts — gRPC DiscoveryService over HTTP/2 + Protocol Buffers.
import * as grpc from '@grpc/grpc-js';
import { readFileSync } from 'node:fs';
import {
  DiscoveryService,
  SAMPLE_TOOLS_PATH,
  type Tool,
  type ToolListResponse,
} from './proto.js';

const TOOLS: Tool[] = JSON.parse(readFileSync(SAMPLE_TOOLS_PATH, 'utf8'));

function getAvailableTools(
  _call: grpc.ServerUnaryCall<unknown, ToolListResponse>,
  callback: grpc.sendUnaryData<ToolListResponse>,
): void {
  callback(null, { tools: TOOLS });
}

const server = new grpc.Server();
server.addService(DiscoveryService.service, {
  GetAvailableTools: getAvailableTools,
});

const HOST = process.env.GRPC_HOST ?? '0.0.0.0:50051';

server.bindAsync(HOST, grpc.ServerCredentials.createInsecure(), (error, port) => {
  if (error) {
    console.error('❌ Failed to bind:', error.message);
    process.exit(1);
  }
  console.log(`✅ [ts] DiscoveryService listening on ${HOST} (port ${port})`);
});
