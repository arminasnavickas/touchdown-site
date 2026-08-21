import ScheduleCard from "./ScheduleCard";
import Blob from "./Blob";
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
    <section className="relative flex flex-col items-center gap-[100px] overflow-hidden px-6 py-28 md:px-16">
      <Blob className="left-0 top-[60%] h-[300px] w-[300px] -translate-y-1/2" />
      <Reveal>
        <div className="relative z-10 flex max-w-3xl flex-col items-center gap-10 text-center">
          <h2 className="font-switzer text-4xl font-extralight tracking-tight text-white md:text-6xl">
            {heading}
          </h2>
          <p className="font-switzer text-xl font-light leading-relaxed text-[#d3e3fd]">
            {subcopy}
          </p>
        </div>
      </Reveal>
      <div className="relative z-10 grid w-full grid-cols-2 gap-4 md:gap-6">
        {cards.map((card, i) => (
          <Reveal key={card.title} delay={i * 100}>
            <ScheduleCard {...card} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
