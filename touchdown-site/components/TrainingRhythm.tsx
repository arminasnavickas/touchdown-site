import Blob from "./Blob";
import BookInButton from "./BookInButton";
import { Clock } from "lucide-react";
import Reveal from "./Reveal";
import type { ScheduleDay } from "@/lib/content";

// Day type is inferred from the label text rather than added as a new CMS
// field, so this works with the existing Sanity content as-is. Deliberately
// NOT three different colours (per design feedback: small tonal/label
// differences are enough to scan by, more colour reads as decoration) -
// water gets the brand's aquatic accent and a filled dot, dry stays neutral
// white with a filled dot, rest drops to a quiet muted tone with a dash
// instead of a dot so it visually recedes rather than competing for
// attention on the one day there's nothing scheduled.
function dayTypeInfo(label: string) {
  const normalized = label.toLowerCase();
  if (normalized.includes("water")) {
    return { word: "WATER", accentClass: "text-aquatic", marker: "dot" as const };
  }
  if (normalized.includes("dry")) {
    return { word: "DRY", accentClass: "text-white", marker: "dot" as const };
  }
  return { word: "REST", accentClass: "text-white/40", marker: "dash" as const };
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
      className="relative flex flex-col items-center gap-12 overflow-hidden px-6 py-20 md:px-16 scroll-mt-20"
    >
      <Blob className="right-0 top-[55%] h-[320px] w-[320px] -translate-y-1/2" />
      <Reveal>
        <h2 className="relative z-10 text-center font-switzer text-4xl font-extralight tracking-tight text-white md:text-6xl">
          {heading}
        </h2>
      </Reveal>

      {/* The pattern strip - WATER · WATER · DRY · ... - exists purely to
          communicate the *rhythm* itself at a glance (why the week is
          shaped this way) before the reader gets into individual days.
          Derived from the same days array so it can never drift out of
          sync with the list below it. */}
      <Reveal className="relative z-10 flex flex-col items-center gap-3">
        <p className="font-switzer text-xs font-medium uppercase tracking-[0.15em] text-white/40">
          Weekly training rhythm
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-2">
          {days.map((d, i) => {
            const info = dayTypeInfo(d.label);
            return (
              <span key={d.day} className="flex items-center gap-2.5">
                <span
                  className={`font-switzer text-xs font-semibold uppercase tracking-widest ${info.accentClass}`}
                >
                  {info.word}
                </span>
                {i < days.length - 1 && <span className="text-white/20">·</span>}
              </span>
            );
          })}
        </div>
      </Reveal>

      {/* Rows, not cards - a bordered list reads as a deliberate weekly
          programme (closer to a table/schedule) rather than seven
          isolated tiles that each have to be read on their own. Day name
          is now the small eyebrow line; the training type is the largest,
          most prominent text in the row (per design feedback: the type is
          the actionable information, the day name is just an index into
          the week). */}
      <div className="relative z-10 w-full max-w-3xl divide-y divide-white/10 border-y border-white/10">
        {days.map(({ day, label, time }, i) => {
          const info = dayTypeInfo(label);
          return (
            <Reveal key={day} delay={i * 60}>
              {/* data-fab-avoid: the floating Book In/back-to-top stack can
                  end up sitting over whichever row is scrolled into that
                  position - same issue hit on How It Works and the old
                  card grid here. */}
              <div
                data-fab-avoid
                className="flex flex-col gap-2 px-4 py-5 transition-colors duration-300 [@media(hover:hover)]:hover:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 sm:py-4"
              >
                <div className="flex flex-col gap-1">
                  <p className="font-switzer text-xs font-medium uppercase tracking-[0.15em] text-white/40">
                    {day}
                  </p>
                  <p
                    className={`flex items-center gap-2 font-switzer text-2xl font-medium tracking-tight sm:text-3xl ${info.accentClass}`}
                  >
                    {info.marker === "dot" ? (
                      <span className="inline-block size-1.5 shrink-0 rounded-full bg-current" />
                    ) : (
                      <span className="text-white/30">&mdash;</span>
                    )}
                    {info.word}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 font-switzer text-sm tabular-nums text-white/60 sm:text-base">
                  {time ? (
                    <>
                      <Clock className="size-4 shrink-0" strokeWidth={1.5} />
                      {time}
                    </>
                  ) : (
                    <span className="text-white/40">Rest &amp; recovery</span>
                  )}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* BOOK YOUR TRAINING is the primary action; VIEW FULL SCHEDULE was
          previously an equal-weight outlined button competing for the same
          attention. Demoted to a plain text link so the hierarchy reads
          training rhythm -> schedule -> booking, not two parallel CTAs. */}
      <div className="relative z-10 flex flex-col items-center gap-5 sm:flex-row sm:gap-8">
        <BookInButton className="w-fit rounded-[6px] bg-cta px-8 py-4 text-center font-switzer text-base font-medium uppercase tracking-wide text-white transition-all duration-200 ease-out hover:bg-aquatic hover:text-dark-ocean-blue hover:scale-105 hover:shadow-lg hover:shadow-cta/40 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2">
          Book your training
        </BookInButton>
        <a
          href="#water-schedule"
          className="font-switzer text-sm font-medium uppercase tracking-widest text-white/60 underline decoration-white/30 underline-offset-4 transition hover:text-white hover:decoration-white"
        >
          View full schedule
        </a>
      </div>
    </section>
  );
}
