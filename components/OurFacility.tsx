"use client";

import { useEffect, useRef, useState } from "react";
import Blob from "./Blob";
import Reveal from "./Reveal";
import FadeImage from "./FadeImage";
import { useLightbox } from "./LightboxContext";
import type { SitePhoto } from "@/lib/content";

// New section sitting between About Us and How It Works - the Blue Hole
// location and on-land amenities copy Francesca sent over. Matches the same
// centered eyebrow/heading/paragraph masthead pattern used by Team, Reviews,
// and FAQ (rather than About Us's own two-column photo layout). Heading,
// copy, and photos all come from Sanity (siteContent.facilityHeading/
// facilityCopy + the facilityPhoto document type) with hardcoded fallbacks,
// same pattern as the rest of the site - only the "The facility" eyebrow
// stays fixed here, matching how WhoWeAre's "About us" eyebrow is fixed too.

export default function OurFacility({
  heading,
  copy,
  images,
}: {
  heading: string;
  copy: string;
  images: SitePhoto[];
}) {
  const { openLightbox } = useLightbox();
  const urls = images.map((image) => image.url);
  const paragraphs = copy.split("\n").filter(Boolean);
  // Which photo is showing large up top - starts on the first image, moves
  // when a thumbnail below is clicked. Kept as plain index state rather
  // than tracking the src itself so it stays valid even if `images`
  // changes shape (e.g. a Sanity edit reorders the set).
  const [selected, setSelected] = useState(0);
  const count = images.length;
  const goPrev = () => setSelected((i) => (i - 1 + count) % count);
  const goNext = () => setSelected((i) => (i + 1) % count);
  const onArrowKeys = (e: React.KeyboardEvent) => {
    if (count < 2) return;
    if (e.key === "ArrowLeft") goPrev();
    if (e.key === "ArrowRight") goNext();
  };

  // Keep the selected thumbnail visible inside the (desktop) scrolling
  // column by scrolling the column itself - scrollIntoView would also
  // scroll the page.
  const thumbColRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    const col = thumbColRef.current;
    const el = thumbRefs.current[selected];
    if (!col || !el || col.scrollHeight <= col.clientHeight) return;
    col.scrollTo({
      top: el.offsetTop - col.clientHeight / 2 + el.clientHeight / 2,
      behavior: "smooth",
    });
  }, [selected]);

  return (
    <section
      id="facility"
      className="relative flex flex-col items-center gap-10 px-6 py-[40px] md:px-16 scroll-mt-20"
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
      <Blob className="top-[-180px] left-6 h-[380px] w-[380px] opacity-40" />
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
        // keeps the original stacked layout (photo on top, thumbnail row
        // below) but no longer overlaps either - was fanned with -ml-6,
        // now the same plain gap-2 spacing as the desktop column, just
        // laid out as a row instead of a column.
        //
        // mt-6 md:mt-10 added on top of the section's own gap-10 - the
        // paragraph above is dense multi-line body copy, and gap-10 alone
        // (the same gap used between the eyebrow and the heading above it)
        // read as too tight a jump from "last line of text" to "top edge
        // of a big photo." This only pushes the photo block down, so the
        // eyebrow/heading/paragraph stack above keeps its own tighter
        // rhythm.
        <Reveal
          delay={140}
          className="relative z-10 mt-6 flex w-full flex-col gap-2 md:mt-10 md:h-[85vh] md:flex-row md:items-stretch md:gap-4"
        >
          {/* Desktop: the whole gallery is capped to 85% of the screen
              height (same as the lightbox photo) so photo, arrows and thumbnails are all
              visible at once - it used to be a full-width 16:9 photo that
              ran taller than the viewport. Mobile keeps aspect-video. */}
          <div
            className="relative aspect-video w-full md:aspect-auto md:min-w-0 md:flex-1"
            onKeyDown={onArrowKeys}
          >
            <button
              type="button"
              onClick={() => openLightbox(urls, selected)}
              aria-label={`View facility photo ${selected + 1} of ${count}, full size`}
              className="group absolute inset-0 cursor-zoom-in overflow-hidden rounded-lg"
            >
              <FadeImage
                key={images[selected].url}
                src={images[selected].url}
                alt={`Touchdown Freediving's training facility in Dahab, photo ${selected + 1} of ${count}`}
                wrapperClassName="h-full w-full"
                className="h-full w-full object-cover"
                style={{ objectPosition: images[selected].position }}
              />
            </button>
            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous photo"
                  className="absolute left-4 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-dark-ocean-blue/40 text-white backdrop-blur-md transition hover:bg-dark-ocean-blue/60 md:flex"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-6">
                    <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next photo"
                  className="absolute right-4 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-dark-ocean-blue/40 text-white backdrop-blur-md transition hover:bg-dark-ocean-blue/60 md:flex"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-6">
                    <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <span
                  aria-hidden
                  className="pointer-events-none absolute bottom-4 right-4 rounded-full bg-dark-ocean-blue/50 px-3 py-1 font-switzer text-xs font-medium tabular-nums text-white backdrop-blur-md"
                >
                  {String(selected + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                </span>
              </>
            )}
          </div>
          {count > 1 && (
            // Mobile: horizontal row of equal tiles. Desktop: fixed width
            // column matching the photo's height that scrolls inside
            // itself, fixed 16:9 tiles, inactive ones dimmed, the selected
            // one gets a thin inset ring (inset so the column's overflow
            // never clips it).
            <div
              ref={thumbColRef}
              onKeyDown={onArrowKeys}
              className="relative z-20 flex w-full gap-2 md:min-h-0 md:w-48 md:flex-none md:flex-col md:overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {images.map((photo, i) => (
                <button
                  key={`${i}-${photo.url}`}
                  ref={(el) => {
                    thumbRefs.current[i] = el;
                  }}
                  type="button"
                  onClick={() => setSelected(i)}
                  aria-label={`Show facility photo ${i + 1} of ${count}`}
                  aria-pressed={i === selected}
                  className={`relative aspect-video flex-1 overflow-hidden rounded-lg transition duration-200 md:w-full md:flex-none ${
                    i === selected
                      ? "ring-2 ring-inset ring-white/80"
                      : "opacity-45 grayscale-[50%] hover:opacity-100 hover:grayscale-0"
                  }`}
                >
                  <FadeImage
                    src={photo.url}
                    alt={`Touchdown Freediving facility, thumbnail ${i + 1} of ${count}`}
                    wrapperClassName="h-full w-full"
                    className="h-full w-full object-cover"
                    style={{ objectPosition: photo.position }}
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
