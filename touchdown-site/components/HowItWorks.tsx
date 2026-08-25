"use client";

import { useState } from "react";
import FadeImage from "./FadeImage";
import { useLightbox } from "./LightboxContext";
import ArticleModal from "./ArticleModal";
import Reveal from "./Reveal";
import type { HowItWorksStep } from "@/lib/content";

// Rewritten from four equal photo cards into a single numbered progression -
// this is one of the page's three strongest moments, and "four cards in a
// row" is the same generic pattern the rest of the page uses (heading over
// photo over paragraph over button). A horizontal rail threads all four
// steps into one continuous line so the section reads as "we build
// progression" at a glance, before a single word of copy is read, rather
// than four separate, unrelated stops.
function ProgressionStep({
  index,
  title,
  image,
  paragraphs,
  onReadMore,
}: HowItWorksStep & { index: number; onReadMore: () => void }) {
  const { openLightbox } = useLightbox();
  const number = String(index + 1).padStart(2, "0");
  return (
    <div className="relative flex flex-1 flex-col gap-4 md:gap-5">
      {/* The number IS the step marker - large, thin, on the rail - not a
          small index label sitting above a dominant photo like the old
          card. A filled dot sits on the rail directly under it so the four
          numbers read as beads threaded on one line. */}
      <div className="relative flex items-center gap-3 md:block md:h-[70px]">
        <span className="relative z-10 font-switzer text-5xl font-thin leading-none text-cta md:text-[68px]">
          {number}
        </span>
        <span
          aria-hidden
          className="hidden size-2 rounded-full bg-cta md:absolute md:bottom-0 md:left-[6px] md:block"
        />
      </div>

      <p className="font-switzer text-2xl font-medium tracking-tight text-white md:text-[28px]">
        {title}
      </p>

      <button
        type="button"
        onClick={() => openLightbox([image], 0)}
        className="group relative h-[150px] w-full cursor-zoom-in overflow-hidden rounded-md md:h-[180px]"
        aria-label="View full image"
      >
        <FadeImage
          src={image}
          alt={title}
          wrapperClassName="h-full w-full"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </button>

      <p className="line-clamp-3 font-switzer text-base font-light leading-relaxed text-white/70">
        {paragraphs[0]}
      </p>

      <button
        type="button"
        onClick={onReadMore}
        data-fab-avoid
        className="group/link mt-auto flex w-fit items-center gap-1.5 pt-1 font-switzer text-sm font-medium uppercase tracking-widest text-cta transition hover:text-white"
      >
        Read more
        <span aria-hidden className="transition-transform duration-200 group-hover/link:translate-x-1">
          →
        </span>
      </button>
    </div>
  );
}

export default function HowItWorks({
  heading = "How it works",
  subtitle = "Learn the fundamentals. Practice with guidance. Progress with confidence.",
  steps,
}: {
  heading?: string;
  subtitle?: string;
  steps: HowItWorksStep[];
}) {
  const [openStep, setOpenStep] = useState<number | null>(null);

  return (
    // One of the page's three strongest information moments (with Hero and
    // Pricing) - py stays bumped up from the site's flat py-20 default so
    // it reads as a bigger beat than the supporting sections around it.
    <section
      id="courses"
      className="relative flex flex-col items-center gap-14 overflow-hidden px-6 py-24 md:px-16 md:py-28 scroll-mt-20"
    >
      {/* Glow removed - the numbered rail and photography carry this
          section on their own; the page's three deliberate glow moments are
          now Hero, Pricing, and the final CTA in the footer only. */}
      <Reveal>
        <div className="relative z-10 flex flex-col items-center gap-3 text-center">
          {/* Small eyebrow - matches the masthead treatment used across the
              page (Gallery, About, FAQ) so this reads as one more entry in
              the same editorial system rather than its own one-off style. */}
          <p className="font-switzer text-xs font-semibold uppercase tracking-[0.25em] text-cta md:text-sm">
            Our method
          </p>
          <h2 className="font-switzer text-4xl font-extralight tracking-tight text-white md:text-6xl">
            {heading}
          </h2>
          <p className="max-w-xl font-switzer text-lg font-light leading-relaxed text-danish-blue md:text-xl">
            {subtitle}
          </p>
        </div>
      </Reveal>
      <div className="relative z-10 grid w-full grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4 md:gap-x-10 md:gap-y-0">
        {/* The rail - a single line threaded behind all four numbers,
            desktop only (a horizontal line has nothing meaningful to
            connect once the steps wrap onto a 2x2 mobile grid). */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[27px] hidden h-px bg-gradient-to-r from-cta/0 via-cta/35 to-cta/0 md:block"
        />
        {steps.map((step, i) => (
          <Reveal key={step.title} delay={i * 100} className="relative flex">
            <ProgressionStep {...step} index={i} onReadMore={() => setOpenStep(i)} />
          </Reveal>
        ))}
      </div>

      {openStep !== null && (
        <ArticleModal
          content={{
            title: steps[openStep].title,
            // "01 · How it works" - carries the same step-numbering system
            // from the card into its expanded state, so the two feel
            // connected rather than the modal being a generic popup.
            kicker: `${String(openStep + 1).padStart(2, "0")} · How it works`,
            image: steps[openStep].image,
            // Only the short intro paragraph - the old second paragraph's
            // information now lives in learnPoints below, restructured into
            // something scannable instead of one more wall of text.
            paragraphs: [steps[openStep].paragraphs[0]],
            learnPoints: steps[openStep].learnPoints,
            ctaLabel: "Book your training",
            ctaHref: "#schedule",
          }}
          currentIndex={openStep}
          total={steps.length}
          onClose={() => setOpenStep(null)}
          onPrev={() => setOpenStep((steps.length + openStep - 1) % steps.length)}
          onNext={() => setOpenStep((openStep + 1) % steps.length)}
        />
      )}
    </section>
  );
}
