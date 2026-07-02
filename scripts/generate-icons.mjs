/**
 * Generates the raster PNG icons the PWA manifest / Play Store / Android
 * launcher need, from the app's vector logo. Re-run after changing the logo:
 *
 *   node scripts/generate-icons.mjs
 *
 * Outputs to public/icons/. The "maskable" variant is full-bleed (no rounded
 * corners) with the mark inside the ~80% safe zone so Android's adaptive-icon
 * mask never clips it.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "icons");

const BLUE = "#046b99";
const GOLD = "#fdb81e";

/** The logo. `radius` rounds the tile; maskable uses 0 (mask supplies shape). */
function logoSvg(radius) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="${radius}" fill="${BLUE}"/>
  <rect x="104" y="156" width="304" height="200" rx="28" fill="${GOLD}"/>
  <text x="256" y="296" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="150" font-weight="800" fill="${BLUE}">DL</text>
</svg>`;
}

const targets = [
  { name: "icon-192.png", size: 192, radius: 96 },
  { name: "icon-512.png", size: 512, radius: 96 },
  { name: "maskable-512.png", size: 512, radius: 0 },
];

await mkdir(outDir, { recursive: true });
for (const t of targets) {
  const png = await sharp(Buffer.from(logoSvg(t.radius)))
    .resize(t.size, t.size)
    .png()
    .toBuffer();
  await writeFile(join(outDir, t.name), png);
  console.log(`wrote public/icons/${t.name} (${t.size}x${t.size})`);
}
