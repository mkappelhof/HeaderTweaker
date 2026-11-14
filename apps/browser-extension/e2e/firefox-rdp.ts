import { type AddressInfo, createConnection, createServer, type Socket } from 'node:net';

// Minimal client for Firefox's Remote Debugging Protocol, just enough to install a temporary add-on
// (the same thing `web-ext run` does). Playwright itself has no API to load Firefox extensions.
// Protocol: https://firefox-source-docs.mozilla.org/devtools/backend/protocol.html

type RdpMessage = { from?: string; error?: string; message?: string; [key: string]: unknown };

export const findFreePort = () =>
  new Promise<number>((resolve, reject) => {
    const server = createServer();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address() as AddressInfo;
      server.close(() => resolve(port));
    });
  });

const connect = async (port: number, timeoutMs = 10_000): Promise<Socket> => {
  const deadline = Date.now() + timeoutMs;

  for (;;) {
    try {
      return await new Promise<Socket>((resolve, reject) => {
        const socket = createConnection({ port, host: '127.0.0.1' });
        socket.once('connect', () => resolve(socket));
        socket.once('error', reject);
      });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ECONNREFUSED' || Date.now() > deadline) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
};

// Packets are `<byte length>:<JSON>`.
const createRdpSession = (socket: Socket) => {
  let buffer = Buffer.alloc(0);
  const messages: RdpMessage[] = [];
  let closed = false;
  let notify: (() => void) | undefined;

  socket.on('close', () => {
    closed = true;
    notify?.();
  });

  socket.on('data', (chunk: Buffer) => {
    buffer = Buffer.concat([buffer, chunk]);
    for (;;) {
      const separator = buffer.indexOf(':');
      if (separator === -1) {
        break;
      }
      const length = Number(buffer.subarray(0, separator).toString());
      if (buffer.length < separator + 1 + length) {
        break;
      }
      messages.push(JSON.parse(buffer.subarray(separator + 1, separator + 1 + length).toString()));
      buffer = buffer.subarray(separator + 1 + length);
    }
    notify?.();
  });

  // Resolves with the next message from `actor`, skipping unsolicited events from other actors.
  const receiveFrom = async (actor: string): Promise<RdpMessage> => {
    for (;;) {
      const index = messages.findIndex((message) => message.from === actor);
      if (index !== -1) {
        const [message] = messages.splice(index, 1);
        if (message.error) {
          throw new Error(`Firefox RDP error from ${actor}: ${message.error}: ${message.message}`);
        }
        return message;
      }
      if (closed) {
        throw new Error('Firefox RDP connection closed');
      }
      await new Promise<void>((resolve) => {
        notify = resolve;
      });
    }
  };

  const request = (message: { to: string; type: string; [key: string]: unknown }) => {
    const json = JSON.stringify(message);
    socket.write(`${Buffer.byteLength(json)}:${json}`);
    return receiveFrom(message.to);
  };

  return { receiveFrom, request };
};

export const installTemporaryAddon = async (port: number, addonPath: string) => {
  const socket = await connect(port);
  try {
    const session = createRdpSession(socket);
    // The server greets every new connection from the root actor.
    await session.receiveFrom('root');
    const { addonsActor } = await session.request({ to: 'root', type: 'getRoot' });
    if (typeof addonsActor !== 'string') {
      throw new Error('Firefox did not return an add-ons actor');
    }
    await session.request({ to: addonsActor, type: 'installTemporaryAddon', addonPath });
  } finally {
    socket.destroy();
  }
};
