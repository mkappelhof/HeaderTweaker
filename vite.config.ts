import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  plugins: [react()],
  resolve: {
    alias: {
      '@constants': path.resolve(__dirname, 'src/constants'),
      '@contexts': path.resolve(__dirname, 'src/contexts'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@helpers': path.resolve(__dirname, 'src/helpers'),
      '@interfaces': path.resolve(__dirname, 'src/interfaces'),
      '@styles': path.resolve(__dirname, 'src/styles'),
    },
    extensions: ['.js', '.ts', '.tsx', '.jsx'],
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        // popup: 'src/headertweaker.html',
        headertweaker: 'src/headertweaker.tsx',
        background: 'src/background.ts',
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === 'headertweaker') return 'js/headertweaker.js';
          if (chunk.name === 'background') return 'js/background.js';
          return 'js/main.js';
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'css/styles.css';
          }
          return 'assets/[name][extname]';
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "sass:color";@use "@styles/variables.scss" as vars;`,
      },
    },
  },
});
