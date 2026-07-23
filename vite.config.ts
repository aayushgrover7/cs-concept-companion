import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));

// Builds the extension pages (popup, options, onboarding) and the module
// service worker. The content script needs a separate IIFE build and lives
// in vite.content.config.ts.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: `${root}popup.html`,
        options: `${root}options.html`,
        onboarding: `${root}onboarding.html`,
        background: `${root}src/background/index.ts`,
      },
      output: {
        entryFileNames: (chunk) =>
          chunk.name === 'background' ? 'background.js' : 'assets/[name]-[hash].js',
      },
    },
  },
});
