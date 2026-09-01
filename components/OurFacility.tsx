"use client";

import { useState } from "react";
import Blob from "./Blob";
import Reveal from "./Reveal";
import FadeImage from "./FadeImage";
import { useLightbox } from "./LightboxContext";

// New section sitting between About Us and How It Works - the Blue Hole
// location and on-land amenities copy Francesca sent over. Matches the same
// centered eyebrow/heading/paragraph masthead pattern used by Team, Reviews,
// and FAQ (rather than About Us's own two-column photo layout). Heading,
// copy, and photos all come from Sanity (siteContent.facilityHeading/
// facilityCopy + the facilityPhoto document type) with hardcoded fallbacks,
// same pattern as the rest of the site - only the "The facility" eyebrow
// stays fixed here, matching how WhoWeAre's "About us" eyebrow is fixed too.

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

export default function OurFacility({
  heading,
  copy,
  images,
}: {
  heading: string;
  copy: string;
  images: string[];
}) {
  const { openLightbox } = useLightbox();
  const paragraphs = copy.split("\n").filter(Boolean);
  // Which photo is showing large up top - starts on the first image, moves
  // when a thumbnail below is clicked. Kept as plain index state rather
  // than tracking the src itself so it stays valid even if `images`
  // changes shape (e.g. a Sanity edit reorders the set).
  const [selected, setSelected] = useState(0);

  return (
    <section
      id="facility"
      className="relative flex flex-col items-center gap-10 px-6 py-20 md:px-16 scroll-mt-20"
    >
      {/* Anchored to this section's top-left corner, bled upward past its
          own top edge into How It Works above (this section renders after
          it in the DOM, so it naturally paints on top in the overlap
          zone). overflow-hidden dropped here for the same reason as About
          Us/How It Works - it was clipping the blur into a hard line right
          at the section boundary instead of letting it fade across the
          seam. opacity-40 brings it down from Blob's own baked-in 60%
          alpha (~24% effective), matching What You Get/Faq rather than
          sitting at full strength like About Us. */}
      <Blob className="top-[-120px] left-6 h-[380px] w-[380px] opacity-40" />
      <Reveal>
        <div className="relative z-10 flex max-w-3xl flex-col items-center gap-4 text-center">
          <p className="font-switzer text-xs font-semibold uppercase tracking-[0.25em] text-cta md:text-sm">
            The facility
          </p>
          <h2 className="font-switzer text-4xl font-extralight tracking-tight text-white md:text-6xl">
            {heading}
          </h2>
        </div>
      </Reveal>
      {/* Left-aligned at every width now (was md:text-center) - this is
          genuine multi-sentence, multi-paragraph body copy, not a tagline.
          Centering reads fine for a single short line but makes a real
          paragraph harder to scan back to its own left edge line after
          line; centering stays reserved for the eyebrow/heading above,
          which are short enough for it not to matter. */}
      <Reveal delay={80}>
        <div className="relative z-10 flex max-w-3xl flex-col gap-4 text-left font-switzer text-[15px] font-light leading-relaxed text-white/70">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </Reveal>

      {/* Featured photo + thumbnail strip (was a uniform NxN grid matching
          the main Gallery, then a featured photo + static supporting row) -
          now a real product-gallery pattern: every photo appears as a
          thumbnail below, clicking one swaps it into the large slot above
          (an index swap, not a navigation - the FadeImage `key` forces a
          clean remount per photo rather than fighting its own loaded
          state), and the currently-selected thumbnail gets a visible ring
          so the relationship between the two rows is obvious. The
          lightbox now lives on the featured photo alone - a thumbnail
          click selects, it doesn't jump straight to full-screen, so the
          two clicks do two different things instead of both opening the
          same modal. This also breaks the section out of the "centered
          heading + paragraph + even photo grid" shape it used to share
          with Water Day/Dry Day Schedule below - those stay genuine card
          grids (each tile is a distinct scheduled event with its own
          time/title), while this is one place, browsed from a few
          angles. Alt text is descriptive per photo (was alt="" on every
          tile, before the featured-row version). */}
      {images.length > 0 && (
        // Desktop only: hero photo on the left, thumbnails stacked in a
        // column on the right (was featured-photo-on-top + thumbnail-row-
        // below, each with its own overlap treatment). No overlap on the
        // column now (was pulled up over each other with -mt-10) - a plain
        // gap-2 stack instead, and md:items-stretch makes the column match
        // the photo's full height, with every tile flex-1 so they divide
        // that height evenly regardless of how many there are. Sized with
        // 5 tiles in mind (aspect-video would make 5 stacked tiles taller
        // than the photo; flex-1 fill avoids that by construction). Mobile
        // is completely unchanged: still the original stacked layout,
        // photo on top, thumbnail row below with its own horizontal
        // overlap - there's no width to spare there for a side-by-side
        // split, so the switch to md:flex-row is the only thing gating
        // this.
        //
        // mt-6 md:mt-10 added on top of the section's own gap-10 - the
        // paragraph above is dense multi-line body copy, and gap-10 alone
        // (the same gap used between the eyebrow and the heading above it)
        // read as too tight a jump from "last line of text" to "top edge
        // of a big photo." This only pushes the photo block down, so the
        // eyebrow/heading/paragraph stack above keeps its own tighter
        // rhythm.
        <Reveal delay={140} className="relative z-10 mt-6 flex w-full flex-col gap-2 md:mt-10 md:flex-row md:items-stretch md:gap-4">
          {/* aspect-video (16:9) on both the featured photo and every
              thumbnail, so the whole gallery shares one photo ratio at any
              width. md:flex-1 lets the photo take whatever width the
              thumbnail column (fixed at md:w-56) doesn't need. */}
          <button
            type="button"
            onClick={() => openLightbox(images, selected)}
            aria-label={`View facility photo ${selected + 1} of ${images.length}, full size`}
            className="group relative aspect-video w-full cursor-zoom-in overflow-hidden rounded-lg md:flex-1"
          >
            <FadeImage
              key={images[selected]}
              src={images[selected]}
              alt={`Touchdown Freediving's training facility in Dahab, photo ${selected + 1} of ${images.length}`}
              wrapperClassName="h-full w-full"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-dark-ocean-blue/0 transition-colors duration-300 group-hover:bg-dark-ocean-blue/25" />
            <ViewIndicator />
          </button>
          {images.length > 1 && (
            // Mobile: unchanged horizontal fanned row, each tile sharing
            // the row's width equally (flex-1) and pulled left over its
            // neighbour (-ml-6). Desktop: a fixed-width column (w-56, no
            // overlap - gap-2 instead) where every tile is flex-1 and
            // aspect-auto (was aspect-video), so the tiles divide the
            // column's full height - stretched by the parent's
            // md:items-stretch to match the photo - evenly between them
            // instead of each keeping its own 16:9 crop. z-index still
            // climbs with index so the selected tile stays on top of its
            // ring/hover state, even though tiles no longer overlap each
            // other physically.
            <div className="relative z-20 flex w-full md:w-56 md:flex-none md:flex-col md:gap-2">
              {images.map((src, i) => (
                <button
                  key={`${i}-${src}`}
                  type="button"
                  onClick={() => setSelected(i)}
                  aria-label={`Show facility photo ${i + 1} of ${images.length}`}
                  aria-pressed={i === selected}
                  style={{ zIndex: i === selected ? images.length + 1 : i }}
                  className={`group/thumb relative aspect-video flex-1 overflow-hidden rounded-lg border-2 border-dark-ocean-blue shadow-lg shadow-black/40 transition duration-200 hover:z-[999] md:aspect-auto md:w-full ${
                    i > 0 ? "-ml-6 md:ml-0" : ""
                  } ${i === selected ? "ring-2 ring-cta" : ""}`}
                >
                  <FadeImage
                    src={src}
                    alt={`Touchdown Freediving facility, thumbnail ${i + 1} of ${images.length}`}
                    wrapperClassName="h-full w-full"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </Reveal>
      )}
    </section>
  );
}
