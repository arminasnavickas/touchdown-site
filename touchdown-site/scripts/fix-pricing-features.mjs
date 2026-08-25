// One-off fix: several pricingTier documents in Sanity have "features"
// stored as plain strings (e.g. "6 lectures") instead of the {count, label}
// objects the pricingFeature schema and the site's code expect. This
// overwrites the features array on all four pricing tiers with correctly
// shaped objects, matching the site's original content.
//
// Usage: node scripts/fix-pricing-features.mjs
// Requires .env.local with NEXT_PUBLIC_SANITY_PROJECT_ID and
// SANITY_WRITE_TOKEN (same as scripts/seed-missing.ts).

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
  console.error("Missing SANITY_WRITE_TOKEN. See scripts/seed-sanity.ts for how to generate one.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", token, useCdn: false });

const FEATURES_BY_TIER_NAME = {
  "Discovery day": [
    { count: "01", label: "Intro lecture" },
    { count: "01", label: "Dry session" },
    { count: "01", label: "Water session" },
    { count: "02", label: "Students per buoy" },
  ],
  "Freedom Flow": [
    { count: "04", label: "Lectures" },
    { count: "05", label: "Dry sessions" },
    { count: "05", label: "Water sessions" },
    { count: "02", label: "Students per buoy" },
  ],
  "Deep Mastery": [
    { count: "06", label: "Lectures" },
    { count: "12", label: "Dry sessions" },
    { count: "08", label: "Water sessions" },
    { count: "02", label: "Students per buoy" },
  ],
  "Ultimate Freediver": [
    { count: "12", label: "Lectures" },
    { count: "24", label: "Dry sessions" },
    { count: "16", label: "Water sessions" },
    { count: "02", label: "Students per buoy" },
  ],
};

function keyedFeatures(items) {
  return items.map((item, i) => ({
    _type: "pricingFeature",
    _key: `feature-${i}-${Math.random().toString(36).slice(2, 8)}`,
    count: item.count,
    label: item.label,
  }));
}

async function main() {
  const docs = await client.fetch(`*[_type == "pricingTier"]{_id, name}`);
  if (!docs?.length) {
    console.log("No pricingTier documents found.");
    return;
  }

  for (const doc of docs) {
    const features = FEATURES_BY_TIER_NAME[doc.name];
    if (!features) {
      console.warn(`  ⚠ No known features for tier "${doc.name}" (_id: ${doc._id}) — skipped.`);
      continue;
    }
    await client.patch(doc._id).set({ features: keyedFeatures(features) }).commit();
    console.log(`  ✓ Fixed "${doc.name}" (_id: ${doc._id}) — ${features.length} features set.`);
  }

  console.log("\nDone. Refresh the Studio and the live site (may take up to ~60s due to ISR) to confirm.");
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
