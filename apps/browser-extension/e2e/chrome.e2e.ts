import { expect, test } from './chrome.fixtures';
import { SMOKE_HEADER, startEchoServer } from './echo-server';

let server: Awaited<ReturnType<typeof startEchoServer>>;
let serverUrl: string;

test.beforeAll(async () => {
  server = await startEchoServer();
  serverUrl = server.url;
});

test.afterAll(async () => {
  await server.close();
});

test('background service worker starts', async ({ serviceWorker }) => {
  expect(serviceWorker.url()).toMatch(/^chrome-extension:\/\/[a-p]{32}\/js\/background\.js$/);
});

test('popup renders without errors', async ({ context, extensionId }) => {
  const page = await context.newPage();
  const errors: Error[] = [];
  page.on('pageerror', (error) => errors.push(error));

  await page.goto(`chrome-extension://${extensionId}/headertweaker.html`);

  await expect(page.getByText('HeaderTweaker', { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('popup lists stored headers', async ({ context, extensionId, serviceWorker }) => {
  await serviceWorker.evaluate(
    (header) => chrome.storage.local.set({ headers: [header] }),
    SMOKE_HEADER
  );

  const page = await context.newPage();
  await page.goto(`chrome-extension://${extensionId}/headertweaker.html`);

  await expect(page.getByText(SMOKE_HEADER.name)).toBeVisible();
});

test('enabled headers are added to outgoing requests', async ({ context, serviceWorker }) => {
  await serviceWorker.evaluate(
    (header) => chrome.storage.local.set({ headers: [header] }),
    SMOKE_HEADER
  );
  // The background script updates its rules asynchronously after the storage change.
  await expect
    .poll(() => serviceWorker.evaluate(() => chrome.declarativeNetRequest.getDynamicRules()))
    .toHaveLength(1);

  const page = await context.newPage();
  const response = await page.goto(serverUrl);

  expect(await response?.json()).toMatchObject({
    [SMOKE_HEADER.name.toLowerCase()]: SMOKE_HEADER.value,
  });
});

test('no headers are added while HeaderTweaker is disabled', async ({ context, serviceWorker }) => {
  const getDynamicRules = () =>
    serviceWorker.evaluate(() => chrome.declarativeNetRequest.getDynamicRules());

  // A fresh profile has no rules yet, so first install an active rule for disabling to remove.
  await serviceWorker.evaluate(
    (header) => chrome.storage.local.set({ headers: [header] }),
    SMOKE_HEADER
  );
  await expect.poll(getDynamicRules).toHaveLength(1);

  await serviceWorker.evaluate(() => chrome.storage.local.set({ isDisabled: true }));
  await expect.poll(getDynamicRules).toHaveLength(0);

  const page = await context.newPage();
  const response = await page.goto(serverUrl);

  expect(await response?.json()).not.toHaveProperty(SMOKE_HEADER.name.toLowerCase());
});
