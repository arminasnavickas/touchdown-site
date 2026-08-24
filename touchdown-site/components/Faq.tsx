"use client";

import { useState } from "react";
import type { FaqItem } from "@/lib/content";
import Reveal from "./Reveal";

export default function Faq({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative flex flex-col items-center gap-24 overflow-hidden px-6 py-20 md:px-16 scroll-mt-20"
    >
      <Reveal>
        <h2 className="relative z-10 font-switzer text-4xl font-extralight tracking-tight text-danish-blue md:text-6xl">
          FAQ
        </h2>
      </Reveal>
      <div className="relative z-10 flex w-full flex-col">
        {items.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <Reveal key={faq.question} delay={Math.min(i * 60, 300)}>
              <div className="border-t border-white last:border-b">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between py-6 text-left"
                >
                  <span className="font-switzer text-2xl font-light text-white md:text-3xl">
                    {faq.question}
                  </span>
                  <span className="font-switzer text-3xl font-light leading-none text-white">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div className="flex flex-col gap-4 pb-6">
                    {faq.answer.map((paragraph, pi) => (
                      <p
                        key={pi}
                        className="font-switzer text-xl font-light leading-relaxed text-white/90"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
