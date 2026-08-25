"use client";

import FadeImage from "./FadeImage";
import { useLightbox } from "./LightboxContext";

// Real hierarchy instead of a uniform "featured vs. small" split - one
// hero, a tall companion beside it, two supporting mid-size images, three
// smaller images with a deliberate empty fourth cell (negative space, not a
// bug), then one final full-bleed image as a closing statement.
const TILE_LAYOUT = [
  { span: "md:col-span-3", height: "md:h-[460px]" }, // 0 - hero
  { span: "md:col-span-1", height: "md:h-[460px]" }, // 1 - tall companion
  { span: "md:col-span-2", height: "md:h-[240px]" }, // 2 - supporting
  { span: "md:col-span-2", height: "md:h-[240px]" }, // 3 - supporting
  { span: "md:col-span-1", height: "md:h-[170px]" }, // 4 - small
  { span: "md:col-span-1", height: "md:h-[170px]" }, // 5 - small
  { span: "md:col-span-1", height: "md:h-[170px]" }, // 6 - small (4th column of this row left empty on purpose)
  { span: "md:col-span-4", height: "md:h-[440px]" }, // 7 - closing full-bleed image
];

// Mobile gets its own hierarchy on the same 2-column grid - not the desktop
// pattern shrunk, and not a uniform grid of equal tiles either. Hero opens
// full-width, then a supporting pair, a full-width mid image, another
// supporting pair, one small tile with its partner cell left empty
// (intentional, not a bug), then a full-width closer.
const MOBILE_TILE_LAYOUT = [
  { span: "col-span-2", height: "h-[220px]" }, // 0 - hero
  { span: "col-span-1", height: "h-[150px]" }, // 1
  { span: "col-span-1", height: "h-[150px]" }, // 2
  { span: "col-span-2", height: "h-[190px]" }, // 3 - mid
  { span: "col-span-1", height: "h-[150px]" }, // 4
  { span: "col-span-1", height: "h-[150px]" }, // 5
  { span: "col-span-1", height: "h-[130px]" }, // 6 - deliberate half-empty row
  { span: "col-span-2", height: "h-[240px]" }, // 7 - closer
];

function ViewIndicator() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-1 font-switzer text-xs font-semibold uppercase tracking-widest text-cta opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:bottom-4 md:left-4"
    >
      View
      <span>→</span>
    </span>
  );
}

export default function Gallery({ images }: { images: string[] }) {
  const { openLightbox } = useLightbox();

  return (
    // The negative-margin overlap into the hero's feather is pulled way
    // back (-mt-10/-mt-14 -> -mt-4/-mt-6) and the top padding pushed up
    // (pt-12/pt-16 -> pt-20/pt-32), so the net clear space below the hero
    // lands at roughly 51px on mobile and 83px on desktop - inside the
    // site's "section gap" band (80-120px desktop, 48-72px mobile) instead
    // of the ~6px this previously netted out to, which read as the gallery
    // running straight into the hero. A small negative margin still
    // survives on purpose - just enough to graze the very end of the
    // hero's feather so the transition still reads as connected, not two
    // unrelated blocks with a gap between them. Bottom padding added
    // (previously none) so the boundary into "Who we are" below gets the
    // same treatment rather than depending entirely on that section's own
    // top padding.
    <section className="relative z-20 -mt-4 px-6 pb-10 pt-20 md:-mt-6 md:px-16 md:pb-16 md:pt-32">
      {/* Small editorial intro - eyebrow + one quiet supporting line,
          unchanged in typography/colour. Gap below opened up (mb-6/mb-8 ->
          mb-10/mb-16, roughly 32px mobile / 51px desktop) so the
          description reads as introducing the photography instead of the
          grid starting almost immediately underneath it. */}
      <div className="relative z-10 mb-10 flex flex-col gap-1 md:mb-16">
        <p className="font-switzer text-xs font-semibold uppercase tracking-[0.25em] text-cta md:text-sm">
          The Touchdown Experience
        </p>
        <p className="font-switzer text-base font-light text-white/70 md:text-lg">
          Freediving in Dahab, captured beneath the surface.
        </p>
      </div>

      {/* gap-1 (4px) on a navy-filled grid (was gap-0) so a thin seam of
          the site's own navy shows between photographs instead of them
          merging into one solid block. Outer corners stay rounded via
          overflow-hidden on this wrapper; individual tiles are square so
          the seam reads clean. Desktop mixes 2-col "feature" tiles with
          1-col tiles for an editorial rhythm instead of a uniform 4x2
          grid; mobile stays a plain, compact 2-column grid throughout (no
          feature tiles) so it doesn't turn into a long uneven stack. */}
      <div className="relative z-10 grid grid-cols-2 gap-1 overflow-hidden rounded-lg bg-dark-ocean-blue md:grid-cols-4">
        {images.map((src, i) => {
          const tile = TILE_LAYOUT[i];
          const mobileTile = MOBILE_TILE_LAYOUT[i];
          return (
          <button
            key={i}
            type="button"
            onClick={() => openLightbox(images, i)}
            aria-label={`View photo ${i + 1} of ${images.length}`}
            className={`group relative cursor-zoom-in overflow-hidden ${
              mobileTile ? `${mobileTile.span} ${mobileTile.height}` : "col-span-1 h-[160px]"
            } ${tile ? `${tile.span} ${tile.height}` : ""}`}
          >
            <FadeImage
              src={src}
              alt=""
              wrapperClassName="h-full w-full"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
            {/* Restrained hover: a soft dark wash + small cyan "View ->"
                label (was hover:scale-110 with no overlay or label at all)
                - the photograph stays dominant, this just confirms the
                tile is clickable. */}
            <div className="absolute inset-0 bg-dark-ocean-blue/0 transition-colors duration-300 group-hover:bg-dark-ocean-blue/25" />
            {/* Plate number, always on (not hover-gated) - the same thin
                numeral language used in How It Works and Pricing, applied
                here as a photography-book caption rather than a UI badge,
                so the grid reads as a numbered set of plates instead of a
                bare image tile grid. */}
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-3 right-3 font-switzer text-xs font-light tabular-nums tracking-widest text-white/60 [text-shadow:0_1px_4px_rgba(0,0,0,0.5)] md:bottom-4 md:right-4"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <ViewIndicator />
          </button>
          );
        })}
      </div>
    </section>
  );
}
