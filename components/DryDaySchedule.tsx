import Blob from "./Blob";
import ScheduleCard from "./ScheduleCard";
import Reveal from "./Reveal";
import type { ScheduleCard as ScheduleCardData } from "@/lib/content";

export default function DryDaySchedule({
  cards,
  heading,
  subcopy,
}: {
  cards: ScheduleCardData[];
  heading: string;
  subcopy: string;
}) {
  return (
    // Same tightening as Water Day Schedule right above it - glow removed,
    // gap/padding brought down to match its scannable, compact role. id
    // added to match Water Day Schedule's own anchor (was missing here).
    <section id="dry-schedule" className="relative flex flex-col items-center gap-10 px-6 py-14 md:gap-12 md:px-16 md:py-16 scroll-mt-20">
      {/* Bottom-right, bled downward into Pricing below (same seam-bleed
          logic as every other blob on the page - Pricing has no
          overflow-hidden of its own, so nothing on that side clips it
          either; overflow-hidden dropped from this section for the same
          reason). Training Rhythm -> Water Day -> Dry Day is three
          consecutive data-dense sections in a row with no photographic
          beat between them and Pricing right after - this is the one
          light-touch addition that resets the pacing before the page's
          biggest conversion moment, at the site's standard glow strength
          (opacity-40, see WaterDaySchedule.tsx for the full 3-tier scale). */}
      <Blob className="bottom-[-100px] right-6 h-[340px] w-[340px] opacity-40" />
      <Reveal>
        <div className="relative z-10 flex max-w-3xl flex-col items-center gap-10 text-center">
          {/* "The training system · Part 03" kicker removed. */}
          <div className="flex flex-col items-center gap-3">
            <h2 className="font-switzer text-4xl font-extralight tracking-tight text-white md:text-6xl">
              {heading}
            </h2>
          </div>
          {/* Left-aligned at every width (was text-left on mobile only,
              md:text-center above) - two full sentences of body copy get
              the same treatment as the rest of the page's real paragraphs. */}
          <p className="text-left font-switzer text-[15px] font-light leading-relaxed text-white/70">
            {subcopy}
          </p>
        </div>
      </Reveal>
      {/* Two panels split by a single rule instead of a card grid - Dry Day
          only ever has two events (Yoga, Masterclass), so a bordered
          side-by-side split reads as one day in two halves rather than a
          smaller copy of Water Day's four-card grid. Differentiates this
          section from both Water Day Schedule above and Where You'll
          Train's photo grid further up, which used to share this same
          "heading + paragraph + even grid" shape. */}
      <div className="relative z-10 grid w-full grid-cols-1 gap-10 md:grid-cols-2 md:gap-0 md:divide-x md:divide-white/10">
        {cards.map((card, i) => (
          <Reveal key={card.title} delay={i * 100} className={i === 0 ? "md:pr-8" : "md:pl-8"}>
            <ScheduleCard {...card} index={i} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
