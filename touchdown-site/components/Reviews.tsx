"use client";

import { useEffect, useRef, useState } from "react";
import FadeImage from "./FadeImage";
import ArticleModal from "./ArticleModal";
import Reveal from "./Reveal";
import type { Review } from "@/lib/content";

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className="size-4"
      fill={filled ? "#FBBF24" : "none"}
      stroke={filled ? "#FBBF24" : "#D1D5DB"}
      strokeWidth="1"
    >
      <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9L10 15l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8L10 1.5Z" />
    </svg>
  );
}

function StarRating({ rating }: { rating: string }) {
  const filledCount = Math.round(parseFloat(rating) || 5);
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} filled={i < filledCount} />
      ))}
    </div>
  );
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-6">
      <path
        d={direction === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ReviewCard({
  review,
  index,
  onOpen,
}: {
  review: Review;
  index: number;
  onOpen: (index: number) => void;
}) {
  const [overflows, setOverflows] = useState(false);
  const quoteRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = quoteRef.current;
    if (!el) return;
    setOverflows(el.scrollHeight > el.clientHeight + 1);
  }, [review.quote]);

  return (
    // Reviewer-led, not quote-led: the byline (photo/name/role/rating) now
    // opens the card with a divider underneath, and the quote follows below
    // it - reads as "who said it" before "what they said", closer to a
    // standard testimonial card than the earlier magazine pull-quote
    // treatment. Card's own styling (flat shadow-sm, rounded-lg, gradient
    // background, dimensions) is unchanged - only the internal order moved.
    <div
      className="flex h-full w-[80%] shrink-0 flex-col gap-3 rounded-lg p-6 shadow-sm transition-shadow duration-300 hover:shadow-md snap-start sm:w-[320px]"
      style={{
        backgroundImage:
          "linear-gradient(180deg, #FFFFFF 24.83%, rgba(208,235,242,0.1) 98.162%), linear-gradient(#FFFFFF, #FFFFFF)",
      }}
    >
      {/* Reviewer row - photo/name/role left, rating right, with a divider
          below it separating the byline from the quote that follows. */}
      <div className="flex items-center gap-2.5 border-b border-dark-ocean-blue/10 pb-3">
        <FadeImage
          src={review.image}
          alt={review.name}
          wrapperClassName="size-9 shrink-0 rounded-full"
          className="h-full w-full object-cover"
        />
        <div className="flex flex-1 flex-col gap-0.5">
          <p className="font-switzer text-sm font-medium text-navy">
            {review.name}
          </p>
          {review.role && (
            <p className="font-switzer text-xs text-dark-ocean-blue/60">{review.role}</p>
          )}
        </div>
        <StarRating rating={review.rating} />
      </div>
      <span aria-hidden className="font-switzer text-4xl font-light leading-none text-cta/25">
        &ldquo;
      </span>
      <p
        ref={quoteRef}
        className="-mt-3 line-clamp-4 font-switzer text-xl font-light leading-relaxed text-dark-ocean-blue"
      >
        {review.quote}
      </p>
      {overflows && (
        <button
          type="button"
          onClick={() => onOpen(index)}
          className="group relative inline-block w-fit self-start font-switzer text-base font-medium text-horizon transition hover:text-cta"
        >
          Read more
          <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-cta transition-all duration-300 group-hover:w-full" />
        </button>
      )}
    </div>
  );
}

export default function Reviews({
  reviews,
  subtitle,
}: {
  reviews: Review[];
  subtitle: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({ startX: 0, startScrollLeft: 0, moved: false });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const scrollBy = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild?.clientWidth ?? 340;
    el.scrollBy({ left: dir === "left" ? -(cardWidth + 24) : cardWidth + 24, behavior: "smooth" });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const el = scrollerRef.current;
    if (!el) return;
    if ((e.target as HTMLElement).closest("button, a")) return;
    setIsDragging(true);
    dragState.current = { startX: e.clientX, startScrollLeft: el.scrollLeft, moved: false };
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const el = scrollerRef.current;
    if (!el) return;
    const delta = e.clientX - dragState.current.startX;
    if (Math.abs(delta) > 4) dragState.current.moved = true;
    el.scrollLeft = dragState.current.startScrollLeft - delta;
  };

  const endDrag = () => setIsDragging(false);

  return (
    <section
      id="reviews"
      className="relative flex flex-col items-center gap-12 overflow-hidden px-6 py-20 md:gap-16 md:px-16 scroll-mt-20"
    >
      <Reveal>
        <div className="relative z-10 flex flex-col items-center gap-4 text-center">
          <p className="font-switzer text-xs font-semibold uppercase tracking-[0.25em] text-cta md:text-sm">
            The proof is in the pudding
          </p>
          <h2 className="font-switzer text-4xl font-extralight tracking-tight text-danish-blue md:text-6xl">
            Reviews
          </h2>
          <p className="font-switzer text-xl font-light text-danish-blue">
            {subtitle}
          </p>
        </div>
      </Reveal>

      <div className="relative z-10 w-full">
        <div
          ref={scrollerRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          className={`flex w-full gap-6 overflow-x-auto px-1 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            isDragging ? "cursor-grabbing select-none" : "cursor-grab snap-x snap-mandatory scroll-smooth"
          }`}
          style={{ scrollPaddingLeft: "1px" }}
        >
          {/* Big featured testimonial removed - every review, including
              what used to be reviews[0], now shows as an equal small card
              in this scroller. */}
          {reviews.map((review, i) => (
            <ReviewCard key={review.name} review={review} index={i} onOpen={setOpenIndex} />
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollBy("left")}
          aria-label="Previous review"
          className="absolute left-0 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-dark-ocean-blue shadow-lg transition hover:bg-aquatic md:flex md:size-12"
        >
          <ArrowIcon direction="left" />
        </button>
        <button
          type="button"
          onClick={() => scrollBy("right")}
          aria-label="Next review"
          className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-white text-dark-ocean-blue shadow-lg transition hover:bg-aquatic md:flex md:size-12"
        >
          <ArrowIcon direction="right" />
        </button>
      </div>

      {openIndex !== null && (
        <ArticleModal
          content={{
            title: reviews[openIndex].name,
            kicker: reviews[openIndex].role ?? undefined,
            avatar: reviews[openIndex].image,
            paragraphs: [reviews[openIndex].quote],
          }}
          currentIndex={openIndex}
          total={reviews.length}
          onClose={() => setOpenIndex(null)}
          onPrev={() => setOpenIndex((reviews.length + openIndex - 1) % reviews.length)}
          onNext={() => setOpenIndex((openIndex + 1) % reviews.length)}
        />
      )}
    </section>
  );
}
