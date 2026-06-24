#!/usr/bin/env node
// Entry point for the mjs package.
//   node index.mjs server     -> start the DiscoveryService
//   node index.mjs discover   -> query a DiscoveryService (default)
const cmd = process.argv[2] ?? 'discover';

if (cmd === 'server') {
  await import('./server.mjs');
} else if (cmd === 'discover') {
  await import('./discover.mjs');
} else {
  console.error(`Unknown command: ${cmd}\nUsage: node index.mjs <server|discover>`);
  process.exit(2);
}
