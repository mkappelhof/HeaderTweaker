import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { NodePackageImporter } from 'sass';

// Read directly here (not from app code) — astro.config.mjs always runs from its real source
// location, unlike app modules, which get bundled/relocated so `import.meta.url`-relative reads
// break at build time.
const extensionPkg = JSON.parse(
  readFileSync(fileURLToPath(new URL('../headertweaker/package.json', import.meta.url)), 'utf-8'),
);

export default defineConfig({
  site: 'https://headertweaker.com',
  output: 'static',
  integrations: [sitemap()],
  vite: {
    define: {
      __EXTENSION_VERSION__: JSON.stringify(extensionPkg.version),
      __EXTENSION_DESCRIPTION__: JSON.stringify(extensionPkg.description),
    },
    resolve: {
      alias: {
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@layouts': fileURLToPath(new URL('./src/layouts', import.meta.url)),
        '@data': fileURLToPath(new URL('./src/data', import.meta.url)),
        '@styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
        '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "sass:color";@use "pkg:headertweaker-tokens" as vars;`,
          importers: [new NodePackageImporter()],
        },
      },
    },
  },
});
