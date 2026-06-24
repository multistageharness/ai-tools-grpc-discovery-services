// discover.mjs — dynamically load the contract, open an HTTP/2 connection,
// and call the discovery endpoint to pull the tool list.
//
//   node discover.mjs            # talks to localhost:50051
//   GRPC_TARGET=host:port node discover.mjs
import * as grpc from '@grpc/grpc-js';
import { DiscoveryService } from './proto.mjs';

function fetchTools() {
  const target = process.env.GRPC_TARGET ?? 'localhost:50051';

  // Insecure for local dev; use grpc.credentials.createSsl() in production.
  const client = new DiscoveryService(target, grpc.credentials.createInsecure());

  console.log(`Connecting to gRPC server at ${target}...`);

  // First arg is the EmptyRequest payload; second is the unary callback.
  client.GetAvailableTools({}, (error, response) => {
    if (error) {
      console.error('❌ Failed to discover tools:', error.details || error.message);
      process.exitCode = 1;
      client.close();
      return;
    }

    console.log('✅ Discovered Tools:');
    console.log(JSON.stringify(response.tools, null, 2));
    client.close();
  });
}

fetchTools();
