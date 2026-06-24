#!/usr/bin/env node
// Entry point for the ts package.
//   tsx src/index.ts server     -> start the DiscoveryService
//   tsx src/index.ts discover   -> query a DiscoveryService (default)
const cmd = process.argv[2] ?? 'discover';

if (cmd === 'server') {
  await import('./server.js');
} else if (cmd === 'discover') {
  await import('./discover.js');
} else {
  console.error(`Unknown command: ${cmd}\nUsage: tsx src/index.ts <server|discover>`);
  process.exit(2);
}
