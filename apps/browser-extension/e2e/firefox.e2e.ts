import { SMOKE_HEADER, startEchoServer } from './echo-server';
import { expect, test } from './firefox.fixtures';

let server: Awaited<ReturnType<typeof startEchoServer>>;
let serverUrl: string;

test.beforeAll(async () => {
  server = await startEchoServer();
  serverUrl = server.url;
});

test.afterAll(async () => {
  await server.close();
});

// Playwright can't open extension pages in Firefox, so this runs in the background page: it loads the
// popup in an iframe and waits until an element with exactly `text` appears. Self-contained, because
// `extension.evaluate` serializes it.
const renderPopupUntil = async (text: string) => {
  const frame = document.createElement('iframe');
  frame.src = '/headertweaker.html';
  document.body.append(frame);
  await new Promise((resolve) => frame.addEventListener('load', resolve, { once: true }));

  const errors: string[] = [];
  frame.contentWindow?.addEventListener('error', (event) => errors.push(String(event.message)));

  let found = false;
  const deadline = Date.now() + 10_000;
  while (!found && Date.now() < deadline) {
    const elements = frame.contentDocument?.body.querySelectorAll('*') ?? [];
    found = [...elements].some((element) => element.textContent?.trim() === text);
    if (!found) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  frame.remove();

  return { found, errors };
};

test('background page starts', async ({ extension }) => {
  const backgroundUrl = await extension.evaluate(() => location.href);

  expect(backgroundUrl).toMatch(/^moz-extension:\/\/[0-9a-f-]{36}\/background\.html$/);
});

test('popup renders without errors', async ({ extension }) => {
  expect(await extension.evaluate(renderPopupUntil, 'HeaderTweaker')).toEqual({
    found: true,
    errors: [],
  });
});

test('popup lists stored headers', async ({ extension }) => {
  await extension.evaluate(
    (header) => browser.storage.local.set({ headers: [header] }),
    SMOKE_HEADER
  );

  expect(await extension.evaluate(renderPopupUntil, SMOKE_HEADER.name)).toMatchObject({
    found: true,
  });
});

// The Firefox background reads storage on every request, so there are no rules to wait for.
test('enabled headers are added to outgoing requests', async ({ context, extension }) => {
  await extension.evaluate(
    (header) => browser.storage.local.set({ headers: [header] }),
    SMOKE_HEADER
  );

  const page = await context.newPage();
  const response = await page.goto(serverUrl);

  expect(await response?.json()).toMatchObject({
    [SMOKE_HEADER.name.toLowerCase()]: SMOKE_HEADER.value,
  });
});

test('no headers are added while HeaderTweaker is disabled', async ({ context, extension }) => {
  await extension.evaluate(
    (header) => browser.storage.local.set({ headers: [header], isDisabled: true }),
    SMOKE_HEADER
  );

  const page = await context.newPage();
  const response = await page.goto(serverUrl);

  expect(await response?.json()).not.toHaveProperty(SMOKE_HEADER.name.toLowerCase());
});
