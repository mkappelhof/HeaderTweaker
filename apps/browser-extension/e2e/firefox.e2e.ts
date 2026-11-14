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

test('background page starts', async ({ extensionPage }) => {
  const hasBackgroundPage = await extensionPage.evaluate(async () =>
    Boolean(await browser.runtime.getBackgroundPage())
  );

  expect(hasBackgroundPage).toBe(true);
});

test('popup renders without errors', async ({ context, extensionUrl }) => {
  const page = await context.newPage();
  const errors: Error[] = [];
  page.on('pageerror', (error) => errors.push(error));

  await page.goto(`${extensionUrl}/headertweaker.html`);

  await expect(page.getByText('HeaderTweaker', { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('popup lists stored headers', async ({ extensionPage }) => {
  await extensionPage.evaluate(
    (header) => browser.storage.local.set({ headers: [header] }),
    SMOKE_HEADER
  );

  await extensionPage.reload();

  await expect(extensionPage.getByText(SMOKE_HEADER.name)).toBeVisible();
});

// The Firefox background reads storage on every request, so there are no rules to wait for.
test('enabled headers are added to outgoing requests', async ({ context, extensionPage }) => {
  await extensionPage.evaluate(
    (header) => browser.storage.local.set({ headers: [header] }),
    SMOKE_HEADER
  );

  const page = await context.newPage();
  const response = await page.goto(serverUrl);

  expect(await response?.json()).toMatchObject({
    [SMOKE_HEADER.name.toLowerCase()]: SMOKE_HEADER.value,
  });
});

test('no headers are added while HeaderTweaker is disabled', async ({ context, extensionPage }) => {
  await extensionPage.evaluate(
    (header) => browser.storage.local.set({ headers: [header], isDisabled: true }),
    SMOKE_HEADER
  );

  const page = await context.newPage();
  const response = await page.goto(serverUrl);

  expect(await response?.json()).not.toHaveProperty(SMOKE_HEADER.name.toLowerCase());
});
