import Blob from "./Blob";
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
    // Glow removed at one point (part of the page-wide cut to
    // strategic-only cyan glow), then partially brought back (see Blob
    // below) - and the gap/padding brought down from the old
    // gap-[100px]/py-20 - this is a compact, scannable schedule, not a
    // showcase section, so it shouldn't carry the same amount of empty
    // space as one.
    <section id="water-schedule" className="relative flex flex-col items-center gap-10 px-6 py-14 md:gap-12 md:px-16 md:py-16 scroll-mt-20">
      {/* Top-right, bled upward into Weekly Training Rhythm above (same
          later-section-paints-on-top logic as the other seam blobs on this
          page). Sized up rather than down (460px vs. the 380px used at
          About Us/Where You'll Train/What You Get) - this is the section
          where the school's actual depth training happens (the Blue Hole),
          so the biggest blob on the page belongs here rather than at a
          photo-only section, size standing in for the theme instead of
          being picked for arbitrary variety. Kept dim (opacity-40, ~24%
          effective stacked on Blob's own baked-in 60% alpha - the site's
          standard glow strength, same as Training Rhythm/The Facility/What
          You Get/FAQ, one of exactly 3 named strengths: standard (40),
          strong (80, About Us only), full/undimmed (Hero, Pricing, Footer's
          three deliberate glow moments)) so "biggest" doesn't also mean
          "brightest" competing with the schedule cards below it. */}
      <Blob className="top-[-120px] right-6 h-[460px] w-[460px] opacity-40" />
      <Reveal>
        <div className="relative z-10 flex max-w-3xl flex-col items-center gap-10 text-center">
          {/* "The training system · Part 02" kicker removed. */}
          <div className="flex flex-col items-center gap-3">
            <h2 className="font-switzer text-4xl font-extralight tracking-tight text-white md:text-6xl">
              {heading}
            </h2>
          </div>
          {/* Left-aligned at every width now (was md:text-center) - two full
              sentences of body copy, not a tagline, so it gets the same
              treatment as the other multi-sentence copy blocks on the page. */}
          <div className="text-left font-switzer text-[15px] font-light leading-relaxed text-white/70">
            {subcopyLines.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      </Reveal>
      {/* First card ("Preparation") leads full-width and featured (see
          ScheduleCard's featured prop) with the remaining three following
          in a row - was a plain 2x2 grid identical in shape to Dry Day
          Schedule's grid below and Where You'll Train's photo grid above.
          Water day is the section with the most content (four events vs.
          Dry Day's two) and the page's biggest glow already marks it as
          the main event, so the layout now carries that same weight
          instead of every card reading as interchangeable. */}
      <div className="relative z-10 grid w-full grid-cols-1 gap-6 md:grid-cols-3">
        {cards.map((card, i) => (
          <Reveal key={card.title} delay={i * 100} className={i === 0 ? "md:col-span-3" : ""}>
            <ScheduleCard {...card} index={i} featured={i === 0} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
