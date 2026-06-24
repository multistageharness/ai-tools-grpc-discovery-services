// Shared loader: parse ../proto/tools.proto at runtime and hand back the
// `api.DiscoveryService` descriptor used by both server.mjs and discover.mjs.
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const PROTO_PATH = path.resolve(__dirname, '../proto/tools.proto');
export const SAMPLE_TOOLS_PATH = path.resolve(__dirname, '../proto/tools.sample.json');

// keepCase:true keeps `input_schema` snake_case so all three languages agree.
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

// Map to package name ('api') + service name ('DiscoveryService') from the .proto.
export const { DiscoveryService } = protoDescriptor.api;
