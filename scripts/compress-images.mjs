// One-off image optimizer. Re-compresses oversized assets in public/ in place,
// preserving filenames so existing references keep working.
// PNGs that are photos are converted to high-quality JPEG-in-PNG-container?  No —
// we keep the same extension to avoid touching code, but shrink bytes hard.
import sharp from 'sharp';
import { readdir, stat, rename } from 'node:fs/promises';
import path from 'node:path';

const PUBLIC = path.resolve('public');
const MAX_W = 2000;            // cap dimension; nothing on a marketing site needs more
const JPEG_Q = 72;
const PNG_EFFORT = 9;
const THRESHOLD = 400 * 1024; // only touch files above 400KB

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const fmt = (n) => (n / 1024).toFixed(0) + 'KB';

const files = (await walk(PUBLIC)).filter((f) => /\.(png|jpe?g)$/i.test(f));
let saved = 0;
for (const file of files) {
  const before = (await stat(file)).size;
  if (before < THRESHOLD) continue;

  const ext = path.extname(file).toLowerCase();
  const tmp = file + '.tmp';
  const img = sharp(file).resize({ width: MAX_W, withoutEnlargement: true });

  if (ext === '.png') {
    // Keep PNG container but crush it; if it has no alpha, palette helps a lot.
    const meta = await img.metadata();
    await img
      .png({ quality: 80, effort: PNG_EFFORT, palette: !meta.hasAlpha, compressionLevel: 9 })
      .toFile(tmp);
  } else {
    await img.jpeg({ quality: JPEG_Q, mozjpeg: true }).toFile(tmp);
  }

  const after = (await stat(tmp)).size;
  if (after < before) {
    await rename(tmp, file);
    saved += before - after;
    console.log(`✓ ${path.relative(PUBLIC, file).padEnd(48)} ${fmt(before)} → ${fmt(after)}`);
  } else {
    const { unlink } = await import('node:fs/promises');
    await unlink(tmp);
    console.log(`· ${path.relative(PUBLIC, file)} already optimal (${fmt(before)})`);
  }
}
console.log(`\nTotal saved: ${(saved / 1024 / 1024).toFixed(1)} MB`);
