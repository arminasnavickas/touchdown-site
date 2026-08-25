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
    // gap/padding brought down to match its scannable, compact role.
    <section className="relative flex flex-col items-center gap-10 overflow-hidden px-6 py-14 md:gap-12 md:px-16 md:py-16">
      <Reveal>
        <div className="relative z-10 flex max-w-3xl flex-col items-center gap-10 text-center">
          {/* "The training system · Part 03" kicker removed. */}
          <div className="flex flex-col items-center gap-3">
            <h2 className="font-switzer text-4xl font-extralight tracking-tight text-white md:text-6xl">
              {heading}
            </h2>
          </div>
          <p className="font-switzer text-lg font-light leading-relaxed text-[#d3e3fd] md:text-xl">
            {subcopy}
          </p>
        </div>
      </Reveal>
      <div className="relative z-10 grid w-full grid-cols-1 gap-6 md:grid-cols-2">
        {cards.map((card, i) => (
          <Reveal key={card.title} delay={i * 100}>
            <ScheduleCard {...card} index={i} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
