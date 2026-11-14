import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { type BrowserContext, test as base, firefox } from '@playwright/test';
import { type FirefoxExtension, findFreePort, installTemporaryAddon } from './firefox-rdp';

const EXTENSION_PATH = path.resolve(import.meta.dirname, '../dist/firefox');

type ExtensionFixtures = {
  context: BrowserContext;
  /** Runs code in the extension's background page (Playwright can't open `moz-extension://` pages). */
  extension: FirefoxExtension;
};

type InternalFixtures = { launched: { context: BrowserContext; extension: FirefoxExtension } };

export const test = base.extend<ExtensionFixtures & InternalFixtures>({
  // biome-ignore lint/correctness/noEmptyPattern: Playwright requires an object pattern for fixture args
  launched: async ({}, use) => {
    const manifestPath = path.join(EXTENSION_PATH, 'manifest.json');
    if (!existsSync(manifestPath)) {
      throw new Error(
        `No built extension found in ${EXTENSION_PATH}, run \`pnpm build:firefox\` first`
      );
    }
    const addonId = JSON.parse(readFileSync(manifestPath, 'utf-8')).browser_specific_settings.gecko
      .id;

    const debuggerPort = await findFreePort();
    const context = await firefox.launchPersistentContext('', {
      args: ['-start-debugger-server', String(debuggerPort)],
      firefoxUserPrefs: {
        'devtools.debugger.remote-enabled': true,
        'devtools.debugger.prompt-connection': false,
        'devtools.chrome.enabled': true,
      },
    });
    const extension = await installTemporaryAddon(debuggerPort, EXTENSION_PATH, addonId);

    await use({ context, extension });

    extension.close();
    await context.close();
  },
  context: async ({ launched }, use) => {
    await use(launched.context);
  },
  extension: async ({ launched }, use) => {
    await use(launched.extension);
  },
});

export const { expect } = test;
