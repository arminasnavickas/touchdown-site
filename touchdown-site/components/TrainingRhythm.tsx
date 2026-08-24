import Blob from "./Blob";
import { Clock, Waves, Sun, Coffee } from "lucide-react";
import Reveal from "./Reveal";
import type { ScheduleDay } from "@/lib/content";

// Day type is inferred from the label text (rather than added as a new CMS
// field) so this works with the existing Sanity content as-is. Each type
// gets its own icon + accent color so the week's rhythm can be scanned at
// a glance instead of requiring every label to be read - "water" days lean
// on the brand's own aquatic accent, "dry" days use the more muted
// danish-blue so they read as calmer/lower-key, and off days stay closest
// to plain white since there's nothing to schedule around.
function dayTypeFor(label: string) {
  const normalized = label.toLowerCase();
  if (normalized.includes("water")) {
    return { Icon: Waves, colorClass: "text-aquatic" };
  }
  if (normalized.includes("dry")) {
    return { Icon: Sun, colorClass: "text-danish-blue" };
  }
  return { Icon: Coffee, colorClass: "text-white/70" };
}

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
      className="relative flex flex-col items-center gap-16 overflow-hidden px-6 py-28 md:px-16 scroll-mt-20"
    >
      <Blob className="right-0 top-[55%] h-[320px] w-[320px] -translate-y-1/2" />
      <Reveal>
        <h2 className="relative z-10 text-center font-switzer text-4xl font-extralight tracking-tight text-white md:text-6xl">
          {heading}
        </h2>
      </Reveal>
      {/* A 3-per-row wrap (the old layout) leaves 7 items with one card
          orphaned alone on a mostly-empty last row. Below md this is now a
          single horizontally-scrollable strip instead - each card keeps a
          fixed width so part of the next day peeks in as a scroll hint,
          which also reads more like an actual week strip than a stack of
          rows. At md+ all 7 sit in one even-width grid row, same as the
          week fitting on a real calendar. */}
      <div className="relative z-10 flex w-full snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-7 md:gap-4 md:overflow-visible md:pb-0">
        {days.map(({ day, label, time }, i) => {
          const { Icon, colorClass } = dayTypeFor(label);
          return (
            <Reveal
              key={day}
              delay={i * 70}
              className="w-[38%] shrink-0 snap-start sm:w-[26%] md:w-auto"
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
                className="flex h-full flex-1 cursor-default flex-col items-center gap-2 rounded-lg bg-white/5 px-4 py-6 text-center text-white transition-colors duration-300 [@media(hover:hover)]:hover:bg-white/10 [@media(hover:hover)]:hover:text-cta"
              >
                <p className="font-switzer text-3xl font-light tracking-tight">
                  {day}
                </p>
                <p className={`flex items-center gap-1.5 font-switzer text-sm font-bold uppercase tracking-widest ${colorClass}`}>
                  <Icon className="size-3.5 shrink-0" strokeWidth={2} />
                  {label}
                </p>
                {time ? (
                  <p className="flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full bg-dark-ocean-blue/80 px-3 py-1.5 font-switzer text-sm font-medium tracking-wide text-white">
                    <Clock className="size-4 shrink-0" strokeWidth={1.5} />
                    {time}
                  </p>
                ) : (
                  // Previously an invisible placeholder just to hold the
                  // card's height steady - replaced with real content so
                  // the day-off card doesn't read as broken/unfinished
                  // next to the others.
                  <p className="flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full bg-dark-ocean-blue/80 px-3 py-1.5 font-switzer text-sm font-medium tracking-wide text-white/70">
                    <Coffee className="size-4 shrink-0" strokeWidth={1.5} />
                    Rest &amp; recovery
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
