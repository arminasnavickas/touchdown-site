import type { PricingTier } from "@/lib/content";
import Blob from "./Blob";
import Reveal from "./Reveal";
import BookInButton from "./BookInButton";

// Re-skinned from four boxed white SaaS-style cards into an editorial
// programme catalogue - thin rules dividing each block of information
// (package/duration/price, includes, bonus, quote, CTA) on a transparent
// navy ground, rather than a white rounded box with shadow/hover-lift
// theatrics. Same fields, same four inline tiers, same "Includes" content -
// this is a skin change, not a data change, so it works identically
// whether the tier came from the code fallback or a live Sanity document.
function PricingCard({ tier, index }: { tier: PricingTier; index: number }) {
  return (
    <div
      // Recommended tier reads through the "Most popular" label, cyan
      // border, and tinted background alone now - no vertical shift.
      // A shift (first a negative margin, then a transform) always moved
      // this one card's box out of sync with something else: a margin
      // shift misaligned its flush-bottom "Book this course" button
      // against the other three; a transform kept the button aligned but
      // left the tinted background shorter than the full-height column
      // divider beside it. Every card now shares identical box geometry,
      // so both line up automatically.
      className={`relative flex h-full w-full flex-col gap-6 rounded-lg border p-7 transition-colors duration-300 md:rounded-none md:border-0 ${
        tier.popular ? "border-cta bg-cta/5" : "border-white/15 hover:border-cta/40"
      }`}
    >
      {/* Package number removed - min-h-[20px] kept as a reserved spacer so
          every card's name/price block still starts at the same y position
          across the row, whether or not this particular tier shows the
          "Most popular" tag. */}
      <div className="flex min-h-[20px] items-center justify-start">
        {tier.popular && (
          <span className="font-switzer text-xs font-semibold uppercase tracking-widest text-cta">
            Most popular
          </span>
        )}
      </div>

      {/* Three deliberately different scales - a loud name, a quiet
          duration line, and a dominant price - instead of a header block
          where everything sits within one step of everything else. */}
      <div className="flex flex-col gap-1.5">
        <p className="font-switzer text-2xl font-semibold uppercase tracking-tight text-white">
          {tier.name}
        </p>
        <p className="font-switzer text-xs font-medium uppercase tracking-[0.15em] text-white/40">
          {tier.duration}
        </p>
        <p className="mt-3 font-switzer text-6xl font-extralight tracking-tighter text-white">
          {tier.price}
        </p>
      </div>

      {/* Count numeral removed - just the label list now, one per line.
          -mx-7 px-7 pulls the rule out to the card's full outer edge (so it
          lines up with the card's own border/background) while keeping the
          text content at its original padded position. */}
      <div className="-mx-7 flex flex-col gap-2.5 border-t border-white/10 px-7 pt-5">
        <p className="font-switzer text-xs font-semibold uppercase tracking-[0.2em] text-cta">
          Includes
        </p>
        <ul className="flex flex-col gap-2">
          {tier.features.map((f) => (
            <li key={f.label} className="font-switzer text-[15px] font-light leading-relaxed text-white/80">
              {f.label}
            </li>
          ))}
        </ul>
      </div>

      {/* Bonus gets its own thin-ruled block instead of a filled highlight
          box - every tier renders *something* here (Bonus if it has one,
          otherwise a "Good for" positioning line) so the rhythm of rules
          down the card never skips a beat. */}
      {(tier.bonus || tier.goodFor) && (
        <div className="-mx-7 border-t border-white/10 px-7 pt-5">
          <p className="font-switzer text-xs font-semibold uppercase tracking-[0.2em] text-cta">
            {tier.bonus ? "Bonus" : "Good for"}
          </p>
          <p className="mt-1 font-switzer text-[15px] font-light leading-relaxed text-white/80">
            {tier.bonus ?? tier.goodFor}
          </p>
        </div>
      )}

      {/* Testimonial - one short line with a plain attribution, kept well
          below the actual product information (what's included, what it
          costs) in visual weight. */}
      <p className="-mx-7 border-t border-white/10 px-7 pt-5 font-switzer text-[15px] font-light italic leading-relaxed text-white/50">
        &ldquo;{tier.quote}&rdquo;{" "}
        <span className="not-italic text-white/30">{tier.quoteAuthor}</span>
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
  contactEmail,
}: {
  tiers: PricingTier[];
  kicker: string;
  contactEmail: string;
}) {
  return (
    // One of the page's three strongest information moments (with Hero and
    // How It Works) - py stays bumped up so it reads as a bigger beat than
    // the supporting sections around it. Bottom padding is deliberately
    // larger than top (pb-32/md:pb-40 vs pt-24/md:pt-28) - a bigger,
    // intentional pause before the next section instead of the cards
    // feeling attached to it. overflow-hidden removed (was clipping card
    // content, e.g. the "Most popular" card's elevated -mt-4/pb-11) - the
    // Blob glow is small and mid-section, so it doesn't need the section to
    // clip in order to stay contained.
    <section
      id="prices"
      className="relative flex flex-col items-center gap-16 px-6 pt-24 pb-32 md:gap-20 md:px-16 md:pt-28 md:pb-40 scroll-mt-20"
    >
      {/* One contained glow behind the recommended plan (3rd of 4 columns) -
          the page's one deliberate mid-page glow moment (with Hero and the
          final CTA in the footer being the only other two on the whole
          page), so the emphasis reads as "this one plan", not ambient haze. */}
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
      {/* Mobile hint that there's more than one screen's worth of cards -
          the carousel below has no visible edge of the next card peeking
          in once you're mid-scroll, so this is the one place that tells the
          user to keep swiping. */}
      <p className="relative z-10 -mt-8 font-switzer text-xs font-medium uppercase tracking-widest text-white/40 md:hidden">
        Swipe to compare →
      </p>
      {/* Mobile: a horizontal snap-scroll carousel (one discrete card at a
          time, matching the Reviews scroller's pattern) instead of four
          full-height blocks stacked top to bottom - every package still
          shows its full Includes/Bonus/CTA, just one swipe away from the
          next rather than a long scroll away. Desktop keeps the grid: items
          -start removed (was preventing the cards from stretching to match
          row height) so the grid's default stretch behavior, plus h-full on
          both the Reveal wrapper and the card itself, makes every card in a
          row exactly as tall as its tallest sibling. A thin shared divider
          column-to-column (divide-x) reinforces the "programme catalogue"
          feel now that the cards no longer carry their own boxed
          border/shadow. */}
      <div className="relative z-10 flex w-full gap-4 overflow-x-auto px-1 pb-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:gap-0 md:divide-x md:divide-y-0 md:divide-white/10 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4">
        {tiers.map((tier, i) => (
          <Reveal
            key={tier.name}
            delay={i * 100}
            className="h-full w-[82%] shrink-0 snap-start sm:w-[360px] md:w-auto md:shrink md:snap-align-none"
          >
            <PricingCard tier={tier} index={i} />
          </Reveal>
        ))}
      </div>
      {/* Now a real mailto link (was plain text) - visually secondary to
          the per-card "Book this course" CTAs above, but clearly clickable:
          cyan accent on the actionable half of the sentence, an underline
          that animates in on hover, and an arrow, without becoming a
          second button competing with the cards. */}
      <Reveal className="relative z-10">
        <a
          href={`mailto:${contactEmail}?subject=${encodeURIComponent("Custom training inquiry")}`}
          className="group/custom inline-flex flex-wrap items-center justify-center gap-x-2 text-center font-switzer text-lg font-light text-white/70 transition hover:text-white"
        >
          <span>Looking for something different?</span>
          <span className="inline-flex items-center gap-1.5 font-medium text-cta underline decoration-cta/40 underline-offset-4 transition group-hover/custom:decoration-cta">
            Custom training is available on request
            <span aria-hidden className="transition-transform duration-200 group-hover/custom:translate-x-1">
              →
            </span>
          </span>
        </a>
      </Reveal>
    </section>
  );
}
