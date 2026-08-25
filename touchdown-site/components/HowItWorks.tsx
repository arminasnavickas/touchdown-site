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
// Image height and title size both step up across the sequence (01 -> 04) -
// a literal typographic/photographic "growing" rhythm so the four steps
// read as an escalation (knowledge -> application -> consistency -> depth)
// rather than four identically-weighted stops. Numbers and the rail stay a
// fixed size so the connecting line across the top never breaks. Mobile
// gets its own (smaller-but-still-escalating) heights, not the desktop
// values shrunk down.
const IMAGE_HEIGHT_BY_INDEX = ["h-[140px] md:h-[160px]", "h-[160px] md:h-[185px]", "h-[180px] md:h-[210px]", "h-[200px] md:h-[240px]"];
const TITLE_SIZE_BY_INDEX = ["text-xl md:text-[26px]", "text-xl md:text-[28px]", "text-2xl md:text-[31px]", "text-2xl md:text-[34px]"];

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
    // Mobile is a real vertical sequence - a numbered timeline row (number
    // left, content right), not the desktop's four-abreast layout stacked
    // into a 2x2 grid. md: switches back to the column layout the rail sits
    // on top of.
    <div className="relative flex flex-row gap-4 md:flex-1 md:flex-col md:gap-5">
      {/* The number IS the step marker - large, thin - not a small index
          label sitting above a dominant photo like the old card. On mobile
          it leads its own row with a short stem running down toward the
          content, echoing the desktop rail's dot-on-a-line language rotated
          into a vertical sequence. A filled dot sits on the rail directly
          under it on desktop so the four numbers read as beads threaded on
          one line. */}
      <div className="relative flex w-12 shrink-0 flex-col items-center md:block md:w-auto md:h-[70px]">
        {/* Small background swatch (matches the page's own navy) sits
            directly behind the numeral only, painted above the rail below -
            it lets the rail pass straight through each numeral's bounding
            box without its stroke gaps (the loop of "0", etc.) showing the
            line poking through the digit. The rail stays fully visible in
            the space between steps; only the digits themselves mask it. */}
        <span className="relative z-10 bg-[#003354] pr-2 font-switzer text-4xl font-thin leading-none text-cta md:text-5xl md:text-[68px]">
          {number}
        </span>
        {index < 3 && (
          <span aria-hidden className="mt-2 w-px flex-1 bg-gradient-to-b from-cta/30 to-cta/0 md:hidden" />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 pb-2 md:gap-5 md:pb-0">
        <p className={`font-switzer font-medium tracking-tight text-white ${TITLE_SIZE_BY_INDEX[index]}`}>
          {title}
        </p>

        <button
          type="button"
          onClick={() => openLightbox([image], 0)}
          className={`group relative w-full cursor-zoom-in overflow-hidden rounded-md ${IMAGE_HEIGHT_BY_INDEX[index]}`}
          aria-label="View full image"
        >
          <FadeImage
            src={image}
            alt={title}
            wrapperClassName="h-full w-full"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </button>

        <p className="line-clamp-3 font-switzer text-[15px] font-light leading-relaxed text-white/70">
          {paragraphs[0]}
        </p>

        <button
          type="button"
          onClick={onReadMore}
          data-fab-avoid
          className="group/link mt-auto flex w-fit shrink-0 items-center gap-1.5 self-end pt-1 font-switzer text-sm font-medium uppercase tracking-widest text-cta transition hover:text-white"
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
      {/* Centered masthead, sitting above the full 4-column grid (was
          left-aligned) - the heading now reads as centered over the whole
          progression rather than over just the first column. The four
          steps below stay left-aligned internally; only this block moves. */}
      <Reveal className="w-full">
        <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col items-center gap-3 text-center">
          <p className="font-switzer text-xs font-semibold uppercase tracking-[0.25em] text-cta md:text-sm">
            Our method
          </p>
          <h2 className="font-switzer text-4xl font-extralight tracking-tight text-white md:text-6xl">
            {heading}
          </h2>
          <p className="font-switzer text-lg font-light leading-relaxed text-danish-blue md:text-xl">
            {subtitle}
          </p>
        </div>
      </Reveal>
      {/* Mobile: a single column, true vertical sequence (was a 2x2 grid -
          the desktop layout stacked, not a real mobile composition).
          Desktop: column widths widen step by step, paired with each step's
          own growing image/title, so the sequence reads as a genuine
          escalation left to right, not four equal boxes. */}
      <div className="relative z-10 flex w-full flex-col gap-10 md:grid md:grid-cols-[21%_23.5%_26%_29.5%] md:gap-x-8 md:gap-y-0">
        {/* The rail - a single line threaded behind all four numbers,
            desktop only (mobile gets its own short per-step stem instead of
            a line connecting a 2x2 grid, which had nothing meaningful to
            connect once the steps wrapped). */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[34px] hidden h-px bg-gradient-to-r from-cta/0 via-cta/35 to-cta/0 md:block"
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
