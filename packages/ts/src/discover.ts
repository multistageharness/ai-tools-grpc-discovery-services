// discover.ts — dynamically load the contract, connect over HTTP/2, and pull
// the tool list. The callback-style unary call is wrapped in a Promise.
//
//   npm run discover
//   GRPC_TARGET=host:port npm run discover
import * as grpc from '@grpc/grpc-js';
import { DiscoveryService, type ToolListResponse } from './proto.js';

function fetchTools(): Promise<ToolListResponse> {
  const target = process.env.GRPC_TARGET ?? 'localhost:50051';

  // Insecure for local dev; use grpc.credentials.createSsl() in production.
  const client = new DiscoveryService(target, grpc.credentials.createInsecure());

  console.log(`Connecting to gRPC server at ${target}...`);

  return new Promise<ToolListResponse>((resolve, reject) => {
    client.GetAvailableTools(
      {},
      (error: grpc.ServiceError | null, response: ToolListResponse) => {
        client.close();
        if (error) {
          reject(error);
          return;
        }
        resolve(response);
      },
    );
  });
}

try {
  const response = await fetchTools();
  console.log('✅ Discovered Tools:');
  console.log(JSON.stringify(response.tools, null, 2));
} catch (error) {
  const err = error as grpc.ServiceError;
  console.error('❌ Failed to discover tools:', err.details || err.message);
  process.exitCode = 1;
}
