"use client";

import FadeImage from "./FadeImage";
import { useLightbox } from "./LightboxContext";

// Which of the 8 images get the larger "feature" treatment on desktop - the
// strongest action/training shots (divers on the line, diver at the reef,
// deep diver beneath the sun, the red-suited freediver). Everything else
// (including the dolphin shot, whose documentary/wildlife style reads
// differently from the rest of the underwater sports photography) sits in
// the smaller row in between, rather than every image competing at the same
// scale.
const FEATURED_INDICES = new Set([0, 1, 6, 7]);

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

      {/* gap-1 (4px) on a navy-filled grid (was gap-0) so a thin seam of
          the site's own navy shows between photographs instead of them
          merging into one solid block. Outer corners stay rounded via
          overflow-hidden on this wrapper; individual tiles are square so
          the seam reads clean. Desktop mixes 2-col "feature" tiles with
          1-col tiles for an editorial rhythm instead of a uniform 4x2
          grid; mobile stays a plain, compact 2-column grid throughout (no
          feature tiles) so it doesn't turn into a long uneven stack. */}
      <div className="relative z-10 grid grid-cols-2 gap-1 overflow-hidden rounded-lg bg-dark-ocean-blue md:grid-cols-4">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => openLightbox(images, i)}
            aria-label={`View photo ${i + 1} of ${images.length}`}
            className={`group relative h-[160px] cursor-zoom-in overflow-hidden md:h-[190px] ${
              FEATURED_INDICES.has(i) ? "md:col-span-2 md:h-[380px]" : ""
            }`}
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
            <ViewIndicator />
          </button>
        ))}
      </div>
    </section>
  );
}
