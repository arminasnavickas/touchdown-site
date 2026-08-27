import FadeImage from "./FadeImage";
import Reveal from "./Reveal";
import type { FriendLogo } from "@/lib/content";

// A simple trust-signal strip - no card chrome, no copy beyond the heading.
// Logos sit muted (grayscale, reduced opacity) until hovered, matching the
// understated "supporting beat" treatment used by What You Get rather than
// competing with the section's own showcase moments (Hero, How It Works,
// Pricing). Placed after FAQ, before the footer.
export default function OurFriends({
  logos,
  heading,
}: {
  logos: FriendLogo[];
  heading: string;
}) {
  if (logos.length === 0) return null;

  return (
    <section className="relative flex flex-col items-center gap-10 overflow-hidden px-6 py-16 md:px-16 md:py-20">
      <Reveal>
        <p className="text-center font-switzer text-xs font-semibold uppercase tracking-[0.25em] text-cta md:text-sm">
          {heading}
        </p>
      </Reveal>
      <Reveal delay={80} className="w-full">
        {/* flex-nowrap keeps all 5 logos on a single row at every width -
            gap/size step down on mobile so they still fit without
            wrapping; overflow-x-auto is just a safety valve if a future
            6th+ logo ever gets added. */}
        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-nowrap items-center justify-start gap-x-6 overflow-x-auto md:justify-center md:gap-x-16">
          {logos.map((friend, i) => {
            const image = (
              <FadeImage
                src={friend.image}
                alt={friend.name}
                wrapperClassName="h-6 w-auto md:h-10"
                className="h-6 w-auto object-contain grayscale opacity-60 transition duration-300 group-hover:grayscale-0 group-hover:opacity-100 md:h-10"
              />
            );
            return friend.url ? (
              <a
                key={i}
                href={friend.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={friend.name}
                className="group flex shrink-0 items-center"
              >
                {image}
              </a>
            ) : (
              <div key={i} aria-label={friend.name} className="group flex shrink-0 items-center">
                {image}
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
