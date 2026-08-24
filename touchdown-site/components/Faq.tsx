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
      {/* Left-aligned header instead of the old centered "FAQ" - the
          accordion below is already a full-width, left-aligned list, so a
          centered heading above it read as two unrelated layouts stacked on
          top of each other. Eyebrow -> heading -> supporting line gives the
          section an actual point of view ("here's what this is, here's why
          it matters") instead of a bare word floating in space. Gap to the
          list below tightened from gap-24 to the section's own gap-10, so
          the header reads as introducing the accordion rather than sitting
          in its own separate block. */}
      <Reveal>
        <div className="relative z-10 flex w-full max-w-3xl flex-col items-start gap-4 text-left">
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
      <div data-fab-avoid className="relative z-10 flex w-full flex-col">
        {items.map((faq, i) => {
          const isOpen = openIndex === i;
          const number = String(i + 1).padStart(2, "0");
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
                  {/* Question number + text share one row, control on the
                      right - generous vertical padding (was py-6) so each
                      row reads as a substantial editorial line, not a
                      cramped list item. items-start (not center) so the
                      +/- stays aligned to the question's first line even if
                      it wraps to two on mobile. */}
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full items-start justify-between gap-4 py-6 text-left md:py-8"
                  >
                    <span className="flex items-start gap-4 md:gap-6">
                      <span className="w-7 shrink-0 pt-0.5 font-switzer text-sm font-semibold tracking-[0.2em] text-cta md:w-9 md:pt-1">
                        {number}
                      </span>
                      <span className="font-switzer text-xl font-light text-white md:text-[28px]">
                        {faq.question}
                      </span>
                    </span>
                    <span className="shrink-0 font-switzer text-2xl font-light leading-none text-cta">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    // Indented to sit under the question text (past the
                    // number column) and capped well short of full width -
                    // a long answer used to run the entire viewport wide,
                    // which is exhausting to read at this font size.
                    <div className="flex max-w-[820px] flex-col gap-5 pb-8 pl-11 pr-4 md:pl-[60px]">
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
    </section>
  );
}
