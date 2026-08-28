"use client";

import Blob from "./Blob";
import FadeImage from "./FadeImage";
import { useLightbox } from "./LightboxContext";
import Reveal from "./Reveal";
import BookInButton from "./BookInButton";

export default function WhoWeAre({
  heading,
  copy,
  image,
}: {
  heading: string;
  copy: string;
  image: string;
}) {
  const { openLightbox } = useLightbox();
  const paragraphs = copy.split(/(?<=[.?"])\s+(?=[A-Z])/);

  return (
    <section
      id="about-us"
      className="relative flex flex-col items-center gap-10 px-6 py-20 md:px-16 lg:flex-row lg:items-center lg:justify-between lg:gap-16 scroll-mt-20"
    >
      {/* Anchored to the section's bottom-right corner, behind the team
          photo (which sits on the right at the lg two-column layout), and
          allowed to bleed down past this section's own bottom edge into
          How It Works below - overflow-hidden dropped from this section
          (was clipping the blur into a hard line right at the boundary;
          neither section paints its own background, so with the clip gone
          the glow just fades across the seam onto the shared body
          background instead of stopping dead at it). How It Works keeps its
          own overflow-hidden - that only clips its own children, not a
          glow bleeding in from the section above. opacity-80 brings it down
          slightly from Blob's own baked-in 60% alpha (~48% effective). */}
      <Blob className="bottom-[-120px] right-6 h-[380px] w-[380px] opacity-80" />

      {/* order-1/order-2 put the text above the photo on mobile (where the
          section stacks in a single column) without touching the two-column
          layout, which keeps the original text-left/photo-right order via
          lg:order-none. The stacked layout now holds through lg (not just
          md) - a landscape phone or small tablet is wide enough to trip md,
          but not wide enough for a fixed max-w-xl text column plus a
          flex-1 photo to both get reasonable room; that combination was
          squeezing the photo down to an oddly narrow, over-cropped strip. */}
      <div className="relative z-10 order-1 flex w-full max-w-xl flex-col gap-10 lg:order-none">
        <div className="flex flex-col items-center gap-3 text-center lg:items-start lg:text-left">
          {/* Small eyebrow - matches the kicker treatment already used
              elsewhere (Gallery, FAQ) so About gets its own masthead moment
              instead of opening straight on the heading. */}
          <p className="font-switzer text-xs font-semibold uppercase tracking-[0.25em] text-cta md:text-sm">
            About us
          </p>
          <h2 className="font-switzer text-4xl font-extralight tracking-tight text-white md:text-6xl">
            {heading}
          </h2>
        </div>
        <div className="text-left font-switzer text-[15px] font-light leading-relaxed text-white/70">
          {paragraphs.map((p, i) => (
            <p key={i} className={i < paragraphs.length - 1 ? "mb-4" : ""}>
              {p}
            </p>
          ))}
        </div>
        {/* Hidden through the stacked layout (now up to lg, not just md) -
            the section already ends with the "Book in" CTA in the hero
            above it, and in single-column mode this one just repeated it
            right after the About Us copy. lg:inline-flex brings it back at
            the two-column layout, where that's no longer true. */}
        <BookInButton className="mx-auto hidden w-fit rounded-[6px] bg-cta px-8 py-4 font-switzer text-base font-medium uppercase tracking-wide text-white transition-all duration-200 ease-out hover:bg-aquatic hover:text-dark-ocean-blue hover:scale-105 hover:shadow-lg hover:shadow-cta/40 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 lg:mx-0 lg:inline-flex">
          Book in
        </BookInButton>
      </div>

      <Reveal delay={150} className="order-2 flex flex-1 lg:order-none">
        {/* data-fab-avoid: the fixed bottom-right "Book now" pill (see
            FloatingActions) can otherwise land right on top of this photo -
            most noticeable on short/wide viewports like a landscape phone,
            where the section's full height doesn't clear the fixed stack's
            corner the way a taller portrait viewport does. */}
        <button
          type="button"
          data-fab-avoid
          onClick={() => openLightbox([image], 0)}
          className="relative z-10 h-[250px] w-full flex-1 cursor-zoom-in md:h-[320px] lg:h-[660px]"
          aria-label="View full image"
        >
          <FadeImage
            src={image}
            alt="The Touchdown team together in Dahab"
            wrapperClassName="h-full w-full rounded-lg"
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
          />
        </button>
      </Reveal>
    </section>
  );
}
