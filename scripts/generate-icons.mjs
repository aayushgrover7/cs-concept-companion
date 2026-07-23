// Renders the extension logo (code brackets + lightbulb) to the PNG sizes
// Chrome expects. Run with: npm run icons
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'icons');
mkdirSync(outDir, { recursive: true });

const svg = `
<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <rect width="128" height="128" rx="28" fill="#26303c"/>
  <path d="M40 34 L22 64 L40 94" stroke="#e8a33d" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M88 34 L106 64 L88 94" stroke="#e8a33d" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="64" cy="56" r="16" stroke="#fffdf7" stroke-width="8" fill="none"/>
  <path d="M64 72 L64 84 M57 92 L71 92" stroke="#fffdf7" stroke-width="8" stroke-linecap="round"/>
</svg>`;

for (const size of [16, 32, 48, 128]) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(join(outDir, `icon${size}.png`));
}
console.log('Icons written to public/icons/');
