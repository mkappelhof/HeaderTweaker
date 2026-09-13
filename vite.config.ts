import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const pkg = JSON.parse(readFileSync(path.resolve(import.meta.dirname, 'package.json'), 'utf-8'));
const BROWSER = (process.env.BROWSER as 'firefox' | 'chrome') || 'firefox';
// In watch mode, keep the previous output so web-ext never sees a half-written extension mid-rebuild.
const IS_WATCH = process.argv.includes('--watch') || process.argv.includes('-w');

const syncManifest = () => {
  const distManifestPath = path.resolve(import.meta.dirname, `dist/${BROWSER}/manifest.json`);
  const chromeSrc = path.resolve(import.meta.dirname, 'manifests/chrome.json');

  const writeManifest = () => {
    if (!existsSync(path.dirname(distManifestPath))) return;

    // Firefox uses the manifest copied from publicDir as-is; Chrome replaces it with its MV3 manifest.
    const manifest =
      BROWSER === 'chrome'
        ? JSON.parse(readFileSync(chromeSrc, 'utf-8'))
        : JSON.parse(readFileSync(distManifestPath, 'utf-8'));
    manifest.version = pkg.version;
    writeFileSync(distManifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  };

  return {
    name: 'sync-manifest',
    // Each watch rebuild re-copies the base (Firefox) manifest from publicDir into the out dir before
    // this hook runs, so overwrite it here to avoid briefly serving an MV2 manifest to Chrome.
    buildStart() {
      if (BROWSER === 'chrome') writeManifest();
    },
    writeBundle() {
      writeManifest();
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
      '@i18n': path.resolve(import.meta.dirname, 'src/i18n'),
      '@interfaces': path.resolve(import.meta.dirname, 'src/interfaces'),
      '@styles': path.resolve(import.meta.dirname, 'src/styles'),
    },
    extensions: ['.js', '.ts', '.tsx', '.jsx'],
  },
  build: {
    outDir: `../dist/${BROWSER}`,
    emptyOutDir: !IS_WATCH,
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
    pool: 'vmThreads',
  },
});
