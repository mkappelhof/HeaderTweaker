import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';

const extensionStyles = fileURLToPath(new URL('../src/styles', import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: 'https://headertweaker.com',
  vite: {
    resolve: {
      alias: {
        '@styles': extensionStyles,
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "sass:color";@use "@styles/variables.scss" as vars;',
        },
      },
    },
  },
});
