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
        {/* A fixed grid (one column per logo) always lays out on a single
            row, no matter the viewport width or how many logos there are -
            each column divides the available width evenly, and
            object-contain shrinks the logo to fit its column instead of
            overflowing or triggering a scrollbar. No flex-wrap, no
            overflow-x, no slider. */}
        <div
          className="relative z-10 mx-auto grid w-full max-w-4xl items-center gap-x-4 md:gap-x-12"
          style={{ gridTemplateColumns: `repeat(${logos.length}, minmax(0, 1fr))` }}
        >
          {logos.map((friend, i) => {
            const image = (
              <FadeImage
                src={friend.image}
                alt={friend.name}
                wrapperClassName="h-6 w-full md:h-10"
                className="h-6 w-full object-contain grayscale opacity-60 transition duration-300 group-hover:grayscale-0 group-hover:opacity-100 md:h-10"
              />
            );
            return friend.url ? (
              <a
                key={i}
                href={friend.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={friend.name}
                className="group flex items-center justify-center"
              >
                {image}
              </a>
            ) : (
              <div key={i} aria-label={friend.name} className="group flex items-center justify-center">
                {image}
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
