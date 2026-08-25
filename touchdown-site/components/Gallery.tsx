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
    // Restored to the original composition: no heading/intro copy at all,
    // and a strong negative top margin pulls the whole grid up into the
    // Hero's own fixed-height bottom edge (Hero is h-[500px]/md:h-[700px],
    // a plain pixel value, so this overlap stays exact regardless of root
    // font-size) so Gallery reads as a floating collage overlapping the
    // hero rather than its own separate, spaced-out section.
    <section className="relative z-20 -mt-16 px-6 md:-mt-24 md:px-16">
      {/* One consistent outer container: overflow-hidden + rounded-lg here
          is the ONLY rounding in the whole grid - individual tiles are
          plain rectangles with zero gap between them, so the 8 photos read
          as one continuous 4x2 (2x4 on mobile) composition rather than a
          set of separate cards. Every tile shares the same fixed height at
          each breakpoint, so all 8 are identical in size - no featured or
          larger tiles. shadow-xl separates the floating grid from the hero
          photo it overlaps. */}
      <div className="relative z-10 grid grid-cols-2 gap-0 overflow-hidden rounded-lg shadow-xl md:grid-cols-4">
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
