// server.mjs — gRPC DiscoveryService over HTTP/2 + Protocol Buffers.
import * as grpc from '@grpc/grpc-js';
import { readFileSync } from 'node:fs';
import { DiscoveryService, SAMPLE_TOOLS_PATH } from './proto.mjs';

const TOOLS = JSON.parse(readFileSync(SAMPLE_TOOLS_PATH, 'utf8'));

// Unary handler: (call, callback) => callback(error, response).
function getAvailableTools(_call, callback) {
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
  console.log(`✅ [mjs] DiscoveryService listening on ${HOST} (port ${port})`);
});
