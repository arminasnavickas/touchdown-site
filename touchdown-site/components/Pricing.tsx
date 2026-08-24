import type { PricingTier } from "@/lib/content";
import Blob from "./Blob";
import Reveal from "./Reveal";
import BookInButton from "./BookInButton";

function PricingCard({ tier }: { tier: PricingTier }) {
  return (
    <div
      // Equal height across all four cards (h-full, on a grid that no
      // longer forces items-start - see the grid below) with the CTA
      // pinned to the bottom via mt-auto, so every card's button lines up
      // on the same baseline regardless of how much bonus/feature content
      // the tier above it has.
      className={`flex h-full w-full flex-col gap-5 rounded-lg border p-7 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
        tier.popular
          ? "border-cta/50 shadow-lg shadow-cta/20 hover:shadow-cta/30 md:-translate-y-2"
          : "border-transparent shadow-md hover:border-cta/60 hover:shadow-cta/10"
      }`}
      style={{
        backgroundImage:
          "linear-gradient(180deg, #FFFFFF 24.83%, rgba(208,235,242,0.1) 98.162%), linear-gradient(#FFFFFF, #FFFFFF)",
      }}
    >
      {/* Fixed-height badge slot on every card, not just the popular one -
          keeps every card's name/price starting from the same baseline
          instead of the popular card's content sitting lower than the rest. */}
      <div className="flex min-h-[28px] items-center justify-center md:justify-start">
        {tier.popular && (
          <span className="rounded bg-cta px-3 py-1 font-switzer text-xs font-semibold uppercase tracking-widest text-dark-ocean-blue">
            Most popular
          </span>
        )}
      </div>

      <div className="flex flex-col items-center gap-1 text-center md:items-start md:text-left">
        <p className="font-switzer text-xl font-semibold uppercase tracking-tight text-dark-ocean-blue">
          {tier.name}
        </p>
        {/* Duration + ladder step on one line ("1 Day · Try it") rather than
            a separate row each - keeps the header compact and makes the
            Discovery -> Freedom Flow -> Deep Mastery -> Ultimate progression
            legible without adding another line to every card. */}
        <p className="font-switzer text-sm font-medium uppercase tracking-widest text-dark-ocean-blue/50">
          {tier.duration} &middot; {tier.step}
        </p>
        <p className="mt-2 font-switzer text-5xl font-extralight tracking-tight text-horizon">
          {tier.price}
        </p>
      </div>

      {/* Numeric benefit system - "04  Lectures" reads and compares across
          cards far faster than a bulleted sentence, especially once you're
          scanning four cards side by side. */}
      <div className="flex flex-col gap-2.5">
        <p className="font-switzer text-xs font-semibold uppercase tracking-[0.15em] text-aquatic">
          Includes
        </p>
        <ul className="flex flex-col gap-2">
          {tier.features.map((f) => (
            <li key={f.label} className="flex items-baseline gap-3">
              <span className="w-6 shrink-0 font-switzer text-sm font-semibold tabular-nums text-cta">
                {f.count}
              </span>
              <span className="font-switzer text-base font-light text-dark-ocean-blue">
                {f.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bonus gets its own small highlighted row instead of being tacked
          onto the end of the features list as "Bonus: ..." - it's meant to
          read as extra value, not one more list item. */}
      {tier.bonus && (
        <div className="rounded-md bg-aquatic/10 px-4 py-3">
          <p className="font-switzer text-xs font-semibold uppercase tracking-[0.15em] text-horizon">
            Bonus
          </p>
          <p className="font-switzer text-base font-light text-dark-ocean-blue">
            {tier.bonus}
          </p>
        </div>
      )}

      {/* Testimonial cut down to one short line with a plain attribution
          instead of a large highlighted quote box - it was competing with
          the actual product information (what's included, what it costs)
          for visual weight it shouldn't have on a pricing card. */}
      <p className="font-switzer text-sm font-light italic leading-relaxed text-dark-ocean-blue/60">
        &ldquo;{tier.quote}&rdquo;{" "}
        <span className="not-italic text-dark-ocean-blue/40">&mdash; {tier.quoteAuthor}</span>
      </p>

      {/* "Book in" -> "Book this course" - there are four distinct
          products here, so the CTA names the action instead of using a
          generic phrase that reads slightly off in English. */}
      <BookInButton
        data-fab-avoid
        className="mt-auto flex w-full items-center justify-center gap-2 rounded-[6px] bg-cta px-8 py-3 text-center font-switzer text-base font-medium uppercase tracking-wide text-white transition-all duration-200 ease-out hover:bg-aquatic hover:text-dark-ocean-blue hover:scale-105 hover:shadow-lg hover:shadow-cta/40 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2"
      >
        Book this course
        <span aria-hidden>→</span>
      </BookInButton>
    </div>
  );
}

export default function Pricing({
  tiers,
  kicker,
}: {
  tiers: PricingTier[];
  kicker: string;
}) {
  return (
    <section
      id="prices"
      className="relative flex flex-col items-center gap-[100px] overflow-hidden px-6 py-20 md:px-16 scroll-mt-20"
    >
      {/* One contained glow behind the recommended plan (3rd of 4 columns)
          instead of two broad blobs washing the whole row in cyan - the
          emphasis should read as "this one", not general background haze. */}
      <Blob className="left-[63%] top-[58%] h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2" />
      <Reveal>
        <div className="relative z-10 flex flex-col items-center gap-10 text-center">
          <h2 className="font-switzer text-4xl font-extralight tracking-tight text-white md:text-6xl">
            Pricing
          </h2>
          <p className="font-switzer text-base font-normal uppercase tracking-widest text-danish-blue">
            {kicker}
          </p>
        </div>
      </Reveal>
      {/* items-start removed (was preventing the cards from stretching to
          match row height) so the grid's default stretch behavior, plus
          h-full on both the Reveal wrapper and the card itself, makes every
          card in a row exactly as tall as its tallest sibling. */}
      <div className="relative z-10 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {tiers.map((tier, i) => (
          <Reveal key={tier.name} delay={i * 100} className="h-full">
            <PricingCard tier={tier} />
          </Reveal>
        ))}
      </div>
      <Reveal className="relative z-10">
        <p className="text-center font-switzer text-lg font-light text-white/70">
          Looking for something different? Custom training is available on request.
        </p>
      </Reveal>
    </section>
  );
}
