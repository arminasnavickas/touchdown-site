// Downloads every remaining temporary Figma-hosted image used across the
// site and saves them permanently into /public/images — then automatically
// rewrites every component/content file to point at the new local copies
// instead of the temp URLs. Run this ONCE, from your own machine (this
// can't be run from a sandboxed environment without internet access to
// figma.com).
//
// HOW TO RUN THIS:
//   npm run migrate-images
//
// Safe to re-run: any image that downloads successfully gets its reference
// swapped to the local path, so a second run just finds nothing left to do
// for it. Any image whose temp URL has already expired by the time you run
// this is skipped with a warning — the site keeps working off the old temp
// URL for that one item until you either re-run this soon after asking
// Claude to refresh that specific asset, or manually drag a replacement
// photo into /public/images and update the reference yourself.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "public", "images");

fs.mkdirSync(outDir, { recursive: true });

// { url, name, file } — file is relative to project root.
const manifest = [
  { url: "https://www.figma.com/api/mcp/asset/6ad2d6e8-7fd8-4129-9414-e591520b1367", name: "hero-photo", file: "components/Hero.tsx" },
  { url: "https://www.figma.com/api/mcp/asset/dc906a0e-cecd-419d-abad-02e6291d2566", name: "hero-blob", file: "components/Hero.tsx" },
  { url: "https://www.figma.com/api/mcp/asset/ff0aa493-a111-415b-8c96-e91b6b2096a5", name: "page-blob", file: "components/PageBlobs.tsx" },
  { url: "https://www.figma.com/api/mcp/asset/375058c6-e3ca-4997-822d-f69d6d6508e3", name: "logo-nav", file: "components/Navigation.tsx" },
  { url: "https://www.figma.com/api/mcp/asset/b67a8d01-f329-4e54-930b-5daafc42286a", name: "logo-footer", file: "components/Footer.tsx" },
  { url: "https://www.figma.com/api/mcp/asset/80808f7c-a84d-4574-b9de-eb25a95ce8b8", name: "gallery-1", file: "components/Gallery.tsx" },
  { url: "https://www.figma.com/api/mcp/asset/5969d091-a388-4df2-ba7e-2b069c8ce4af", name: "gallery-2", file: "components/Gallery.tsx" },
  { url: "https://www.figma.com/api/mcp/asset/472cfba0-6723-494f-99ca-9a8900a61dab", name: "gallery-3", file: "components/Gallery.tsx" },
  { url: "https://www.figma.com/api/mcp/asset/1106f1b8-207c-4dc8-9f34-d5ca18055120", name: "gallery-4", file: "components/Gallery.tsx" },
  { url: "https://www.figma.com/api/mcp/asset/e8db2541-840f-43dc-be8f-75f7b4e675b8", name: "gallery-5", file: "components/Gallery.tsx" },
  { url: "https://www.figma.com/api/mcp/asset/bc54ff09-825a-40bc-9026-eb4b17e9afee", name: "gallery-6", file: "components/Gallery.tsx" },
  { url: "https://www.figma.com/api/mcp/asset/94438c18-cbb9-4163-a137-5faef1660c96", name: "gallery-7", file: "components/Gallery.tsx" },
  { url: "https://www.figma.com/api/mcp/asset/1d79d655-354d-4ebc-a0cb-e03db1d48b56", name: "gallery-8", file: "components/Gallery.tsx" },
  { url: "https://www.figma.com/api/mcp/asset/6d381fc7-bdbd-4e64-88d8-c79901335f79", name: "how-it-works-icon-1", file: "components/HowItWorks.tsx" },
  { url: "https://www.figma.com/api/mcp/asset/9c0b6e3b-2f0f-4d93-86aa-c78db1e3ce2c", name: "how-it-works-photo-1", file: "components/HowItWorks.tsx" },
  { url: "https://www.figma.com/api/mcp/asset/bf505706-462d-4fb3-965c-67f95c7d14d0", name: "how-it-works-icon-2", file: "components/HowItWorks.tsx" },
  { url: "https://www.figma.com/api/mcp/asset/50c8a5de-6e91-45a2-a4c6-3d67299a9f52", name: "how-it-works-photo-2", file: "components/HowItWorks.tsx" },
  { url: "https://www.figma.com/api/mcp/asset/ea5b177a-66ab-4b42-afc4-d0f8bc8603d1", name: "how-it-works-icon-3", file: "components/HowItWorks.tsx" },
  { url: "https://www.figma.com/api/mcp/asset/3a3462d1-27f1-4dea-bbf0-d66ab70d06ec", name: "how-it-works-photo-3", file: "components/HowItWorks.tsx" },
  { url: "https://www.figma.com/api/mcp/asset/806980c9-e18f-4c64-87ac-32ff91578599", name: "how-it-works-icon-4", file: "components/HowItWorks.tsx" },
  { url: "https://www.figma.com/api/mcp/asset/a7f0e932-4409-4f6d-9781-6e2fdc8d2381", name: "how-it-works-photo-4", file: "components/HowItWorks.tsx" },
  { url: "https://www.figma.com/api/mcp/asset/7281e91a-5e2d-4e89-9742-d984d74a54ef", name: "water-day-1", file: "components/WaterDaySchedule.tsx" },
  { url: "https://www.figma.com/api/mcp/asset/e4a425f4-3664-4f5c-bdb2-98f3de1ba019", name: "water-day-2", file: "components/WaterDaySchedule.tsx" },
  { url: "https://www.figma.com/api/mcp/asset/123078a6-6d45-4040-a6ac-730595bda1d6", name: "water-day-4", file: "components/WaterDaySchedule.tsx" },
  { url: "https://www.figma.com/api/mcp/asset/f3e14273-6f2c-481b-bb3d-7e710b082877", name: "dry-day-1", file: "components/DryDaySchedule.tsx" },
  { url: "https://www.figma.com/api/mcp/asset/a29d049a-cc8f-4c77-bded-58a0cce84427", name: "dry-day-2", file: "components/DryDaySchedule.tsx" },
  { url: "https://www.figma.com/api/mcp/asset/8d13673a-67a4-4222-8d4d-a0e17ecb19fc", name: "team-1", file: "lib/content.ts" },
  { url: "https://www.figma.com/api/mcp/asset/5ae96663-1d0d-4cc1-9418-750eb70ed0cf", name: "team-3", file: "lib/content.ts" },
  { url: "https://www.figma.com/api/mcp/asset/656a4fa5-99b7-4501-b0db-792e2d4e9510", name: "team-4", file: "lib/content.ts" },
  { url: "https://www.figma.com/api/mcp/asset/6b4e6002-39e9-4cf2-801c-a3db21cb8eae", name: "team-5", file: "lib/content.ts" },
  { url: "https://www.figma.com/api/mcp/asset/e75d1b48-18c9-4e92-bd9e-95cba79fffaa", name: "review-1", file: "lib/content.ts" },
  { url: "https://www.figma.com/api/mcp/asset/669e1226-1e86-451b-938f-48137c1abbcc", name: "review-2", file: "lib/content.ts" },
  { url: "https://www.figma.com/api/mcp/asset/201ad265-3e26-4a8f-b27e-bd41eb3c951d", name: "review-3", file: "lib/content.ts" },
  { url: "https://www.figma.com/api/mcp/asset/bc19016f-f9d6-42d3-86b3-32c08a7780ec", name: "review-4", file: "lib/content.ts" },
  { url: "https://www.figma.com/api/mcp/asset/d16ae47b-865a-465d-b092-d10944e43532", name: "review-5", file: "lib/content.ts" },
];

function extFromContentType(ct) {
  if (!ct) return "png";
  if (ct.includes("jpeg") || ct.includes("jpg")) return "jpg";
  if (ct.includes("png")) return "png";
  if (ct.includes("svg")) return "svg";
  if (ct.includes("webp")) return "webp";
  return "png";
}

async function migrate() {
  let ok = 0;
  let failed = 0;

  for (const item of manifest) {
    try {
      const res = await fetch(item.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const contentType = res.headers.get("content-type");
      const ext = extFromContentType(contentType);
      let buffer = Buffer.from(await res.arrayBuffer());

      // Resize + recompress photos so they're never larger than they need
      // to be for how they're actually displayed on the page. SVGs pass
      // through untouched.
      if (ext === "jpg" || ext === "png") {
        try {
          const image = sharp(buffer);
          const meta = await image.metadata();
          const isPortrait = (meta.height ?? 0) > (meta.width ?? 0);
          const maxWidth = isPortrait ? 900 : 1600;
          let pipeline = image;
          if (meta.width && meta.width > maxWidth) {
            pipeline = pipeline.resize({ width: maxWidth });
          }
          buffer =
            ext === "png"
              ? await pipeline.png({ compressionLevel: 9, effort: 8 }).toBuffer()
              : await pipeline.jpeg({ quality: 80, mozjpeg: true }).toBuffer();
        } catch {
          // If sharp can't process it for any reason, fall back to the
          // original bytes rather than failing the whole migration.
        }
      }

      const filename = `${item.name}.${ext}`;
      fs.writeFileSync(path.join(outDir, filename), buffer);

      const filePath = path.join(root, item.file);
      let content = fs.readFileSync(filePath, "utf8");
      if (content.includes(item.url)) {
        content = content.split(item.url).join(`/images/${filename}`);
        fs.writeFileSync(filePath, content);
      }

      console.log(`✓ ${item.name}.${ext}`);
      ok++;
    } catch (err) {
      console.warn(`✗ ${item.name} — ${err.message} (left as temp URL, unchanged)`);
      failed++;
    }
  }

  console.log(`\nDone: ${ok} migrated, ${failed} failed.`);
  if (failed > 0) {
    console.log(
      "For any failures above, ask Claude to refresh that specific image's URL, then re-run `npm run migrate-images`."
    );
  }
}

migrate();
