import type { PricingTier } from "@/lib/content";
import Blob from "./Blob";
import Reveal from "./Reveal";
import BookInButton from "./BookInButton";

function PricingCard({ tier }: { tier: PricingTier }) {
  return (
    // Padding/gaps/type all step down on mobile - these cards now share a
    // 2-column row there instead of running full width, so the extra room
    // they used to have (p-10, text-6xl price, etc.) is gone. md: variants
    // restore the original desktop sizing untouched.
    <div
      className="flex w-full flex-col items-center gap-3 rounded-lg border border-transparent p-4 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:border-cta/60 hover:shadow-lg hover:shadow-cta/10 md:gap-6 md:p-10"
      style={{
        backgroundImage:
          "linear-gradient(180deg, #FFFFFF 24.83%, rgba(208,235,242,0.1) 98.162%), linear-gradient(#FFFFFF, #FFFFFF)",
      }}
    >
      {tier.popular && (
        <span className="rounded bg-[#57bf5e] px-2 py-0.5 font-switzer text-[10px] font-semibold uppercase tracking-widest text-white md:px-3 md:py-1 md:text-sm">
          Most popular
        </span>
      )}

      <div className="flex flex-col items-center gap-2 text-center md:gap-6">
        <div className="font-switzer text-sm font-light tracking-tight text-dark-ocean-blue md:text-2xl">
          <p>{tier.name}</p>
          <p>{tier.duration}</p>
        </div>
        <p className="font-switzer text-2xl font-extralight tracking-tight text-horizon md:text-6xl">
          {tier.price}
        </p>
      </div>

      <div className="flex w-full flex-col gap-3 md:gap-6">
        <div className="font-switzer text-xs font-light text-dark-ocean-blue md:text-xl">
          <ul className="list-disc pl-4 md:pl-6">
            {tier.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          {tier.bonus && (
            <p className="mt-2 md:mt-4">
              <span className="font-medium">Bonus: </span>
              {tier.bonus}
            </p>
          )}
        </div>
        <div className="rounded-lg bg-aquatic/10 px-3 py-2 md:px-5 md:py-3">
          <p className="font-switzer text-xs font-light italic text-dark-ocean-blue md:text-xl">
            &ldquo;{tier.quote}&rdquo;
          </p>
        </div>
      </div>

      <BookInButton className="w-fit rounded-[6px] bg-cta px-4 py-2 font-switzer text-xs font-medium uppercase tracking-wide text-white transition-all duration-200 ease-out hover:bg-aquatic hover:text-dark-ocean-blue hover:scale-105 hover:shadow-lg hover:shadow-cta/40 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 md:px-8 md:py-4 md:text-base">
        Book in
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
      className="relative flex flex-col items-center gap-[100px] overflow-hidden px-6 py-28 md:px-16 scroll-mt-20"
    >
      <Blob className="left-0 top-[62%] h-[400px] w-[400px] -translate-y-1/2" />
      <Blob className="right-0 top-[8%] h-[300px] w-[300px]" />
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
      <div className="relative z-10 grid w-full grid-cols-1 items-start gap-6 md:grid-cols-2 lg:grid-cols-4">
        {tiers.map((tier, i) => (
          <Reveal key={tier.name} delay={i * 100}>
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
