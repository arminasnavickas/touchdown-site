// Resizes and re-compresses every photo already in /public/images down to a
// sensible web size. Run this any time images in that folder look larger
// than they need to be (e.g. after `npm run migrate-images`, which pulls
// down whatever resolution Figma happens to serve — sometimes several MB
// per photo).
//
// HOW TO RUN THIS:
//   npm run optimize-images
//
// Safe to run repeatedly — an already-optimized image just gets skipped
// (it won't re-compress something that's already under the target size).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.resolve(__dirname, "..", "public", "images");

// Landscape/wide shots (gallery, hero, schedule photos) can stay a bit
// larger since they're shown bigger on the page; portraits (team, reviews)
// are always shown small, so they can be much smaller.
const MAX_WIDTH_WIDE = 1600;
const MAX_WIDTH_PORTRAIT = 900;
const JPEG_QUALITY = 80;
const SKIP_IF_UNDER_BYTES = 200 * 1024; // don't bother re-touching small files

async function optimizeImage(filePath) {
  const before = fs.statSync(filePath).size;
  if (before < SKIP_IF_UNDER_BYTES) return { skipped: true };

  const image = sharp(filePath);
  const meta = await image.metadata();
  if (!meta.width || !meta.height) return { skipped: true };

  const isPortrait = meta.height > meta.width;
  const maxWidth = isPortrait ? MAX_WIDTH_PORTRAIT : MAX_WIDTH_WIDE;

  let pipeline = image;
  if (meta.width > maxWidth) {
    pipeline = pipeline.resize({ width: maxWidth });
  }

  const ext = path.extname(filePath).toLowerCase();
  const buffer =
    ext === ".png"
      ? await pipeline.png({ compressionLevel: 9, effort: 8 }).toBuffer()
      : await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();

  // Only overwrite if it's actually smaller — never make a file bigger.
  if (buffer.length < before) {
    fs.writeFileSync(filePath, buffer);
    return { before, after: buffer.length };
  }
  return { skipped: true };
}

async function run() {
  const files = fs
    .readdirSync(imagesDir)
    .filter((f) => /\.(jpe?g|png)$/i.test(f));

  let totalBefore = 0;
  let totalAfter = 0;
  let optimizedCount = 0;

  for (const file of files) {
    const filePath = path.join(imagesDir, file);
    const result = await optimizeImage(filePath);
    if (result.skipped) {
      console.log(`- ${file} (already small, skipped)`);
      continue;
    }
    totalBefore += result.before;
    totalAfter += result.after;
    optimizedCount++;
    const beforeKB = Math.round(result.before / 1024);
    const afterKB = Math.round(result.after / 1024);
    const pct = Math.round((1 - result.after / result.before) * 100);
    console.log(`✓ ${file}: ${beforeKB}KB → ${afterKB}KB (-${pct}%)`);
  }

  if (optimizedCount > 0) {
    const savedMB = ((totalBefore - totalAfter) / 1024 / 1024).toFixed(1);
    console.log(`\nOptimized ${optimizedCount} image(s), saved ${savedMB}MB total.`);
  } else {
    console.log("\nNothing to optimize — all images already small.");
  }
}

run();
