// One-off generator for public/og-image.png. Re-run manually if the lockup
// artwork changes: `node scripts/generate-og-image.mjs`. Not part of the build.
//
// Point LOCKUP_PATH at the new client's own logo lockup SVG, and BACKGROUND_HEX
// at their locked --surface-page token value (see src/styles/global.css) —
// both are placeholders below, not this starter's defaults.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCKUP_PATH = path.join(__dirname, '../src/assets/logos/lockup-stacked.svg');
const OUT_PATH = path.join(__dirname, '../public/og-image.png');
const BACKGROUND_HEX = '#FF00FF'; // [PLACEHOLDER] swap for the client's --surface-page token

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 630;
const SCALE = 3;

const lockupSource = readFileSync(LOCKUP_PATH, 'utf8');
const lockupInner = lockupSource.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');

const lockupWidth = 220 * SCALE;
const lockupHeight = 130 * SCALE;
const x = (CANVAS_WIDTH - lockupWidth) / 2;
const y = (CANVAS_HEIGHT - lockupHeight) / 2;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" viewBox="0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}">
  <rect width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" fill="${BACKGROUND_HEX}" />
  <g transform="translate(${x}, ${y}) scale(${SCALE})">
    ${lockupInner}
  </g>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(OUT_PATH);
console.log(`Wrote ${OUT_PATH}`);
