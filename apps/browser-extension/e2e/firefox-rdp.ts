import { type AddressInfo, createConnection, createServer, type Socket } from 'node:net';

// Minimal client for Firefox's Remote Debugging Protocol (the protocol `web-ext run` and
// about:debugging use). Playwright can't load Firefox extensions, and it can't drive extension pages
// either (they run in a separate extension process), so the tests use this to install the add-on and
// to run code in its background page.
// Protocol: https://firefox-source-docs.mozilla.org/devtools/backend/protocol.html

type RdpMessage = { from?: string; type?: string; error?: string; message?: string } & Record<
  string,
  unknown
>;

export const findFreePort = () =>
  new Promise<number>((resolve, reject) => {
    const server = createServer();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address() as AddressInfo;
      server.close(() => resolve(port));
    });
  });

const connectSocket = async (port: number, timeoutMs = 10_000): Promise<Socket> => {
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

  // Resolves with the first message matching `predicate`, leaving unrelated messages (e.g.
  // unsolicited events) queued.
  const receive = async (predicate: (message: RdpMessage) => boolean): Promise<RdpMessage> => {
    for (;;) {
      const index = messages.findIndex(predicate);
      if (index !== -1) {
        const [message] = messages.splice(index, 1);
        if (message.error) {
          throw new Error(
            `Firefox RDP error from ${message.from}: ${message.error}: ${message.message}`
          );
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

  const request = (message: { to: string; type: string } & Record<string, unknown>) => {
    const json = JSON.stringify(message);
    socket.write(`${Buffer.byteLength(json)}:${json}`);
    // Events (e.g. `target-available-form`) come from the same actor but carry a `type`; replies don't.
    return receive(({ from, type }) => from === message.to && type === undefined);
  };

  return { receive, request, close: () => socket.destroy() };
};

export type FirefoxExtension = {
  /**
   * Runs `fn` in the extension's background page and returns its (JSON-serializable) result. Like
   * Playwright's `page.evaluate`, `fn` is serialized, so it can't use variables from the test.
   */
  evaluate: <Arg, Result>(fn: (arg: Arg) => Result | Promise<Result>, arg?: Arg) => Promise<Result>;
  close: () => void;
};

export const installTemporaryAddon = async (
  port: number,
  addonPath: string,
  addonId: string
): Promise<FirefoxExtension> => {
  const session = createRdpSession(await connectSocket(port));

  try {
    // The server greets every new connection from the root actor.
    await session.receive(({ from }) => from === 'root');
    const { addonsActor } = await session.request({ to: 'root', type: 'getRoot' });
    await session.request({ to: String(addonsActor), type: 'installTemporaryAddon', addonPath });

    const { addons } = await session.request({ to: 'root', type: 'listAddons' });
    const addon = (addons as { id: string; actor: string }[]).find(({ id }) => id === addonId);
    if (!addon) {
      throw new Error(`Add-on ${addonId} is not installed`);
    }
    // Targets come from a watcher: it emits a `target-available-form` event for every document the
    // add-on has open. The background page's console actor evaluates code in the background page.
    const { actor: watcherActor } = await session.request({ to: addon.actor, type: 'getWatcher' });
    await session.request({ to: String(watcherActor), type: 'watchTargets', targetType: 'frame' });
    const { target } = await session.receive(
      ({ from, type, target }) =>
        from === watcherActor &&
        type === 'target-available-form' &&
        /\/background\.html$/.test(String((target as { url?: string })?.url))
    );
    const { consoleActor } = target as { consoleActor: string };

    const evaluate: FirefoxExtension['evaluate'] = async (fn, arg) => {
      // Wrapping in an async function and asking the server to await it supports async `fn`s;
      // stringifying the result avoids having to unpack the protocol's object "grips".
      const text = `(async () => JSON.stringify(await (${fn})(${JSON.stringify(arg)})))()`;
      const { resultID } = await session.request({
        to: consoleActor,
        type: 'evaluateJSAsync',
        text,
        mapped: { await: true },
      });
      const result = await session.receive(
        (message) => message.type === 'evaluationResult' && message.resultID === resultID
      );
      if (result.exceptionMessage) {
        throw new Error(`Evaluation in the background page failed: ${result.exceptionMessage}`);
      }
      if (typeof result.result === 'string') {
        return JSON.parse(result.result);
      }
      // `JSON.stringify` returns undefined for functions/undefined, which the protocol sends as a grip.
      if ((result.result as { type?: string } | undefined)?.type === 'undefined') {
        return undefined;
      }
      throw new Error(`Unexpected evaluation result: ${JSON.stringify(result.result)}`);
    };

    return { evaluate, close: session.close };
  } catch (error) {
    session.close();
    throw error;
  }
};
