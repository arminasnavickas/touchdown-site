"use client";

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

  return (
    <section
      id="facility"
      className="relative flex flex-col items-center gap-10 overflow-hidden px-6 py-20 md:px-16 scroll-mt-20"
    >
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
      <Reveal delay={80}>
        <div className="relative z-10 flex max-w-3xl flex-col gap-4 text-left font-switzer text-[15px] font-light leading-relaxed text-white/70 md:text-center">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </Reveal>

      {/* Same grid treatment as the main Gallery: uniform tiles, zero gap
          between them, rounding only on the outer edge, hover wash + "View"
          label, click opens the lightbox. Scoped to this section's own
          max-w-3xl -> full width, so it reads as this section's own photo
          strip rather than a copy of the hero gallery. */}
      {images.length > 0 && (
        <Reveal delay={140} className="w-full">
          <div className="relative z-10 grid w-full grid-cols-2 gap-0 overflow-hidden rounded-lg shadow-xl">
            {images.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => openLightbox(images, i)}
                aria-label={`View facility photo ${i + 1} of ${images.length}`}
                className="group relative h-[200px] cursor-zoom-in overflow-hidden md:h-[320px]"
              >
                <FadeImage
                  src={src}
                  alt=""
                  wrapperClassName="h-full w-full"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-dark-ocean-blue/0 transition-colors duration-300 group-hover:bg-dark-ocean-blue/25" />
                <ViewIndicator />
              </button>
            ))}
          </div>
        </Reveal>
      )}
    </section>
  );
}
