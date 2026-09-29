import type { PricingTier } from "@/lib/content";
import BookInButton from "./BookInButton";

// Re-skinned from four boxed white SaaS-style cards into an editorial
// programme catalogue - thin rules dividing each block of information
// (package/duration/price, includes, bonus, quote, CTA) on a transparent
// navy ground, rather than a white rounded box with shadow/hover-lift
// theatrics. Same fields, same four inline tiers, same "Includes" content -
// this is a skin change, not a data change, so it works identically
// whether the tier came from the code fallback or a live Sanity document.
// Shortened description for one tier so it holds to three lines like the
// others. Applied on top of whatever Sanity returns, keyed by tier name.
const QUOTE_OVERRIDE_BY_NAME: Record<string, string> = {
  "ultimate freediver":
    "The most complete freediving experience, for those ready to make it a lifestyle and push their limits.",
};

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
      className={`relative flex h-auto w-full flex-col gap-6 rounded-lg border p-7 transition-colors duration-300 md:h-full md:rounded-none md:border-0 md:pt-8 ${
        tier.popular ? "border-cta bg-cta/10 md:rounded-[6px]" : "border-white/15 hover:border-cta/40"
      }`}
    >
      {/* Package number removed - min-h-[20px] kept as a reserved spacer so
          every card's name/price block still starts at the same y position
          across the row, whether or not this particular tier shows the
          "Most popular" tag. */}
      <div className="flex min-h-[26px] items-center justify-start">
        {tier.popular && (
          <span className="rounded-full border border-white/15 bg-gradient-to-b from-white/[0.10] to-cta/[0.08] px-3 py-1 [backdrop-filter:blur(8px)] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] font-switzer text-[11px] font-semibold uppercase tracking-widest text-white">
            Most popular
          </span>
        )}
      </div>

      {/* Three deliberately different scales - a loud name, a quiet
          duration line, and a dominant price - instead of a header block
          where everything sits within one step of everything else. */}
      <div className="flex flex-col gap-1">
        <p className="font-switzer text-2xl font-semibold uppercase tracking-tight text-white">
          {tier.name}
        </p>
        <p className="font-switzer text-sm font-medium uppercase tracking-[0.12em] text-white/60">
          {tier.duration}
        </p>
        <p className="mt-3 font-switzer text-6xl font-extralight tracking-tighter text-white">
          {tier.price}
        </p>
      </div>

      {/* Testimonial sits directly under the price so it lines up across
          all four tiers. Upright, brighter text with a cyan rule. */}
      <div className="relative lg:min-h-[4.5rem]">
        <p className="font-switzer text-[15px] font-light leading-relaxed text-white/70">
          {QUOTE_OVERRIDE_BY_NAME[tier.name.trim().toLowerCase()] ?? tier.quote}
        </p>
        {tier.quoteAuthor && (
          <p className="mt-2 font-switzer text-xs font-medium uppercase tracking-[0.15em] text-white/40">
            {tier.quoteAuthor}
          </p>
        )}
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
            <li
              key={f.label}
              className="flex items-baseline gap-2.5 font-switzer text-[15px] font-light leading-relaxed text-white/80"
            >
              <span className="font-switzer text-[15px] font-semibold tabular-nums text-white">{String(f.count).replace(/^0+(?=\d)/, "")}</span>
              <span>{f.label}</span>
            </li>
          ))}
          {tier.bonus && (
            <li className="mt-5 flex flex-col gap-0.5">
              <span className="font-switzer text-xs font-semibold uppercase tracking-[0.2em] text-cta">
                Bonus
              </span>
              <span className="font-switzer text-[15px] font-light leading-relaxed text-white/80">
                {tier.bonus}
              </span>
            </li>
          )}
        </ul>
      </div>

      {!tier.bonus && tier.goodFor && (
        <div className="-mx-7 mt-auto border-t border-white/10 px-7 pt-5">
          <p className="font-switzer text-xs font-semibold uppercase tracking-[0.2em] text-cta">
            Good for
          </p>
          <p className="mt-1 font-switzer text-[14px] font-light leading-relaxed text-white/65">
            {tier.goodFor}
          </p>
        </div>
      )}

      {/* Site-wide CTA copy/size unified to one "Book your dive" button
          (see BookInButton) - the per-tier aria-label keeps four adjacent,
          visually-identical buttons distinguishable for screen-reader and
          keyboard users, without reintroducing four different visible
          labels. */}
      {/* Recommended tier's button carries the same shadow-cta/40 glow the
          base button only shows on hover (see BookInButton) as its resting
          state - the "start here" signal used to live only in the small
          "Most popular" label at the top of the card, easy to have already
          scrolled past by the time a comparing eye reaches the CTA row.
          Same button, same copy, same size - just quietly brighter. */}
      <BookInButton
        data-fab-avoid
        aria-label={`Book your dive — ${tier.name}`}
        className={`w-full ${!tier.bonus && tier.goodFor ? "" : "mt-auto"} ${
          tier.popular
            ? "!border !border-transparent shadow-lg shadow-cta/40"
            : "!border !border-white/15 !bg-white/[0.06] [backdrop-filter:blur(8px)] hover:!bg-white/[0.12] hover:!text-white hover:!shadow-none"
        }`}
      >
        Choose this course
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
      className="relative flex flex-col items-center gap-6 px-6 py-[40px] md:gap-8 md:px-16 md:pt-[40px] md:pb-[40px] lg:gap-20 lg:pt-28 lg:pb-40 scroll-mt-20"
    >
      {/* One contained glow behind the recommended plan (3rd of 4 columns) -
          the page's one deliberate mid-page glow moment (with Hero and the
          final CTA in the footer being the only other two on the whole
          page), so the emphasis reads as "this one plan", not ambient haze. */}
      <div>
        <div className="relative z-10 flex flex-col items-center gap-10 text-center">
          <h2 className="font-switzer text-4xl font-extralight tracking-tight text-white md:text-6xl">
            Pricing
          </h2>
          {/* Mobile hint that there's more than one screen's worth of cards -
              the carousel below has no visible edge of the next card peeking
              in once you're mid-scroll, so this is the one place that tells
              the user to keep swiping. Was a separate <p> outside this div,
              pulled up under the heading with a negative margin sized to
              cancel out the section's own gap - fragile, it broke every time
              that gap value changed. Living inside the same gap-10 column as
              the heading now, same heading-to-paragraph spacing pattern
              Dry Day Schedule and every other section on the page use. */}
          <p className="font-switzer text-xs font-medium uppercase tracking-widest text-white/40 md:hidden">
            Swipe to compare →
          </p>
        </div>
      </div>
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
      {/* mt-4 (mobile only) is extra space on top of the section's own
          gap-6, just for this one gap between the swipe hint and the cards
          - kept off md/lg so it doesn't touch the desktop/tablet grid, and
          separate from the section gap so it doesn't also reopen the gap
          below the cards, which was intentionally tightened. */}
      <div className="relative z-10 mt-4 flex w-full gap-4 overflow-x-auto px-1 pb-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] md:mt-0 md:flex md:grid-cols-none md:divide-x-0 md:divide-y-0 md:overflow-x-auto md:px-1 md:pb-2 lg:grid lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-y-0 lg:divide-white/10 lg:overflow-visible lg:px-0 lg:pb-0">
        {tiers.map((tier, i) => (
          <div
            key={tier.name}
            // 82% -> 78% on the true-mobile tier (below sm, where this is a
            // percentage of the viewport rather than the sm:w-[360px] fixed
            // card used from sm up) - narrow enough that the next card's
            // edge is now reliably visible past the current one, so the
            // "Swipe to compare" hint above becomes a nice-to-have instead
            // of the only thing telling a visitor there's more to scroll to.
            className="h-auto w-[78%] shrink-0 snap-start sm:w-[360px] md:h-auto md:w-[360px] md:shrink-0 md:snap-align-none lg:h-full lg:w-auto lg:shrink lg:snap-align-none"
          >
            <PricingCard tier={tier} index={i} />
          </div>
        ))}
      </div>
      {/* Now a real mailto link (was plain text) - visually secondary to
          the per-card "Book this course" CTAs above, but clearly clickable:
          cyan accent on the actionable half of the sentence, an underline
          that animates in on hover, and an arrow, without becoming a
          second button competing with the cards. */}
      <div className="relative z-10">
        <a
          href={`mailto:${contactEmail}?subject=${encodeURIComponent("Custom training inquiry")}`}
          className="group/custom inline-flex flex-wrap items-center justify-center gap-x-2 text-center font-switzer text-lg font-light text-white/70 transition hover:text-white"
        >
          <span>Looking for something different?</span>
          <span className="inline-flex items-center gap-1.5 font-medium text-cta underline decoration-cta/40 underline-offset-4 transition group-hover/custom:decoration-cta">
            Custom training is available on request
          </span>
        </a>
      </div>
    </section>
  );
}
