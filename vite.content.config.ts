import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

// Content scripts cannot be ES modules, so this config bundles the content
// script into a single self-contained IIFE file.
export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    lib: {
      entry: fileURLToPath(new URL('src/content/index.ts', import.meta.url)),
      formats: ['iife'],
      name: 'CSConceptCompanion',
      fileName: () => 'content.js',
    },
    rollupOptions: {
      output: { extend: true },
    },
  },
});
