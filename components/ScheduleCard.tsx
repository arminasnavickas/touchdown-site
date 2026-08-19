"use client";

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
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-transparent shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:border-cta/60 hover:shadow-lg hover:shadow-cta/10">
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
