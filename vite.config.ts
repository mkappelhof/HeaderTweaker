import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const pkg = JSON.parse(readFileSync(path.resolve(import.meta.dirname, 'package.json'), 'utf-8'));
const BROWSER = (process.env.BROWSER as 'firefox' | 'chrome') || 'firefox';

const syncManifest = () => {
  return {
    name: 'sync-manifest',
    closeBundle() {
      const distDir = path.resolve(import.meta.dirname, `dist/${BROWSER}`);
      const distManifestPath = path.join(distDir, 'manifest.json');

      if (BROWSER === 'chrome') {
        // Overwrite the Firefox manifest that was copied from publicDir
        const chromeSrc = path.resolve(import.meta.dirname, 'manifests/chrome.json');
        const manifest = JSON.parse(readFileSync(chromeSrc, 'utf-8'));
        manifest.version = pkg.version;
        writeFileSync(distManifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
      } else {
        const manifest = JSON.parse(readFileSync(distManifestPath, 'utf-8'));
        manifest.version = pkg.version;
        writeFileSync(distManifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
      }
    },
  };
};

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  plugins: [react({ compiler: true }), syncManifest()],
  define: {
    __BROWSER__: JSON.stringify(BROWSER),
  },
  resolve: {
    alias: {
      'react/compiler-runtime': 'react-compiler-runtime',
      '@constants': path.resolve(import.meta.dirname, 'src/constants'),
      '@contexts': path.resolve(import.meta.dirname, 'src/contexts'),
      '@components': path.resolve(import.meta.dirname, 'src/components'),
      '@helpers': path.resolve(import.meta.dirname, 'src/helpers'),
      '@interfaces': path.resolve(import.meta.dirname, 'src/interfaces'),
      '@styles': path.resolve(import.meta.dirname, 'src/styles'),
    },
    extensions: ['.js', '.ts', '.tsx', '.jsx'],
  },
  build: {
    outDir: `../dist/${BROWSER}`,
    emptyOutDir: true,
    rollupOptions: {
      input: {
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
            return 'css/headertweaker.css';
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
  test: {
    environment: 'jsdom',
  },
});
