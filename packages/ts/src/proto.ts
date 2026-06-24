// Shared loader: parse ../proto/tools.proto at runtime. The dynamic loader is
// untyped by nature, so we declare the contract shapes ourselves and cast the
// loaded descriptor to them — giving the rest of the code real type-safety.
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const PROTO_PATH = path.resolve(__dirname, '../../proto/tools.proto');
export const SAMPLE_TOOLS_PATH = path.resolve(__dirname, '../../proto/tools.sample.json');

export interface Tool {
  name: string;
  description: string;
  input_schema: string;
}

export interface ToolListResponse {
  tools: Tool[];
}

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as unknown as {
  api: { DiscoveryService: grpc.ServiceClientConstructor };
};

export const DiscoveryService = protoDescriptor.api.DiscoveryService;
