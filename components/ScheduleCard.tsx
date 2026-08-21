"use client";

import { useEffect, useRef, useState } from "react";
import FadeImage from "./FadeImage";
import { useLightbox } from "./LightboxContext";

export type ScheduleCardData = {
  title: string;
  image: string;
  copy: string;
  time?: string;
};

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5 shrink-0">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ScheduleCard({
  title,
  image,
  copy,
  time = "07:00 - 10:00",
}: ScheduleCardData) {
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
      className={`flex h-full w-full flex-col overflow-hidden rounded-lg border shadow-md transition-all duration-300 md:hover:-translate-y-0.5 md:hover:border-cta/60 md:hover:shadow-lg md:hover:shadow-cta/10 ${
        active ? "-translate-y-0.5 border-cta/60 shadow-lg shadow-cta/10" : "border-transparent"
      }`}
    >
      <div className="relative h-[350px] w-full overflow-hidden">
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
        <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-dark-ocean-blue/80 px-3 py-1.5 text-aquatic">
          <ClockIcon />
          <span className="font-switzer text-lg font-medium tracking-wide">{time}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 bg-gradient-to-br from-[#184664] to-[#084166] px-10 pb-10 pt-6">
        <p className="font-switzer text-2xl font-light tracking-tight text-white">
          {title}
        </p>
        <p className="font-switzer text-xl font-light leading-relaxed text-[#d3e3fd]">
          {copy}
        </p>
      </div>
    </div>
  );
}
