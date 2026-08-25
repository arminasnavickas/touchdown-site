import ScheduleCard from "./ScheduleCard";
import Reveal from "./Reveal";
import type { ScheduleCard as ScheduleCardData } from "@/lib/content";

export default function WaterDaySchedule({
  cards,
  heading,
  subcopy,
}: {
  cards: ScheduleCardData[];
  heading: string;
  subcopy: string;
}) {
  const subcopyLines = subcopy.split("\n").filter(Boolean);
  return (
    // Glow removed (part of the page-wide cut to strategic-only cyan glow)
    // and the gap/padding brought down from the old gap-[100px]/py-20 -
    // this is a compact, scannable schedule, not a showcase section, so it
    // shouldn't carry the same amount of empty space as one.
    <section id="water-schedule" className="relative flex flex-col items-center gap-10 overflow-hidden px-6 py-14 md:gap-12 md:px-16 md:py-16 scroll-mt-20">
      <Reveal>
        <div className="relative z-10 flex max-w-3xl flex-col items-center gap-10 text-center">
          {/* "The training system · Part 02" kicker removed. */}
          <div className="flex flex-col items-center gap-3">
            <h2 className="font-switzer text-4xl font-extralight tracking-tight text-white md:text-6xl">
              {heading}
            </h2>
          </div>
          <div className="font-switzer text-xl font-light leading-relaxed text-[#d3e3fd]">
            {subcopyLines.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
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
