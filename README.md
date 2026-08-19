# Touchdown site

Next.js 14 (App Router) + Tailwind scaffold, built from the "Touch Down" Figma
file (key: WwArAo7sVhZAhdPzqR92q5).

## Setup

```
npm install
npm run dev
```

## Status

All 10 sections from the Figma desktop frame are built and wired into
app/page.tsx in order, plus site-wide Navigation and Footer wired into
app/layout.tsx:

- [x] Navigation — components/Navigation.tsx
- [x] Hero — components/Hero.tsx
- [x] Photo gallery (8-image grid, below Hero) — components/Gallery.tsx
- [x] Who we are — components/WhoWeAre.tsx
- [x] How it works — components/HowItWorks.tsx
- [x] Training Rhythm — components/TrainingRhythm.tsx
- [x] Water Day Schedule — components/WaterDaySchedule.tsx
- [x] Dry Day Schedule — components/DryDaySchedule.tsx (shares components/ScheduleCard.tsx with Water Day)
- [x] Pricing — components/Pricing.tsx
- [x] Meet our team — components/MeetOurTeam.tsx
- [x] Reviews — components/Reviews.tsx
- [x] FAQ — components/Faq.tsx (accordion, client component)
- [x] Footer — components/Footer.tsx
- [x] CMS wiring (Sanity)
- [ ] Merch/ecommerce (Shopify headless via Storefront API)

## Connecting the CMS (Sanity)

The site works today with hardcoded content (see `lib/content.ts`) — you
don't need to do anything to keep it running as-is. To make FAQ, team,
pricing, reviews, and hero/section copy editable through a real CMS:

1. Create a free account at https://www.sanity.io/manage and a new project.
2. Copy `.env.local.example` to `.env.local` and paste in your Project ID
   (shown on the project dashboard). Leave the dataset as `production`
   unless you changed it.
3. `npm run dev`, then visit `/studio` — that's your CMS, logged in with
   your Sanity account.
4. Optional but recommended: migrate the site's existing content into
   Sanity automatically instead of re-typing it. Generate a write token
   (sanity.io/manage → your project → API → Tokens → Add API token →
   "Editor" permission), add it to `.env.local` as `SANITY_WRITE_TOKEN`,
   then run `npm run seed` once. Team/review photos are fetched from their
   current temporary Figma URLs during seeding — if any have expired by
   the time you run it, that item is created without a photo and a
   warning is printed so you can add the photo manually in the Studio.
5. Every page load fetches fresh content from Sanity (falling back to the
   hardcoded content in `lib/content.ts` automatically if Sanity is ever
   unreachable or not yet connected — nothing can break the live site).

Schemas live in `sanity/schemaTypes/`. Editable fields, per content type:
- **Site Content** (singleton) — hero headline/subcopy, and the heading/
  kicker text for Who we are, How it works, Pricing, Team, Reviews.
- **FAQ Item** — question, answer, display order.
- **Team Member** — name, photo, bio, records line, display order.
- **Pricing Tier** — name, duration, price, features list, bonus line,
  quote, "Most popular" flag, display order.
- **Review** — name, role, photo, rating, quote, display order.
- **Blog Post** — title, slug, category, excerpt, cover image, author,
  published date, rich-text body (paragraphs, headings, images, links,
  lists) via Sanity's Portable Text editor. Listing at `/blog` (with a
  featured hero post, category filter pills, and reading-time estimates),
  individual posts at `/blog/[slug]` (with an auto-generated table of
  contents from h2/h3 headings, related articles by category, and
  previous/next navigation). Ships with 5 realistic placeholder posts
  across different categories so the page isn't empty and every feature
  above has something to demonstrate it — delete them once real posts
  exist.

## Color system

| Token | Hex | Role |
|---|---|---|
| `dark-ocean-blue` | #023048 | Primary — headlines, primary buttons, deep-water backgrounds |
| `horizon` | #127BB5 | Secondary — links, active states, mid-depth accents |
| `aquatic` | #65CEE6 | Accent — highlights, hover states (use sparingly on dark) |
| `navy` | #052962 | Support — dark UI surfaces, footers, night-dive contexts |
| `danish-blue` | #8AACAF | Neutral — muted text, borders, disabled states |

## SEO & social sharing

Favicon, Open Graph tags, Twitter card, sitemap.xml, and robots.txt are all
wired in (see app/icon.svg, app/opengraph-image.tsx, app/layout.tsx,
app/sitemap.ts, app/robots.ts). The share-preview image (what shows up when
a link is posted on WhatsApp/Twitter/etc.) is generated automatically from
code, not a static file — edit app/opengraph-image.tsx to change it.

**Important:** these all currently point at a placeholder domain,
`https://touchdown-space.com` — update it in `app/layout.tsx`
(`metadataBase` and the `openGraph.url` field), `app/sitemap.ts`, and
`app/robots.ts` once you know the real domain this will be deployed to.

## Known TODOs

- **Page background is now #003354 with scattered light-blue blobs**
  (components/PageBlobs.tsx), matching the original Figma canvas which had
  ~5 blob vectors scattered down the full page. Sections that already have
  their own solid background (Hero, Training Rhythm, both schedules, FAQ,
  Footer) sit on top and cover the blobs where they overlap — that's
  expected. Headings in Who we are / How it works / Pricing / Meet our
  team were flipped from dark to white text to stay readable against the
  new dark page background.
- **CTA buttons now use `bg-cta` (#00BFFF)**, measured directly from a
  reference screenshot — the earlier `bg-horizon` was the wrong color.
  All "Book in" style buttons are also now a consistent px-6 py-3 size.
- **Big fix batch (latest pass):** Gallery now overlaps the hero bottom
  edge with fresh images; Who we are is now a centered max-width block;
  all CTAs are 6px border radius (not pills) with bigger padding; How it
  works / Pricing / Reviews cards now use the exact Figma gradient
  (white 24.83% → rgba(208,235,242,0.1) 98.162%) instead of the wrong
  aquatic tint; How it works cards have their icons back; Water/Dry Day
  Schedule time badges are real text + a clock icon now instead of a
  fragile image, and cards no longer fight the grid's equal gaps; team
  photos refreshed; Reviews no longer scrolls horizontally — all 5 show
  in a wrapping 2-column grid; footer rebuilt with flex-wrap instead of
  a rigid 6-column grid, which was squeezing the logo (Tailwind's base
  styles cap all `<img>` width to 100%, so a fixed height + narrow grid
  column was distorting it).
- **Nav and footer social/nav links go to `#` placeholders.** The Figma file
  didn't have real URLs attached to nav items or social icons — wire up
  real hrefs in components/Navigation.tsx and components/Footer.tsx.
  Icons (WhatsApp, Telegram, envelope, Instagram, globe, Facebook) are
  hand-drawn inline SVGs rather than the Figma exports, specifically so
  they don't depend on temporary asset URLs and break like the hero
  images did.
- **Nav had a duplicate "Reviews" link in the Figma file** — deduped to one.
- **All image assets were temporary Figma URLs** (expire ~7 days from when
  they were exported) — now fixed. Run `npm run migrate-images` once from
  your own machine (not from within a sandboxed tool — it needs real
  internet access to figma.com) to download all ~41 remaining images
  permanently into `/public/images` and automatically rewrite every
  component/content reference to use them. Safe to re-run; anything that
  fails (an already-expired URL) is skipped with a warning rather than
  breaking the build, and the site keeps working off the old temp URL for
  that one item until it's fixed. Images are automatically resized and
  compressed during migration (portraits capped at 900px wide, landscape
  shots at 1600px, ~80% JPEG quality) — no separate step needed. If you
  ever add a photo to `/public/images` some other way and it's larger
  than it needs to be, run `npm run optimize-images` to compress
  everything already in that folder in place.
- **FAQ answers are mostly placeholder text.** Only the first FAQ item
  ("Which package is right for me?") had real answer copy in the Figma file —
  the other 6 questions were shown collapsed with no answer text to pull.
  Fill in real answers in components/Faq.tsx.
- **Team member social icons are decorative, not linked.** The Figma file
  had icon graphics next to each name but no URLs attached — wire up real
  profile links in components/MeetOurTeam.tsx if wanted.
- **Reviews section may have more reviewers than the 5 pulled from Figma** —
  a reference screenshot showed additional names (Aaron Fisher, Vika
  Palamarchuk, Mark Kirurin) not present in the Figma file when it was
  pulled. Worth checking with Gus whether the live site has newer review
  content to add.
- **Reviews section uses `line-clamp-3` + a "Read more" button that doesn't
  do anything yet** — the original Figma had the same truncated-text
  pattern but no interaction wired (it's a static export). Hook up a
  modal/expand if you want it functional.
