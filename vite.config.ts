import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const pkg = JSON.parse(readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'));
const BROWSER = (process.env.BROWSER as 'firefox' | 'chrome') || 'firefox';

const syncManifest = () => {
  return {
    name: 'sync-manifest',
    closeBundle() {
      const distDir = path.resolve(__dirname, `dist/${BROWSER}`);
      const distManifestPath = path.join(distDir, 'manifest.json');

      if (BROWSER === 'chrome') {
        // Overwrite the Firefox manifest that was copied from publicDir
        const chromeSrc = path.resolve(__dirname, 'manifests/chrome.json');
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
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', {}]],
      },
    }),
    syncManifest(),
  ],
  define: {
    __BROWSER__: JSON.stringify(BROWSER),
  },
  resolve: {
    alias: {
      'react/compiler-runtime': 'react-compiler-runtime',
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
        api: 'modern',
        additionalData: `@use "sass:color";@use "@styles/variables.scss" as vars;`,
      },
    },
  },
});
