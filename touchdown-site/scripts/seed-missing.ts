// Seeds ONLY what's currently missing from your Sanity project, without
// touching or duplicating anything that's already there. Checks the count
// of each content type first and only seeds it if zero exist:
//   1. Site Content (Hero, 404 page, footer, all section headings — this
//      is the one that covers "why can't I edit the Hero/404 image/text")
//   2. Author documents
//   3. Blog posts
//   4. Gallery images
//   5. Hero slides
//   6. Training Rhythm days
//   7. Water/Dry Day schedule cards
//   8. What You Get items
//   9. How It Works steps
// Also patches existing Team Member documents to add fullBio/qualifications
// (those fields didn't exist when Team Members were first seeded).
//
// Safe to run any number of times - nothing here duplicates existing data.
// If you've already run `npm run seed` more than once and ended up with
// duplicates, run `npm run dedupe` first to clean those up.
//
// Same setup as npm run seed: .env.local needs NEXT_PUBLIC_SANITY_PROJECT_ID
// and SANITY_WRITE_TOKEN. Run with: npm run seed-missing

import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@sanity/client";
import {
  fallbackTeam,
  fallbackBlogPosts,
  fallbackGalleryImages,
  fallbackHeroSlides,
  fallbackScheduleDays,
  fallbackWaterDayCards,
  fallbackDryDayCards,
  fallbackWhatYouGet,
  fallbackHowItWorksSteps,
  fallbackSiteContent,
} from "../lib/content";

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

async function uploadImageFromUrl(url: string, label: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const asset = await client.assets.upload("image", buffer);
    return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`  ⚠ Couldn't fetch photo for "${label}" (${message}). Add it manually in the Studio.`);
    return undefined;
  }
}

function keyedBlocks(body: unknown): unknown {
  if (typeof body === "string") {
    return [
      {
        _type: "block",
        _key: "block-0",
        style: "normal",
        children: [{ _type: "span", _key: "span-0", text: body, marks: [] }],
        markDefs: [],
      },
    ];
  }
  if (Array.isArray(body)) {
    return body.map((block: Record<string, unknown>, i: number) => ({
      ...block,
      _key: `block-${i}`,
      markDefs: block.markDefs ?? [],
      children: Array.isArray(block.children)
        ? block.children.map((child: Record<string, unknown>, j: number) => ({
            ...child,
            _key: `block-${i}-span-${j}`,
            marks: child.marks ?? [],
          }))
        : block.children,
    }));
  }
  return body;
}

async function run() {
  console.log("Checking what's already there...");

  const siteContentExists = (await client.fetch(`count(*[_id == "siteContent"])`)) as number;
  if (siteContentExists > 0) {
    console.log("  Site Content already exists — checking for any empty fields to backfill...");
    const existing = await client.fetch(`*[_id == "siteContent"][0]`);

    // Only fill in fields that are genuinely empty/missing on the live
    // document (undefined, null, empty string, or empty array). Anything
    // you've actually typed or edited - even if it's short - is left
    // completely alone.
    const isEmpty = (value: unknown) =>
      value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0);

    const patch: Record<string, unknown> = {};
    for (const [key, fallbackValue] of Object.entries(fallbackSiteContent)) {
      if (!isEmpty(existing?.[key])) continue; // real value already there, skip
      if (key === "footerAboutLinks" || key === "footerExperienceLinks" || key === "footerLegalLinks" || key === "headerNavLinks") {
        patch[key] = (fallbackValue as { id: string; label: string }[]).map((link, i) => ({
          _key: `link-${i}`,
          _type: "footerLink",
          ...link,
        }));
      } else if (key !== "whoWeAreImage" && key !== "notFoundImage") {
        // Image fields can't be backfilled this way (they need an actual
        // uploaded asset, not seeded from a local file path), so those are
        // deliberately skipped here - upload those manually in the Studio.
        patch[key] = fallbackValue;
      }
    }

    const fieldsToFill = Object.keys(patch);
    if (fieldsToFill.length === 0) {
      console.log("  Everything's already filled in — nothing to backfill.");
    } else {
      console.log(`  Backfilling ${fieldsToFill.length} empty field(s): ${fieldsToFill.join(", ")}`);
      await client.patch("siteContent").set(patch).commit();
      console.log("  Done.");
    }
  } else {
    console.log("Seeding Site Content (Hero, 404 page, footer, and all section headings)...");
    await client.create({
      _id: "siteContent",
      _type: "siteContent",
      ...fallbackSiteContent,
      footerAboutLinks: fallbackSiteContent.footerAboutLinks.map((link, i) => ({
        _key: `link-${i}`,
        _type: "footerLink",
        ...link,
      })),
      footerExperienceLinks: fallbackSiteContent.footerExperienceLinks.map((link, i) => ({
        _key: `link-${i}`,
        _type: "footerLink",
        ...link,
      })),
      footerLegalLinks: fallbackSiteContent.footerLegalLinks.map((link, i) => ({
        _key: `link-${i}`,
        _type: "footerLink",
        ...link,
      })),
      headerNavLinks: fallbackSiteContent.headerNavLinks.map((link, i) => ({
        _key: `link-${i}`,
        _type: "footerLink",
        ...link,
      })),
    });
  }

  const existingAuthorCount = (await client.fetch(`count(*[_type == "author"])`)) as number;
  const existingBlogPostCount = (await client.fetch(`count(*[_type == "blogPost"])`)) as number;

  if (existingAuthorCount > 0) {
    console.log(`  ${existingAuthorCount} author(s) already exist — skipping author seeding.`);
  }
  if (existingBlogPostCount > 0) {
    console.log(`  ${existingBlogPostCount} blog post(s) already exist — skipping blog post seeding.`);
  }

  const authorIds = new Map<string, string>();

  if (existingAuthorCount === 0) {
    console.log("Seeding authors (fetching photos, this may take a moment)...");
    const uniqueAuthors = new Map<string, string | null>();
    for (const post of fallbackBlogPosts) {
      if (post.author && !uniqueAuthors.has(post.author.name)) {
        uniqueAuthors.set(post.author.name, post.author.photo);
      }
    }
    for (const [name, photoUrl] of uniqueAuthors) {
      const photo = photoUrl ? await uploadImageFromUrl(photoUrl, name) : undefined;
      const doc = await client.create({ _type: "author", name, ...(photo ? { photo } : {}) });
      authorIds.set(name, doc._id);
    }
  } else {
    const existing = await client.fetch(`*[_type == "author"]{ _id, name }`);
    for (const a of existing as { _id: string; name: string }[]) authorIds.set(a.name, a._id);
  }

  if (existingBlogPostCount === 0) {
    console.log("Seeding blog posts (fetching cover photos, this may take a moment)...");
    for (const post of fallbackBlogPosts) {
      const coverImage = await uploadImageFromUrl(post.coverImage, post.title);
      const authorId = post.author ? authorIds.get(post.author.name) : undefined;
      await client.create({
        _type: "blogPost",
        title: post.title,
        slug: { _type: "slug", current: post.slug },
        category: post.category,
        excerpt: post.excerpt,
        ...(authorId ? { author: { _type: "reference", _ref: authorId } } : {}),
        publishedAt: post.publishedAt,
        body: keyedBlocks(post.body),
        ...(coverImage ? { coverImage } : {}),
      });
    }
  }

  console.log("Patching existing team members with fullBio/qualifications...");
  const existingMembers = await client.fetch(`*[_type == "teamMember"]{ _id, name }`);
  let patchedCount = 0;
  for (const existing of existingMembers as { _id: string; name: string }[]) {
    const match = fallbackTeam.find((m) => m.name === existing.name);
    if (!match) continue;
    await client
      .patch(existing._id)
      .set({ fullBio: match.fullBio, qualifications: match.qualifications })
      .commit();
    patchedCount++;
  }
  console.log(`  Patched ${patchedCount} team member(s).`);

  const galleryCount = (await client.fetch(`count(*[_type == "galleryImage"])`)) as number;
  if (galleryCount > 0) {
    console.log(`Gallery images: ${galleryCount} already exist — skipping.`);
  } else {
    console.log("Seeding gallery images (fetching photos, this may take a moment)...");
    for (const [i, src] of fallbackGalleryImages.entries()) {
      const image = await uploadImageFromUrl(src, `Gallery image ${i + 1}`);
      await client.create({ _type: "galleryImage", order: i, ...(image ? { image } : {}) });
    }
  }

  const heroSlideCount = (await client.fetch(`count(*[_type == "heroSlide"])`)) as number;
  if (heroSlideCount > 0) {
    console.log(`Hero slides: ${heroSlideCount} already exist — skipping.`);
  } else {
    console.log("Seeding hero slides (fetching photos, this may take a moment)...");
    for (const [i, src] of fallbackHeroSlides.entries()) {
      const image = await uploadImageFromUrl(src, `Hero slide ${i + 1}`);
      await client.create({ _type: "heroSlide", order: i, ...(image ? { image } : {}) });
    }
  }

  const scheduleDayCount = (await client.fetch(`count(*[_type == "scheduleDay"])`)) as number;
  if (scheduleDayCount > 0) {
    console.log(`Training Rhythm days: ${scheduleDayCount} already exist — skipping.`);
  } else {
    console.log("Seeding training rhythm days...");
    for (const [i, day] of fallbackScheduleDays.entries()) {
      await client.create({ _type: "scheduleDay", ...day, order: i });
    }
  }

  const scheduleCardCount = (await client.fetch(`count(*[_type == "scheduleCard"])`)) as number;
  if (scheduleCardCount > 0) {
    console.log(`Schedule cards: ${scheduleCardCount} already exist — skipping.`);
  } else {
    console.log("Seeding water day schedule cards (fetching photos, this may take a moment)...");
    for (const [i, card] of fallbackWaterDayCards.entries()) {
      const image = await uploadImageFromUrl(card.image, card.title);
      await client.create({
        _type: "scheduleCard",
        section: "Water day",
        title: card.title,
        copy: card.copy,
        time: card.time,
        order: i,
        ...(image ? { image } : {}),
      });
    }
    console.log("Seeding dry day schedule cards (fetching photos, this may take a moment)...");
    for (const [i, card] of fallbackDryDayCards.entries()) {
      const image = await uploadImageFromUrl(card.image, card.title);
      await client.create({
        _type: "scheduleCard",
        section: "Dry day",
        title: card.title,
        copy: card.copy,
        time: card.time,
        order: i,
        ...(image ? { image } : {}),
      });
    }
  }

  const whatYouGetCount = (await client.fetch(`count(*[_type == "whatYouGetItem"])`)) as number;
  if (whatYouGetCount > 0) {
    console.log(`What You Get items: ${whatYouGetCount} already exist — skipping.`);
  } else {
    console.log('Seeding "What you get" items...');
    for (const [i, item] of fallbackWhatYouGet.entries()) {
      await client.create({ _type: "whatYouGetItem", ...item, order: i });
    }
  }

  const howItWorksCount = (await client.fetch(`count(*[_type == "howItWorksStep"])`)) as number;
  if (howItWorksCount > 0) {
    console.log(`How It Works steps: ${howItWorksCount} already exist — skipping.`);
  } else {
    console.log('Seeding "How it works" steps (fetching photos, this may take a moment)...');
    for (const [i, step] of fallbackHowItWorksSteps.entries()) {
      const image = await uploadImageFromUrl(step.image, step.title);
      await client.create({
        _type: "howItWorksStep",
        title: step.title,
        paragraphs: step.paragraphs,
        order: i,
        ...(image ? { image } : {}),
      });
    }
  }

  console.log("\nDone! Visit /studio to see the new content.");
}

run().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
