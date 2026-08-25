"use client";

import { useState } from "react";
import FadeImage from "./FadeImage";
import { useLightbox } from "./LightboxContext";
import Blob from "./Blob";
import ArticleModal from "./ArticleModal";
import Reveal from "./Reveal";
import type { HowItWorksStep } from "@/lib/content";

function StepCard({
  index,
  title,
  image,
  paragraphs,
  onReadMore,
}: HowItWorksStep & { index: number; onReadMore: () => void }) {
  const { openLightbox } = useLightbox();
  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-danish-blue/30 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:border-cta/60 hover:shadow-lg hover:shadow-cta/10">
      <button
        type="button"
        onClick={() => openLightbox([image], 0)}
        className="cursor-zoom-in"
        aria-label="View full image"
      >
        {/* Photo shortened ~15-20% (140/300px -> 120/255px) - the old
            proportions, combined with the full paragraph and the huge
            button below, made each card read as very tall/vertical. The
            photo is still the dominant visual element, just without the
            extra headroom it didn't need. */}
        <FadeImage
          src={image}
          alt={title}
          wrapperClassName="h-[120px] w-full md:h-[255px]"
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
        />
      </button>
      {/* Padding/type sizes step down on mobile - two cards now share a row
          there (see the grid on the section below), so the extra room a
          single full-width card had to work with is gone. Desktop keeps
          reduced padding too (was pb-10/pt-6) now that the card is shorter
          overall and doesn't need as much internal breathing room. */}
      <div
        className="flex flex-1 flex-col gap-1.5 px-4 pb-4 pt-3 md:gap-2 md:px-6 md:pb-6 md:pt-5"
        style={{
          backgroundImage:
            "linear-gradient(180deg, #FFFFFF 24.83%, rgba(208,235,242,0.1) 98.162%), linear-gradient(#FFFFFF, #FFFFFF)",
        }}
      >
        {/* Step number - the section reads as a step-by-step process, but a
            2x2 mobile grid doesn't convey "top-left then top-right then
            bottom-left then bottom-right" as an order on its own the way a
            single column would. Small and fully-saturated cyan (was
            text-cta/70 at text-sm) so it reads as a distinct index label
            rather than blending into the title beneath it. */}
        <p className="font-switzer text-xs font-semibold tracking-[0.2em] text-cta">
          {String(index + 1).padStart(2, "0")}
        </p>
        <p className="font-switzer text-2xl font-medium tracking-tight text-navy md:text-3xl">
          {title}
        </p>
        {/* A hard 2-line clamp instead of the old fade-to-transparent mask -
            the fade made the copy look disabled/unfinished (especially
            mid-sentence), and it isn't needed: the card's white background
            already reads as "this is a preview" once paired with the Read
            more link below, without dimming the text itself. */}
        <p className="line-clamp-2 font-switzer text-lg font-light leading-relaxed text-dark-ocean-blue/80 md:text-xl">
          {paragraphs[0]}
        </p>
        {/* Read more demoted from a full-width bordered button (visual
            weight that competed with the page's actual primary CTAs) to a
            small text link with an arrow - this is secondary, "learn more"
            navigation, not a call-to-action, and should read that way. */}
        <button
          type="button"
          onClick={onReadMore}
          data-fab-avoid
          className="group/link mt-auto flex w-fit items-center gap-1.5 pt-1 font-switzer text-sm font-medium uppercase tracking-widest text-cta transition hover:text-dark-ocean-blue"
        >
          Read more
          <span aria-hidden className="transition-transform duration-200 group-hover/link:translate-x-1">
            →
          </span>
        </button>
      </div>
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
    // Heading-to-cards gap tightened from gap-10 to gap-6 (-40%) so the
    // heading reads as introducing the cards directly below it rather than
    // sitting above them as its own separate block.
    // One of the page's three strongest information moments (with Hero and
    // Pricing) - py bumped up from the site's flat py-20 default so it
    // reads as a bigger beat than the supporting sections around it.
    <section
      id="courses"
      className="relative flex flex-col items-center gap-6 overflow-hidden px-6 py-24 md:px-16 md:py-28 scroll-mt-20"
    >
      <Blob className="left-0 top-[55%] h-[340px] w-[340px] -translate-y-1/2" />
      <Reveal>
        <div className="relative z-10 flex flex-col items-center gap-3 text-center">
          <h2 className="font-switzer text-4xl font-extralight tracking-tight text-white md:text-6xl">
            {heading}
          </h2>
          {/* Swapped the old kicker-style caps line ("Patience is key" - a
              nice brand phrase but not explanatory) for an editorial
              subheading that actually tells the reader what the process is.
              Sentence case at readable size, not the tiny uppercase/
              tracking-widest treatment - that works for a 3-word kicker but
              turns illegible on a full sentence. */}
          <p className="max-w-xl font-switzer text-lg font-light leading-relaxed text-danish-blue md:text-xl">
            {subtitle}
          </p>
        </div>
      </Reveal>
      <div className="relative z-10 grid w-full grid-cols-2 gap-4 md:flex md:flex-row md:gap-6">
        {steps.map((step, i) => (
          <Reveal key={step.title} delay={i * 100} className="flex flex-1">
            <StepCard {...step} index={i} onReadMore={() => setOpenStep(i)} />
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
