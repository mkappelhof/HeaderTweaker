import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: 'src/headertweaker.html',
        headertweaker: 'src/helpers/headertweaker.ts',
        background: 'src/helpers/background.ts',
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === 'headertweaker') return 'js/headertweaker.js';
          if (chunk.name === 'background') return 'js/background.js';
          return 'js/main.js';
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'styles/style.css';
          }
          return 'assets/[name][extname]';
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {},
    },
  },
});
