"use client";

import { useEffect, useRef, useState } from "react";
import FadeImage from "./FadeImage";
import ArticleModal from "./ArticleModal";
import Reveal from "./Reveal";
import type { Review } from "@/lib/content";

// Was a bare "#FBBF24" typed twice below with no traceable source - now
// named after the same rating-star token added to tailwind.config.ts. SVG
// fill/stroke attributes can't consume a Tailwind class directly, so the
// token's value is mirrored here as a plain constant rather than left as
// two disconnected inline hexes; the config comment explains why an
// off-palette amber is the deliberate choice for a star rating rather than
// reusing cta/aquatic.
const RATING_STAR_COLOR = "#FBBF24";

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className="size-4"
      fill={filled ? RATING_STAR_COLOR : "none"}
      stroke={filled ? RATING_STAR_COLOR : "rgba(255,255,255,0.35)"}
      strokeWidth="1"
    >
      <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9L10 15l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8L10 1.5Z" />
    </svg>
  );
}

function StarRating({ rating }: { rating: string }) {
  const filledCount = Math.round(parseFloat(rating) || 5);
  return (
    <div className="flex gap-0.5 self-start">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} filled={i < filledCount} />
      ))}
    </div>
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
    // Deliberately the one light/white-background card type on the page -
    // every other card (pricing, schedule, facility, team) stays dark-on-
    // navy. Kept intentionally: bright "paper" cards read as real, camera-
    // roll testimonials rather than another dark UI surface, a common and
    // legible convention for reviews specifically - the rest of the site's
    // dark system isn't broken so much as this one section is doing a
    // different, self-contained job (quoting someone else's words, not
    // presenting the brand's own content).
    <div
      className="flex h-full w-full flex-col gap-3 rounded-2xl border border-white/[0.06] p-6 [backdrop-filter:blur(12px)_saturate(125%)] transition duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_6px_24px_rgba(0,20,40,0.18)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_12px_40px_rgba(0,20,40,0.4)]"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 50%, rgba(101,206,230,0.02) 100%)",
      }}
    >
      {/* Reviewer row - photo/name/role left, rating right, with a divider
          below it separating the byline from the quote that follows. */}
      <div className="flex items-center gap-3.5 border-b border-white/15 pb-3">
        <FadeImage
          src={review.image}
          alt={review.name}
          wrapperClassName="size-14 shrink-0 rounded-full"
          className="h-full w-full object-cover"
          style={{ objectPosition: review.imagePosition ?? "50% 50%" }}
        />
        <div className="flex flex-1 flex-col gap-0.5">
          <p className="font-switzer text-lg font-medium leading-tight text-white">
            {review.name}
          </p>
          {review.role && (
            <p className="font-switzer text-sm text-white/60">{review.role}</p>
          )}
        </div>
        <StarRating rating={review.rating} />
      </div>
      <p
        ref={quoteRef}
        className="mt-3 line-clamp-4 font-switzer text-[13px] font-light leading-relaxed text-white/85"
      >
        {review.quote}
      </p>
      {overflows && (
        <button
          type="button"
          onClick={() => onOpen(index)}
          className="group relative inline-block w-fit self-end font-switzer text-base font-medium text-aquatic transition hover:text-cta"
        >
          Read more
          <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-cta transition-all duration-300 group-hover:w-full" />
        </button>
      )}
    </div>
  );
}

// Exact distance from the first card to its duplicate in the second set
// (card widths plus every gap). scrollWidth / 2 is short by half a gap, which
// showed up as a small jump at the loop point.
function getLoopWidth(el: HTMLElement) {
  const half = el.children.length / 2;
  const a = el.children[0] as HTMLElement | undefined;
  const b = el.children[half] as HTMLElement | undefined;
  return a && b ? b.offsetLeft - a.offsetLeft : el.scrollWidth / 2;
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
  const [hovered, setHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [inView, setInView] = useState(true);
  const touching = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.1,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Auto scroll marquee. The card list is rendered twice, so once scrollLeft
  // passes the width of one full set it jumps back by that width and the loop
  // is seamless. A float position is kept because browsers round scrollLeft,
  // which would stall very slow speeds.
  const paused = hovered || isDragging || openIndex !== null || reducedMotion || !inView;
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || paused || reviews.length < 2) return;
    const SPEED = 40; // px per second
    let pos = el.scrollLeft;
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;
      if (touching.current) {
        pos = el.scrollLeft;
      } else {
        const loopWidth = getLoopWidth(el);
        pos += (SPEED * dt) / 1000;
        if (pos >= loopWidth) pos -= loopWidth;
        el.scrollLeft = pos;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, reviews.length]);

  const onPointerDown = (e: React.PointerEvent) => {
    // Mouse only - click-and-drag scrolling is a desktop affordance (no
    // native way to grab-scroll with a mouse). Touch/pen pointers skip this
    // entirely and fall through to the browser's own native touch scrolling
    // on the overflow-x-auto element below, which - unlike this custom
    // pointer-capture drag - correctly lets a touch that turns out to be
    // more vertical than horizontal keep scrolling the page instead of
    // getting locked into this carousel.
    if (e.pointerType !== "mouse") return;
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
      className="relative flex flex-col items-center gap-12 overflow-hidden pb-[32px] pt-[64px] md:pb-[80px] md:pt-[96px] md:gap-24 scroll-mt-20"
    >
      <Reveal>
        <div className="relative z-10 flex flex-col items-center gap-4 px-6 text-center md:px-16">
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
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          onTouchStart={() => (touching.current = true)}
          onTouchEnd={() => setTimeout(() => (touching.current = false), 1500)}
          className={`flex w-full gap-6 overflow-x-auto pb-16 pt-8 -mb-12 -mt-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            isDragging ? "cursor-grabbing select-none" : "cursor-grab"
          }`}
        >
          {/* Big featured testimonial removed - every review, including
              what used to be reviews[0], now shows as an equal small card
              in this scroller. Each card now scroll-reveals in with a
              staggered delay via Reveal, same pattern as the pricing cards
              (Pricing.tsx) - Reveal carries the sizing/shrink/snap classes
              that used to live on the card's own div, and the card fills it
              with h-full w-full instead. */}
          {[...reviews, ...(reviews.length > 1 ? reviews : [])].map((review, i) => {
            const isCopy = i >= reviews.length;
            return (
              <div
                key={`${review.name}-${i}`}
                className="h-full w-[80%] shrink-0 sm:w-[320px]"
                aria-hidden={isCopy || undefined}
              >
                <ReviewCard review={review} index={i % reviews.length} onOpen={setOpenIndex} />
              </div>
            );
          })}
        </div>
      </div>

      {openIndex !== null && (
        <ArticleModal
          content={{
            title: reviews[openIndex].name,
            kicker: reviews[openIndex].role ?? undefined,
            avatar: reviews[openIndex].image,
            avatarPosition: reviews[openIndex].imagePosition,
            rating: reviews[openIndex].rating,
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
