"use client";

import { useState } from "react";
import type { FaqItem } from "@/lib/content";
import Reveal from "./Reveal";

export default function Faq({
  items,
  contactEmail,
}: {
  items: FaqItem[];
  contactEmail: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative flex flex-col items-center gap-10 overflow-hidden px-6 py-20 md:px-16 scroll-mt-20"
    >
      {/* Whole section now lives inside one defined, centred content
          column (was two unconstrained w-full blocks stretching edge to
          edge across the section's own px-16 padding, which read as
          left-heavy on wide viewports). Header and accordion share this
          same column and the same responsive max-width at every
          breakpoint, so they're never two different layouts stacked
          together. */}
      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-10 md:max-w-4xl">
        {/* Centred header (was left-aligned) - it now sits inside the same
            column as the accordion below it rather than the section's full
            width, so centring it reads as intentional instead of floating
            off to one side of a much wider row. */}
        <Reveal>
          <div className="flex w-full flex-col items-center gap-4 text-center">
            <p className="font-switzer text-xs font-semibold uppercase tracking-[0.25em] text-cta md:text-sm">
              Before you dive
            </p>
            <h2 className="font-switzer text-4xl font-extralight tracking-tight text-white md:text-6xl">
              FAQ
            </h2>
            <p className="font-switzer text-lg font-light leading-relaxed text-danish-blue md:text-xl">
              Everything you need to know before you dive.
            </p>
          </div>
        </Reveal>

        {/* data-fab-avoid: same floating Book Now/back-to-top overlap issue
            fixed elsewhere (How It Works, Team, footer links) - the fixed
            stack must never sit on top of these rows or the contact CTA
            below them. */}
        <div data-fab-avoid className="flex w-full flex-col">
        {items.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <Reveal key={faq.question} delay={Math.min(i * 60, 300)}>
              <div>
                {/* Group label - only rendered above the first item of each
                    group (the item before it has a different category, or
                    this is the first item overall). Subtle: small, cyan,
                    generously spaced, not a tab or a divider of its own. */}
                {faq.category && faq.category !== items[i - 1]?.category && (
                  <p
                    className={`font-switzer text-xs font-semibold uppercase tracking-[0.3em] text-cta/70 ${
                      i === 0 ? "pb-4" : "pb-4 pt-10 md:pt-12"
                    }`}
                  >
                    {faq.category}
                  </p>
                )}
                <div className={`border-t border-white/15 ${i === items.length - 1 ? "border-b" : ""}`}>
                  {/* Question number removed - text now sits flush at the
                      row's left edge instead of past a number gutter.
                      Generous vertical padding (was py-6) so each row reads
                      as a substantial editorial line, not a cramped list
                      item. items-start (not center) so the +/- stays
                      aligned to the question's first line even if it wraps
                      to two on mobile. */}
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full items-start justify-between gap-4 py-6 text-left md:py-8"
                  >
                    <span className="font-switzer text-xl font-light text-white md:text-[28px]">
                      {faq.question}
                    </span>
                    <span className="shrink-0 font-switzer text-2xl font-light leading-none text-cta">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    // Left indent dropped along with the number column
                    // above (was pl-11/md:pl-[60px] to sit under the
                    // question text past the number) - now flush with the
                    // question, still capped well short of full width so a
                    // long answer stays comfortable to read.
                    <div className="flex max-w-[820px] flex-col gap-5 pb-8 pr-4">
                      {faq.highlight?.label && faq.highlight?.text && (
                        <div className="flex flex-col gap-1 border-l-2 border-cta/60 pl-4">
                          <p className="font-switzer text-xs font-semibold uppercase tracking-[0.2em] text-cta">
                            {faq.highlight.label}
                          </p>
                          <p className="font-switzer text-lg font-medium leading-relaxed text-white md:text-xl">
                            {faq.highlight.text}
                          </p>
                        </div>
                      )}
                      {faq.answer.map((paragraph, pi) => (
                        <p
                          key={pi}
                          className="font-switzer text-[17px] font-light leading-relaxed text-danish-blue md:text-lg"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          );
        })}

        {/* Local closing CTA - the global floating Book Now stack already
            fades out around this section (data-fab-avoid above), so this
            gives the FAQ its own understated next-step instead of leaving
            visitors with no CTA at all once the fixed stack steps aside. */}
        <div className="flex flex-col items-start gap-2 border-t border-white/15 pt-10">
          <p className="font-switzer text-xs font-semibold uppercase tracking-[0.25em] text-cta">
            Still have questions?
          </p>
          <a
            href={`mailto:${contactEmail}`}
            className="group/link flex items-center gap-2 font-switzer text-2xl font-light text-white transition hover:text-cta md:text-3xl"
          >
            Contact us
            <span aria-hidden className="transition-transform duration-200 group-hover/link:translate-x-1">
              →
            </span>
          </a>
        </div>
        </div>
      </div>
    </section>
  );
}
