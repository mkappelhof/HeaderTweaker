import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';

export const SMOKE_HEADER = {
  id: 'smoke',
  name: 'X-HeaderTweaker-Smoke',
  value: 'it-works',
  enabled: true,
};

// Echoes the request headers back as JSON, so tests can assert what the extension sent.
export const startEchoServer = async () => {
  const server = createServer((req, res) => {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify(req.headers));
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));

  return {
    url: `http://127.0.0.1:${(server.address() as AddressInfo).port}/`,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
};
