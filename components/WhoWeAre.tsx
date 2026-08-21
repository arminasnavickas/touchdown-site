"use client";

import FadeImage from "./FadeImage";
import { useLightbox } from "./LightboxContext";
import Blob from "./Blob";
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
      className="relative flex flex-col items-center gap-10 overflow-hidden px-6 py-28 md:flex-row md:items-center md:justify-between md:gap-16 md:px-16 scroll-mt-20"
    >
      <Blob className="left-0 top-[45%] h-[360px] w-[360px] -translate-y-1/2" />
      {/* order-2/order-1 put the photo above the text on mobile (where the
          section stacks in a single column) without touching the desktop
          layout, which keeps the original text-left/photo-right order via
          md:order-none. */}
      <div className="relative z-10 order-2 flex w-full max-w-xl flex-col gap-10 md:order-none">
        <h2 className="font-switzer text-4xl font-extralight tracking-tight text-white md:text-6xl">
          {heading}
        </h2>
        <div className="font-switzer text-xl font-light leading-relaxed text-white/80">
          {paragraphs.map((p, i) => (
            <p key={i} className={i < paragraphs.length - 1 ? "mb-4" : ""}>
              {p}
            </p>
          ))}
        </div>
        <BookInButton className="w-fit rounded-[6px] bg-cta px-8 py-4 font-switzer text-base font-medium uppercase tracking-wide text-white transition-all duration-200 ease-out hover:bg-aquatic hover:text-dark-ocean-blue hover:scale-105 hover:shadow-lg hover:shadow-cta/40 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2">
          Book in
        </BookInButton>
      </div>

      <Reveal delay={150} className="order-1 flex flex-1 md:order-none">
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
