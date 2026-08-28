import Blob from "./Blob";
import Reveal from "./Reveal";
import TypewriterText from "./TypewriterText";
import type { WhatYouGetItem } from "@/lib/content";

export default function WhatYouGet({
  items,
  heading,
}: {
  items: WhatYouGetItem[];
  heading: string;
}) {
  return (
    // A light supporting beat between How It Works and Training Rhythm, not
    // a section of its own weight - py and the heading-to-list gap trimmed
    // down from the site's flat py-20/gap-14 so a handful of short
    // title/copy rows doesn't sit inside as much empty space as the bigger
    // sections around it.
    <section className="relative flex flex-col items-center gap-10 px-6 py-14 md:px-16 md:py-16">
      {/* Top-center now (was dead-center, before that top-right) - bled
          upward past this section's own top edge into Where You'll Train
          above (this section renders after it in the DOM, so it naturally
          paints on top in the overlap zone). overflow-hidden dropped again
          since it's crossing the section boundary once more. opacity-40
          knocks it down from Blob's own baked-in 60% alpha (~24%
          effective). */}
      <Blob className="top-[-120px] left-1/2 h-[380px] w-[380px] -translate-x-1/2 opacity-40" />
      <Reveal className="relative z-10">
        <h2 className="text-center font-switzer text-4xl font-extralight tracking-tight text-white md:text-6xl">
          {heading}
        </h2>
      </Reveal>
      <div className="relative z-10 w-full max-w-6xl divide-y divide-white/10">
        {items.map((item, i) => (
          <Reveal key={item.title} delay={i * 80}>
            <div className="grid grid-cols-1 items-center gap-4 py-10 md:grid-cols-2 md:gap-12">
              <p className="font-switzer text-2xl font-medium leading-none tracking-tight text-white md:text-3xl">
                <TypewriterText text={item.title} />
              </p>
              <p className="font-switzer text-[15px] font-light leading-relaxed text-white/70">
                {item.copy}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
