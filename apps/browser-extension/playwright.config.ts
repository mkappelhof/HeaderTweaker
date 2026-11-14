import { defineConfig } from '@playwright/test';

// Smoke tests run against the built Chrome extension in dist/chrome — run `pnpm build:chrome` first.
export default defineConfig({
  testDir: 'e2e',
  testMatch: '*.e2e.ts',
  // Every test launches its own browser with the extension loaded, so run them one at a time.
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
});
