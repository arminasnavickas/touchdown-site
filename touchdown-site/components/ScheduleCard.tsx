"use client";

import { useEffect, useRef, useState } from "react";
import FadeImage from "./FadeImage";
import { useLightbox } from "./LightboxContext";

export type ScheduleCardData = {
  title: string;
  image: string;
  copy: string;
  time?: string;
  // Short action word for the time badge ("PICK-UP", "IN WATER"...) - gives
  // the time meaning on its own ("07:00 · PICK-UP") instead of it being a
  // bare number floating over the photo. Optional so older/CMS content
  // without it still renders fine (badge is simply omitted).
  badge?: string;
};

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4 shrink-0">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ScheduleCard({
  index,
  title,
  image,
  copy,
  time = "07:00 - 10:00",
  badge,
}: ScheduleCardData & { index: number }) {
  const { openLightbox } = useLightbox();
  const [active, setActive] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // On mobile, highlight the card as it scrolls through the center of the
  // viewport (like the nav's scroll-spy) instead of only on tap, which is
  // what the plain `hover:` variant was doing on touch devices. Desktop
  // keeps its own real :hover highlight via the md:hover: classes below.
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "-35% 0px -35% 0px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    // Un-boxed - the old bordered, shadowed, rounded-14 card with a
    // gradient-filled copy panel underneath is exactly the "card in a
    // rounded rectangle with a shadow" pattern being dialed back site-wide.
    // The photo keeps its own rounded corners (matching How It Works/Team's
    // treatment); the copy below sits directly on the section's navy
    // background behind a thin rule instead of inside a filled box. The
    // mobile scroll-active state now nudges the whole block up slightly
    // instead of lighting up a border/shadow that no longer exists.
    <div
      ref={cardRef}
      className={`flex h-full w-full flex-col gap-4 transition-transform duration-300 md:hover:-translate-y-1 ${
        active ? "-translate-y-1" : ""
      }`}
    >
      <div className="relative h-[220px] w-full overflow-hidden rounded-md md:h-[280px]">
        <button
          type="button"
          onClick={() => openLightbox([image], 0)}
          className="absolute inset-0 cursor-zoom-in"
          aria-label="View full image"
        >
          <FadeImage
            src={image}
            alt={title}
            wrapperClassName="h-full w-full"
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
          />
        </button>

        {/* Subtle bottom gradient so the step number/title below can sit
            directly on the photo and stay legible, instead of needing a
            separate solid-color block underneath just to hold the title -
            this is what lets the panel below shrink so much. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Time badge now carries meaning on its own ("07:00 · PICK-UP")
            instead of a bare number floating over the photo - it reads as
            information belonging to this step, not a generic UI overlay. */}
        <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-dark-ocean-blue/80 px-3 py-1.5 text-aquatic">
          <ClockIcon />
          <span className="font-switzer text-base font-medium tracking-wide tabular-nums">
            {time}
          </span>
          {badge && (
            <>
              <span aria-hidden className="text-aquatic/40">
                ·
              </span>
              <span className="font-switzer text-xs font-semibold uppercase tracking-widest">
                {badge}
              </span>
            </>
          )}
        </div>

        {/* Step number removed - just the title sits on the photo now. */}
        <div className="pointer-events-none absolute inset-x-5 bottom-4 flex flex-col gap-0.5">
          <span className="font-switzer text-2xl font-medium tracking-tight text-white md:text-3xl">
            {title}
          </span>
        </div>
      </div>

      {/* Copy-only, on the section's own background behind a thin rule -
          replaces the filled gradient box. */}
      <div className="flex flex-1 flex-col border-t border-white/10 pt-4">
        <p className="font-switzer text-[15px] font-light leading-relaxed text-white/70">
          {copy}
        </p>
      </div>
    </div>
  );
}
