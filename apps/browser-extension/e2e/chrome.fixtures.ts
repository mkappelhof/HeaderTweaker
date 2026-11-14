import { existsSync } from 'node:fs';
import path from 'node:path';
import { type BrowserContext, test as base, chromium, type Worker } from '@playwright/test';

const EXTENSION_PATH = path.resolve(import.meta.dirname, '../dist/chrome');

type ExtensionFixtures = {
  context: BrowserContext;
  serviceWorker: Worker;
  extensionId: string;
};

export const test = base.extend<ExtensionFixtures>({
  // biome-ignore lint/correctness/noEmptyPattern: Playwright requires an object pattern for fixture args
  context: async ({}, use) => {
    if (!existsSync(path.join(EXTENSION_PATH, 'manifest.json'))) {
      throw new Error(
        `No built extension found in ${EXTENSION_PATH}, run \`pnpm build:chrome\` first`
      );
    }

    // The bundled Chromium (channel 'chromium') supports loading extensions in headless mode.
    const context = await chromium.launchPersistentContext('', {
      channel: 'chromium',
      args: [`--disable-extensions-except=${EXTENSION_PATH}`, `--load-extension=${EXTENSION_PATH}`],
    });
    await use(context);
    await context.close();
  },
  serviceWorker: async ({ context }, use) => {
    const [existing] = context.serviceWorkers();
    await use(existing ?? (await context.waitForEvent('serviceworker')));
  },
  extensionId: async ({ serviceWorker }, use) => {
    await use(new URL(serviceWorker.url()).host);
  },
});

export const { expect } = test;
