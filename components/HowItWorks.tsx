"use client";

import { useState } from "react";
import FadeImage from "./FadeImage";
import { useLightbox } from "./LightboxContext";
import Blob from "./Blob";
import ArticleModal from "./ArticleModal";
import Reveal from "./Reveal";
import type { HowItWorksStep } from "@/lib/content";
import { Brain, Dumbbell, Repeat, Trophy, Circle } from "lucide-react";

// Icons are code, not content, so they stay keyed by step title rather than
// coming from Sanity. Falls back to a plain circle for any custom step title
// added later that doesn't match one of the four defaults.
const icons: Record<string, typeof Brain> = {
  Theory: Brain,
  Practice: Dumbbell,
  Repetition: Repeat,
  Results: Trophy,
};

function StepCard({
  title,
  image,
  paragraphs,
  onReadMore,
}: HowItWorksStep & { onReadMore: () => void }) {
  const { openLightbox } = useLightbox();
  const Icon = icons[title] ?? Circle;
  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-danish-blue/30 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:border-cta/60 hover:shadow-lg hover:shadow-cta/10">
      <button
        type="button"
        onClick={() => openLightbox([image], 0)}
        className="cursor-zoom-in"
        aria-label="View full image"
      >
        <FadeImage
          src={image}
          alt={title}
          wrapperClassName="h-[140px] w-full md:h-[300px]"
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
        />
      </button>
      {/* Padding/type sizes step down on mobile - two cards now share a row
          there (see the grid on the section below), so the extra room a
          single full-width card had to work with is gone. Desktop keeps the
          original sizes via the md: variants. */}
      <div
        className="flex flex-1 flex-col gap-2 px-4 pb-5 pt-4 md:gap-3 md:px-8 md:pb-10 md:pt-6"
        style={{
          backgroundImage:
            "linear-gradient(180deg, #FFFFFF 24.83%, rgba(208,235,242,0.1) 98.162%), linear-gradient(#FFFFFF, #FFFFFF)",
        }}
      >
        <div className="flex items-center gap-1.5 md:gap-2">
          <Icon className="size-5 text-navy md:size-7" strokeWidth={1.5} />
          <p className="font-switzer text-lg font-light tracking-tight text-navy md:text-3xl">
            {title}
          </p>
        </div>
        <p className="font-switzer text-sm font-light leading-relaxed text-dark-ocean-blue/80 md:text-xl">
          {paragraphs[0]}
        </p>
        <button
          type="button"
          onClick={onReadMore}
          className="mt-auto w-fit rounded-[6px] bg-cta px-4 py-2 font-switzer text-xs font-medium uppercase tracking-wide text-white transition-all duration-200 ease-out hover:bg-aquatic hover:text-dark-ocean-blue hover:scale-105 hover:shadow-lg hover:shadow-cta/40 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 md:px-8 md:py-4 md:text-sm"
        >
          Read more
        </button>
      </div>
    </div>
  );
}

export default function HowItWorks({
  heading = "How it works",
  subtitle = "Patience is key",
  steps,
}: {
  heading?: string;
  subtitle?: string;
  steps: HowItWorksStep[];
}) {
  const [openStep, setOpenStep] = useState<number | null>(null);

  return (
    <section
      id="courses"
      className="relative flex flex-col items-center gap-10 overflow-hidden px-6 py-28 md:px-16 scroll-mt-20"
    >
      <Blob className="left-0 top-[55%] h-[340px] w-[340px] -translate-y-1/2" />
      <Reveal>
        <div className="relative z-10 flex flex-col items-center gap-3 text-center">
          <h2 className="font-switzer text-4xl font-extralight tracking-tight text-white md:text-6xl">
            {heading}
          </h2>
          <p className="font-switzer text-base font-normal uppercase tracking-widest text-danish-blue">
            {subtitle}
          </p>
        </div>
      </Reveal>
      <div className="relative z-10 grid w-full grid-cols-2 gap-4 md:flex md:flex-row md:gap-6">
        {steps.map((step, i) => (
          <Reveal key={step.title} delay={i * 100} className="flex flex-1">
            <StepCard {...step} onReadMore={() => setOpenStep(i)} />
          </Reveal>
        ))}
      </div>

      {openStep !== null && (
        <ArticleModal
          content={{
            title: steps[openStep].title,
            kicker: "How it works",
            image: steps[openStep].image,
            paragraphs: steps[openStep].paragraphs,
          }}
          onClose={() => setOpenStep(null)}
          onPrev={() => setOpenStep((steps.length + openStep - 1) % steps.length)}
          onNext={() => setOpenStep((openStep + 1) % steps.length)}
        />
      )}
    </section>
  );
}
