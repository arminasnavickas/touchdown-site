// Migrates the site's existing hardcoded content (FAQ, team, pricing,
// reviews, hero/section copy) into your Sanity project as a starting point,
// so you don't have to re-type everything by hand in the Studio.
//
// HOW TO RUN THIS:
// 1. Make sure .env.local has NEXT_PUBLIC_SANITY_PROJECT_ID filled in
//    (see .env.local.example for how to get it).
// 2. Generate a write token: go to https://www.sanity.io/manage, open your
//    project → API → Tokens → "Add API token". Name it anything, set
//    permissions to "Editor", and copy the token (you only see it once).
// 3. Add it to .env.local as SANITY_WRITE_TOKEN=<paste it here>.
// 4. Run: npm run seed
//
// This only ever CREATES documents — it's safe to run once. If you run it
// again later it will just add duplicates, so only run it the first time.

import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@sanity/client";
import {
  fallbackFaq,
  fallbackTeam,
  fallbackPricing,
  fallbackReviews,
  fallbackSiteContent,
  fallbackBlogPosts,
  fallbackScheduleDays,
  fallbackWaterDayCards,
  fallbackDryDayCards,
  fallbackWhatYouGet,
  fallbackHowItWorksSteps,
  fallbackGalleryImages,
  fallbackHeroSlides,
  fallbackPrivacyPolicy,
  fallbackTermsAndConditions,
} from "../lib/content";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID. Fill in .env.local first (see .env.local.example)."
  );
  process.exit(1);
}
if (!token) {
  console.error(
    "Missing SANITY_WRITE_TOKEN. See the instructions at the top of this file for how to generate one."
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

// Best-effort image upload: these photo URLs point at temporary Figma export
// links which may have already expired. If a fetch fails, we log a warning
// and create the document without a photo — you can drag a real photo in
// through the Studio afterwards.
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

async function seed() {
  console.log("Seeding Site Content...");
  await client.createOrReplace({
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

  console.log("Seeding FAQ items...");
  for (const [i, item] of fallbackFaq.entries()) {
    await client.create({ _type: "faqItem", ...item, order: i });
  }

  console.log("Seeding team members (fetching photos, this may take a moment)...");
  for (const [i, member] of fallbackTeam.entries()) {
    const photo = await uploadImageFromUrl(member.image, member.name);
    await client.create({
      _type: "teamMember",
      name: member.name,
      bio: member.bio,
      fullBio: member.fullBio,
      qualifications: member.qualifications,
      records: member.records,
      instagram: member.instagram,
      website: member.website,
      order: i,
      ...(photo ? { photo } : {}),
    });
  }

  console.log("Seeding pricing tiers...");
  for (const [i, tier] of fallbackPricing.entries()) {
    await client.create({ _type: "pricingTier", ...tier, order: i });
  }

  console.log("Seeding reviews (fetching photos, this may take a moment)...");
  for (const [i, review] of fallbackReviews.entries()) {
    const photo = await uploadImageFromUrl(review.image, review.name);
    await client.create({
      _type: "review",
      name: review.name,
      role: review.role,
      rating: review.rating,
      quote: review.quote,
      order: i,
      ...(photo ? { photo } : {}),
    });
  }

  console.log("Seeding authors (fetching photos, this may take a moment)...");
  const authorIds = new Map<string, string>();
  const uniqueAuthors = new Map<string, string | null>();
  for (const post of fallbackBlogPosts) {
    if (post.author && !uniqueAuthors.has(post.author.name)) {
      uniqueAuthors.set(post.author.name, post.author.photo);
    }
  }
  for (const [name, photoUrl] of uniqueAuthors) {
    const photo = photoUrl ? await uploadImageFromUrl(photoUrl, name) : undefined;
    const doc = await client.create({
      _type: "author",
      name,
      ...(photo ? { photo } : {}),
    });
    authorIds.set(name, doc._id);
  }

  console.log("Seeding blog posts (fetching cover photos, this may take a moment)...");
  // Adds _key to every Portable Text block (and its children spans) - array
  // items without _key trigger Sanity's "missing keys" warning in the
  // Studio, same issue hit earlier with Privacy Policy's sections array.
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

  console.log("Seeding training rhythm days...");
  for (const [i, day] of fallbackScheduleDays.entries()) {
    await client.create({ _type: "scheduleDay", ...day, order: i });
  }

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

  console.log("Seeding \"What you get\" items...");
  for (const [i, item] of fallbackWhatYouGet.entries()) {
    await client.create({ _type: "whatYouGetItem", ...item, order: i });
  }

  console.log("Seeding \"How it works\" steps (fetching photos, this may take a moment)...");
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

  console.log("Seeding gallery images (fetching photos, this may take a moment)...");
  for (const [i, src] of fallbackGalleryImages.entries()) {
    const image = await uploadImageFromUrl(src, `Gallery image ${i + 1}`);
    await client.create({ _type: "galleryImage", order: i, ...(image ? { image } : {}) });
  }

  console.log("Seeding hero slides (fetching photos, this may take a moment)...");
  for (const [i, src] of fallbackHeroSlides.entries()) {
    const image = await uploadImageFromUrl(src, `Hero slide ${i + 1}`);
    await client.create({ _type: "heroSlide", order: i, ...(image ? { image } : {}) });
  }

  console.log("Seeding Privacy Policy...");
  await client.createOrReplace({
    _id: "privacyPolicy",
    _type: "privacyPolicy",
    ...fallbackPrivacyPolicy,
    sections: fallbackPrivacyPolicy.sections.map((section, i) => ({
      _key: `section-${i}`,
      ...section,
    })),
  });

  console.log("Seeding Terms & Conditions...");
  await client.createOrReplace({
    _id: "termsAndConditions",
    _type: "termsAndConditions",
    ...fallbackTermsAndConditions,
    sections: fallbackTermsAndConditions.sections.map((section, i) => ({
      _key: `section-${i}`,
      ...section,
    })),
  });

  console.log("\nDone! Visit /studio to see and edit your content.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
