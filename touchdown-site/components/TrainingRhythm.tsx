import BookInButton from "./BookInButton";
import { Clock } from "lucide-react";
import Reveal from "./Reveal";
import type { ScheduleDay } from "@/lib/content";

// Day type is inferred from the label text rather than added as a new CMS
// field, so this works with the existing Sanity content as-is. Deliberately
// NOT three different colours (per design feedback: small tonal/label
// differences are enough to scan by, more colour reads as decoration) -
// water gets the brand's aquatic accent, dry stays neutral white, rest
// drops to a quiet muted tone so it visually recedes rather than competing
// for attention on the one day there's nothing scheduled.
function dayTypeInfo(label: string) {
  const normalized = label.toLowerCase();
  if (normalized.includes("water")) {
    return { word: "WATER", accentClass: "text-aquatic" };
  }
  if (normalized.includes("dry")) {
    return { word: "DRY", accentClass: "text-white" };
  }
  return { word: "REST", accentClass: "text-white/40" };
}

// Derived, not new data - a 3-letter abbreviation ("SAT", "SUN"...) pulled
// from the existing day field so the row reads as a real weekly timeline
// (SAT / WATER, SUN / WATER, MON / DRY...) instead of a full day name
// sitting above the type as a small caption.
function dayAbbrev(day: string) {
  return day.trim().slice(0, 3).toUpperCase();
}

export default function TrainingRhythm({
  days,
  heading,
}: {
  days: ScheduleDay[];
  heading: string;
}) {
  return (
    // Glow removed and padding/gap tightened - this section, plus the
    // Water/Dry day schedules right after it, are meant to read as a
    // compact, scannable programme rather than another spacious showcase
    // section, so it no longer matches the site's flat py-20 default.
    <section
      id="schedule"
      className="relative flex flex-col items-center gap-8 overflow-hidden px-6 py-16 md:gap-10 md:px-16 md:py-20 scroll-mt-20"
    >
      <Reveal>
        <div className="relative z-10 flex flex-col items-center gap-3 text-center">
          {/* "The training system · Part 01" kicker removed - this section
              no longer frames itself as part of a numbered system. */}
          <h2 className="text-center font-switzer text-4xl font-extralight tracking-tight text-white md:text-6xl">
            {heading}
          </h2>
        </div>
      </Reveal>

      {/* The pattern strip - WATER · WATER · DRY · ... - exists purely to
          communicate the *rhythm* itself at a glance (why the week is
          shaped this way) before the reader gets into individual days.
          Derived from the same days array so it can never drift out of
          sync with the list below it. The small "Weekly training rhythm"
          label above it was removed - the heading above now already reads
          "Weekly Training Rhythm", so the label was a duplicate. */}
      <Reveal className="relative z-10 flex flex-col items-center gap-3">
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
                className="flex flex-row items-center justify-between gap-4 px-4 py-5 transition-colors duration-300 [@media(hover:hover)]:hover:bg-white/[0.03] sm:gap-6 sm:px-6 sm:py-4"
              >
                {/* Day abbreviation + type now read as one horizontal
                    timeline pairing ("SAT WATER") rather than a small
                    caption stacked above a large word - the day itself
                    becomes a graphic element, tabular and thin, instead of
                    a UI label. */}
                <div className="flex items-baseline gap-3 sm:gap-5">
                  <span className="font-switzer text-2xl font-extralight tabular-nums tracking-tight text-white/25 sm:text-4xl">
                    {dayAbbrev(day)}
                  </span>
                  <span
                    className={`font-switzer text-2xl font-medium tracking-tight sm:text-3xl ${info.accentClass}`}
                  >
                    {info.word}
                  </span>
                </div>

                <div className="flex items-center">
                  {time ? (
                    // A day with two separate sessions (e.g. a morning water
                    // block plus an evening one) is stored as "A & B" in a
                    // single time string. Rendered as one long nowrap line
                    // that was overflowing narrow phones (~320px) once two
                    // full HH:MM-HH:MM ranges had to share one pill - split
                    // on " & " and stack each session on its own line
                    // instead of shrinking or truncating the times.
                    (() => {
                      const sessions = time.split(" & ");
                      return (
                        <span
                          className={`flex flex-col items-end gap-0.5 whitespace-nowrap bg-white/10 px-3 py-1.5 font-switzer text-sm font-medium tracking-wide tabular-nums text-white sm:text-base ${
                            sessions.length > 1 ? "rounded-2xl" : "rounded-full"
                          }`}
                        >
                          {sessions.map((session, i) => (
                            <span key={i} className="flex items-center gap-1.5">
                              {i === 0 && <Clock className="size-4 shrink-0" strokeWidth={1.5} />}
                              {session}
                            </span>
                          ))}
                        </span>
                      );
                    })()
                  ) : (
                    <span className="font-switzer text-sm text-white/40 sm:text-base">Rest &amp; recovery</span>
                  )}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* "View full schedule" link removed - BOOK YOUR TRAINING is now the
          section's only action. */}
      <div className="relative z-10 flex items-center">
        <BookInButton className="w-fit rounded-[6px] bg-cta px-8 py-4 text-center font-switzer text-base font-medium uppercase tracking-wide text-white transition-all duration-200 ease-out hover:bg-aquatic hover:text-dark-ocean-blue hover:scale-105 hover:shadow-lg hover:shadow-cta/40 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2">
          Book your training
        </BookInButton>
      </div>
    </section>
  );
}
