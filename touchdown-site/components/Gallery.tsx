"use client";

import FadeImage from "./FadeImage";
import { useLightbox } from "./LightboxContext";

// LOCKED LAYOUT - approved reference: a clean, uniform 4x2 grid (2x4 on
// mobile), every tile the same size, no featured/larger tiles, no gap
// between images, rounded corners only on the gallery's own outer edge.
// Do not reintroduce a masonry/editorial hierarchy here without an explicit
// new instruction.

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
    // Overlap with the hero above brought way down (was -mt-24/-mt-32, a
    // near-full pull into the hero's own h-24/h-32 bottom feather) and
    // paired with real top padding (previously none) - the old version
    // pulled the eyebrow/description up into the hero image itself with no
    // breathing room of its own, which is what made the heading read as
    // cramped/disconnected rather than as its own line of hierarchy. Now
    // the pull only grazes the very end of the hero's feather (a small,
    // still-connected transition) and the padding gives the eyebrow a
    // consistent ~48-64px of clear space below that, so it's always
    // sitting on plain background, never on the photograph.
    <section className="relative z-20 -mt-10 px-6 pt-12 md:-mt-14 md:px-16 md:pt-16">
      {/* Small editorial intro - eyebrow + one quiet supporting line,
          unchanged in typography/colour. Gap below tightened to a
          controlled 24px/32px (was mb-4/mb-6, 16px/24px) so the gallery
          starts shortly after the description instead of drifting further
          down the page. */}
      <div className="relative z-10 mb-6 flex flex-col gap-1 md:mb-8">
        <p className="font-switzer text-xs font-semibold uppercase tracking-[0.25em] text-cta md:text-sm">
          The Touchdown Experience
        </p>
        <p className="font-switzer text-base font-light text-white/70 md:text-lg">
          Freediving in Dahab, captured beneath the surface.
        </p>
      </div>

      {/* One consistent outer container: overflow-hidden + rounded-lg here
          is the ONLY rounding in the whole grid - individual tiles are
          plain rectangles with zero gap between them, so the 8 photos read
          as one continuous 4x2 (2x4 on mobile) composition rather than a
          set of separate cards. Every tile shares the same fixed height at
          each breakpoint, so all 8 are identical in size - no featured or
          larger tiles. */}
      <div className="relative z-10 grid grid-cols-2 gap-0 overflow-hidden rounded-lg md:grid-cols-4">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => openLightbox(images, i)}
            aria-label={`View photo ${i + 1} of ${images.length}`}
            className="group relative h-[160px] cursor-zoom-in overflow-hidden md:h-[190px]"
          >
            <FadeImage
              src={src}
              alt=""
              wrapperClassName="h-full w-full"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
            {/* Restrained hover: a soft dark wash + small cyan "View ->"
                label - the photograph stays dominant, this just confirms
                the tile is clickable. Hover-only, so it doesn't change the
                grid's static appearance. */}
            <div className="absolute inset-0 bg-dark-ocean-blue/0 transition-colors duration-300 group-hover:bg-dark-ocean-blue/25" />
            <ViewIndicator />
          </button>
        ))}
      </div>
    </section>
  );
}
