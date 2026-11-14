import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { type BrowserContext, test as base, firefox, type Page } from '@playwright/test';
import { findFreePort, installTemporaryAddon } from './firefox-rdp';

const EXTENSION_PATH = path.resolve(import.meta.dirname, '../dist/firefox');
// Pinned via the `extensions.webextensions.uuids` pref, so extension pages have a known URL.
const EXTENSION_UUID = '5c1c9a3e-3b1e-4c1a-9d3e-6f1b2a7c8d90';

type ExtensionFixtures = {
  context: BrowserContext;
  extensionUrl: string;
  /** An extension page, which has access to the `browser.*` extension APIs. */
  extensionPage: Page;
};

export const test = base.extend<ExtensionFixtures>({
  // biome-ignore lint/correctness/noEmptyPattern: Playwright requires an object pattern for fixture args
  context: async ({}, use) => {
    const manifestPath = path.join(EXTENSION_PATH, 'manifest.json');
    if (!existsSync(manifestPath)) {
      throw new Error(
        `No built extension found in ${EXTENSION_PATH}, run \`pnpm build:firefox\` first`
      );
    }
    const geckoId = JSON.parse(readFileSync(manifestPath, 'utf-8')).browser_specific_settings.gecko
      .id;

    const debuggerPort = await findFreePort();
    const context = await firefox.launchPersistentContext('', {
      args: ['-start-debugger-server', String(debuggerPort)],
      firefoxUserPrefs: {
        'devtools.debugger.remote-enabled': true,
        'devtools.debugger.prompt-connection': false,
        'devtools.chrome.enabled': true,
        'extensions.webextensions.uuids': JSON.stringify({ [geckoId]: EXTENSION_UUID }),
      },
    });
    await installTemporaryAddon(debuggerPort, EXTENSION_PATH);
    await use(context);
    await context.close();
  },
  // biome-ignore lint/correctness/noEmptyPattern: Playwright requires an object pattern for fixture args
  extensionUrl: async ({}, use) => {
    await use(`moz-extension://${EXTENSION_UUID}`);
  },
  extensionPage: async ({ context, extensionUrl }, use) => {
    const page = await context.newPage();
    await page.goto(`${extensionUrl}/headertweaker.html`);
    await use(page);
  },
});

export const { expect } = test;
