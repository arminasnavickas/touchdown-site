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
    <section className="relative flex flex-col items-center gap-14 overflow-hidden px-6 py-20 md:px-16">
      <Reveal className="relative z-10">
        <h2 className="text-center font-switzer text-4xl font-extralight tracking-tight text-white md:text-6xl">
          {heading}
        </h2>
      </Reveal>
      <div className="relative z-10 w-full max-w-6xl divide-y divide-white/10">
        {items.map((item, i) => (
          <Reveal key={item.title} delay={i * 80}>
            <div className="grid grid-cols-1 items-center gap-4 py-10 md:grid-cols-2 md:gap-12">
              <p className="font-switzer text-3xl font-thin leading-none tracking-tight text-cta md:text-6xl">
                <TypewriterText text={item.title} />
              </p>
              <p className="font-switzer text-xl font-light leading-relaxed text-white/80">
                {item.copy}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
