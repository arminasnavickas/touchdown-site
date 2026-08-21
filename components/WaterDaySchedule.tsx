import ScheduleCard from "./ScheduleCard";
import Blob from "./Blob";
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
    <section id="water-schedule" className="relative flex flex-col items-center gap-[100px] overflow-hidden px-6 py-28 md:px-16 scroll-mt-20">
      <Blob className="left-0 top-[8%] h-[260px] w-[260px]" />
      <Blob className="right-0 top-[65%] h-[280px] w-[280px] -translate-y-1/2" />
      <Reveal>
        <div className="relative z-10 flex max-w-3xl flex-col items-center gap-10 text-center">
          <h2 className="font-switzer text-4xl font-extralight tracking-tight text-white md:text-6xl">
            {heading}
          </h2>
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
            <ScheduleCard {...card} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
