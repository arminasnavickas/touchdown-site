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
    <div
      ref={cardRef}
      // Radius bumped from rounded-lg (8px) to a consistent 14px - the
      // start of standardizing a shared card radius across the site's
      // photo cards rather than each one picking its own.
      className={`flex h-full w-full flex-col overflow-hidden rounded-[14px] border shadow-md transition-all duration-300 md:hover:-translate-y-0.5 md:hover:border-cta/60 md:hover:shadow-lg md:hover:shadow-cta/10 ${
        active ? "-translate-y-0.5 border-cta/60 shadow-lg shadow-cta/10" : "border-transparent"
      }`}
    >
      <div className="relative h-[280px] w-full overflow-hidden">
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
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-dark-ocean-blue/90 via-dark-ocean-blue/30 to-transparent" />

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

        {/* Step number + title moved onto the photo (over the gradient
            above) rather than into the panel below - gives this card the
            same "01 / 02 / 03..." journey system as the rest of the site,
            and frees the panel below to be copy-only. */}
        <div className="pointer-events-none absolute inset-x-5 bottom-4 flex flex-col gap-0.5">
          <span className="font-switzer text-xs font-semibold tracking-[0.2em] text-aquatic">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-switzer text-2xl font-medium tracking-tight text-white md:text-3xl">
            {title}
          </span>
        </div>
      </div>

      {/* Copy-only now, and noticeably shorter (px-10/pb-10/pt-6 -> tighter
          padding below) - the old panel had a lot of empty space beneath a
          short paragraph once the title/number moved onto the photo. */}
      <div className="flex flex-1 flex-col bg-gradient-to-br from-[#184664] to-[#084166] px-6 py-5 md:px-8 md:py-6">
        <p className="font-switzer text-lg font-light leading-relaxed text-[#d3e3fd] md:text-xl">
          {copy}
        </p>
      </div>
    </div>
  );
}
