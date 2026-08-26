"use client";

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
      className="relative flex flex-col items-center gap-10 overflow-hidden px-6 py-20 md:flex-row md:items-center md:justify-between md:gap-16 md:px-16 scroll-mt-20"
    >
      {/* order-1/order-2 put the text above the photo on mobile (where the
          section stacks in a single column) without touching the desktop
          layout, which keeps the original text-left/photo-right order via
          md:order-none. */}
      <div className="relative z-10 order-1 flex w-full max-w-xl flex-col gap-10 md:order-none">
        <div className="flex flex-col items-center gap-3 text-center">
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
        <div className="text-center font-switzer text-[15px] font-light leading-relaxed text-white/80">
          {paragraphs.map((p, i) => (
            <p key={i} className={i < paragraphs.length - 1 ? "mb-4" : ""}>
              {p}
            </p>
          ))}
        </div>
        {/* Hidden on mobile only - the section already ends with the "Book
            in" CTA in the hero above it, and on a narrow single-column
            layout this one just repeated it right after the About Us copy.
            md:inline-flex brings it back at desktop, where the two-column
            layout means it isn't sitting right below another CTA. */}
        <BookInButton className="mx-auto hidden w-fit rounded-[6px] bg-cta px-8 py-4 font-switzer text-base font-medium uppercase tracking-wide text-white transition-all duration-200 ease-out hover:bg-aquatic hover:text-dark-ocean-blue hover:scale-105 hover:shadow-lg hover:shadow-cta/40 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 md:inline-flex">
          Book in
        </BookInButton>
      </div>

      <Reveal delay={150} className="order-2 flex flex-1 md:order-none">
        <button
          type="button"
          onClick={() => openLightbox([image], 0)}
          className="relative z-10 h-[250px] w-full flex-1 cursor-zoom-in md:h-[660px]"
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
