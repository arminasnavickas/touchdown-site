import Blob from "./Blob";
import { Clock } from "lucide-react";
import Reveal from "./Reveal";
import type { ScheduleDay } from "@/lib/content";

export default function TrainingRhythm({
  days,
  heading,
}: {
  days: ScheduleDay[];
  heading: string;
}) {
  return (
    <section
      id="schedule"
      className="relative flex flex-col items-center gap-16 overflow-hidden px-6 py-20 md:px-16 scroll-mt-20"
    >
      <Blob className="right-0 top-[55%] h-[320px] w-[320px] -translate-y-1/2" />
      <Reveal>
        <h2 className="relative z-10 text-center font-switzer text-4xl font-extralight tracking-tight text-white md:text-6xl">
          {heading}
        </h2>
      </Reveal>
      <div className="relative z-10 flex w-full flex-wrap items-start justify-center gap-6 md:flex-nowrap">
        {days.map(({ day, label, time }, i) => {
          return (
            <Reveal
              key={day}
              delay={i * 70}
              className="flex max-w-[calc(50%-0.75rem)] flex-1 md:max-w-none"
            >
              {/* data-fab-avoid: with 7 cards wrapping two-per-row on mobile,
                  a lone last card can end up sitting where the floating
                  Book In/back-to-top stack lives - same issue we hit on How
                  It Works. This opts every card in to that avoidance check.

                  hover: is scoped to devices that report real hover support
                  so a mobile tap doesn't leave a card permanently
                  highlighted - touchscreens fire :hover on tap and only
                  clear it on the next tap elsewhere, which read as a random
                  stuck-blue day for no reason. */}
              <div
                data-fab-avoid
                className="flex flex-1 cursor-default flex-col items-center gap-2 rounded-lg bg-white/5 px-4 py-6 text-center text-white transition-colors duration-300 [@media(hover:hover)]:hover:bg-white/10 [@media(hover:hover)]:hover:text-cta"
              >
                <p className="font-switzer text-3xl font-light tracking-tight">
                  {day}
                </p>
                <p className="font-switzer text-sm font-bold uppercase tracking-widest">
                  {label}
                </p>
                {time ? (
                  <p className="flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full bg-dark-ocean-blue/80 px-3 py-1.5 font-switzer text-sm font-medium tracking-wide text-white">
                    <Clock className="size-4 shrink-0" strokeWidth={1.5} />
                    {time}
                  </p>
                ) : (
                  <p
                    aria-hidden="true"
                    className="invisible flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 font-switzer text-sm font-medium tracking-wide"
                  >
                    <Clock className="size-4 shrink-0" strokeWidth={1.5} />
                    00:00 - 00:00
                  </p>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>
      <a
        href="#water-schedule"
        className="relative z-10 w-fit rounded-[6px] border border-white px-8 py-4 font-switzer text-base font-medium uppercase tracking-wide text-white transition-all duration-200 ease-out hover:bg-white hover:text-dark-ocean-blue hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-dark-ocean-blue"
      >
        View full schedule
      </a>
    </section>
  );
}
