import { defineConfig } from '@playwright/test';

// Smoke tests run against the built extensions in dist/ — run `pnpm build:all` first.
export default defineConfig({
  testDir: 'e2e',
  // Every test launches its own browser with the extension loaded, so run them one at a time.
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  projects: [
    { name: 'chrome', testMatch: 'chrome.e2e.ts' },
    { name: 'firefox', testMatch: 'firefox.e2e.ts' },
  ],
});
