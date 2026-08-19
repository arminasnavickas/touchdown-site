// Cleans up duplicate documents caused by running `npm run seed` more than
// once (it uses client.create(), which doesn't check for existing
// documents, so a rerun duplicates everything). Safe to run any number of
// times - it always keeps exactly one copy per unique item (the earliest
// created) and only deletes the extras.
//
// Run with: npm run dedupe

import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID. Fill in .env.local first.");
  process.exit(1);
}
if (!token) {
  console.error("Missing SANITY_WRITE_TOKEN.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", token, useCdn: false });

// type -> a GROQ expression that uniquely identifies one real-world item.
// Most types use a natural content field (name/title/question). Gallery
// Image and Hero Slide have no text field at all, so they're keyed by
// `order` instead - safe here since nothing has been manually reordered
// yet, but re-run right after a fresh seed, before any reordering, if this
// ever needs to run again.
const typesToDedupe: { type: string; keyExpr: string }[] = [
  { type: "teamMember", keyExpr: "name" },
  { type: "faqItem", keyExpr: "question" },
  { type: "pricingTier", keyExpr: "name" },
  { type: "review", keyExpr: "name" },
  { type: "scheduleDay", keyExpr: "day" },
  { type: "scheduleCard", keyExpr: '"key": section + "-" + title' },
  { type: "whatYouGetItem", keyExpr: "title" },
  { type: "howItWorksStep", keyExpr: "title" },
  { type: "author", keyExpr: "name" },
  { type: "galleryImage", keyExpr: "order" },
  { type: "heroSlide", keyExpr: "order" },
  { type: "blogPost", keyExpr: '"key": slug.current' },
];

async function run() {
  let totalDeleted = 0;

  for (const { type, keyExpr } of typesToDedupe) {
    // scheduleCard/blogPost pass a full "\"key\": <expr>" projection since
    // their key isn't a single field; everything else is just a field name.
    const projection = keyExpr.startsWith('"key"') ? keyExpr : `"key": ${keyExpr}`;
    const docs = await client.fetch(
      `*[_type == $type]{ _id, _createdAt, ${projection} } | order(_createdAt asc)`,
      { type }
    );

    const seen = new Map<string, string>(); // key -> first _id kept
    const toDelete: string[] = [];

    for (const doc of docs as { _id: string; _createdAt: string; key: string | number | null }[]) {
      if (doc.key === null || doc.key === undefined) continue; // skip anything missing the key field entirely
      if (seen.has(String(doc.key))) {
        toDelete.push(doc._id);
      } else {
        seen.set(String(doc.key), doc._id);
      }
    }

    if (toDelete.length === 0) {
      console.log(`${type}: no duplicates found (${docs.length} document(s)).`);
      continue;
    }

    console.log(`${type}: found ${toDelete.length} duplicate(s) out of ${docs.length}, deleting...`);
    // Sanity allows deleting in batches via a transaction.
    const tx = client.transaction();
    for (const id of toDelete) tx.delete(id);
    await tx.commit();
    totalDeleted += toDelete.length;
    console.log(`  Deleted. ${seen.size} unique ${type}(s) remain.`);
  }

  console.log(`\nDone! Deleted ${totalDeleted} duplicate document(s) total. Visit /studio to confirm.`);
}

run().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
