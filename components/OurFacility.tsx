"use client";

import { useState } from "react";
import Blob from "./Blob";
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

  return (
    <section
      id="facility"
      className="relative flex flex-col items-center gap-10 px-6 py-[40px] md:px-16 md:py-16 scroll-mt-20"
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
      {/* Three column layout on desktop: feature photo, a column of
          thumbnails as tall as the photo, then the label, heading and copy.
          On mobile it stacks as heading, photo, thumbnail row, copy. */}
      <div className="relative z-10 flex w-full flex-col gap-4 md:gap-0">
        <p className="font-switzer text-xs font-semibold uppercase tracking-[0.2em] text-cta md:hidden">
          The facility
        </p>
        <h2 className="font-switzer text-6xl font-extralight leading-[0.95] tracking-tighter text-white md:hidden">
          {heading}
        </h2>

        {images.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-6 md:mt-0 md:grid-cols-[minmax(0,1fr)_minmax(0,min(40rem,42vw))] md:items-start md:gap-x-0 md:gap-y-3" onKeyDown={onArrowKeys}>
            <button
              type="button"
              onClick={() => openLightbox(urls, selected)}
              aria-label={`View facility photo ${selected + 1} of ${count}, full size`}
              className="relative aspect-[4/3] min-h-[20rem] w-full cursor-zoom-in overflow-hidden rounded-lg md:col-start-1 md:row-start-1 md:w-auto md:-ml-16 md:aspect-auto md:h-[300px] lg:h-[460px] md:min-h-0 md:rounded-l-none"
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
              <div className="flex gap-2 md:col-start-1 md:row-start-2 md:justify-end md:gap-3 md:overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {images.map((photo, i) => (
                  <button
                    key={`${i}-${photo.url}`}
                    type="button"
                    onClick={() => setSelected(i)}
                    aria-label={`Show facility photo ${i + 1} of ${count}`}
                    aria-pressed={i === selected}
                    className={`relative aspect-[4/3] flex-1 overflow-hidden rounded-md transition duration-200 md:w-28 md:flex-none ${
                      i === selected
                        ? "ring-2 ring-inset ring-cta shadow-[0_0_16px_rgba(0,191,255,0.45)]"
                        : "opacity-40 hover:opacity-100"
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

            <div className="flex flex-col gap-5 md:col-start-2 md:row-span-2 md:row-start-1 md:ml-16 md:gap-6">
              <p className="hidden font-switzer text-xs font-semibold uppercase tracking-[0.2em] text-cta md:block">
                The facility
              </p>
              <h2 className="hidden font-switzer text-5xl font-extralight leading-[0.95] tracking-tighter text-white md:block lg:text-6xl">
                {heading}
              </h2>
              <div className="flex flex-col gap-4 text-left font-switzer text-[15px] font-light leading-relaxed text-white/70">
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
