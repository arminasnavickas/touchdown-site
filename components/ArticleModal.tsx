"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import FadeImage from "./FadeImage";

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon({ direction, className = "size-6" }: { direction: "left" | "right"; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path
        d={direction === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Mirrors the review card's star rating exactly (Reviews.tsx) so the modal
// header shows the same filled/empty stars for the same rating value -
// duplicated here rather than imported to keep this file self-contained and
// the review card component untouched.
const RATING_STAR_COLOR = "#FBBF24";

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className="size-4"
      fill={filled ? RATING_STAR_COLOR : "none"}
      stroke={filled ? RATING_STAR_COLOR : "#D1D5DB"}
      strokeWidth="1"
    >
      <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9L10 15l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8L10 1.5Z" />
    </svg>
  );
}

function StarRating({ rating }: { rating: string }) {
  const filledCount = Math.round(parseFloat(rating) || 5);
  return (
    <div className="flex shrink-0 gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} filled={i < filledCount} />
      ))}
    </div>
  );
}

export type ArticleModalContent = {
  title: string;
  kicker?: string;
  // Small line rendered directly under the title (Team's role tags, e.g.
  // "Founder · Instructor · Coach") - distinct from `kicker`, which renders
  // above the title instead, so both can be used independently depending
  // on which reads better for a given caller's content shape.
  subtitle?: string;
  image?: string;
  // Hero image display tuning. Portraits (Team) want a much taller frame
  // anchored to the top so a head is never cropped out; landscape/action
  // shots (How It Works) keep the original compact height and a centered
  // crop. Both default to "compact"/"cover"/center so existing callers
  // that don't pass these render exactly as before.
  imageSize?: "compact" | "tall";
  imageFit?: "cover" | "contain";
  imagePosition?: string;
  // Desktop-only Tailwind object-position override (e.g. "md:object-[center_20%]"),
  // for callers that need a per-image crop nudge only above the mobile
  // breakpoint. Takes precedence over imagePosition/the imageSize default
  // when set. Mobile keeps the imagePosition/default crop untouched.
  imagePositionClassName?: string;
  avatar?: string;
  // CSS object-position for `avatar` (e.g. from a Sanity hotspot) - Reviews
  // only for now, same "50% 50%" plain-center default as before when unset.
  avatarPosition?: string;
  instagram?: string;
  // Star rating (e.g. "5", "4.5"), rendered alongside the avatar/name header
  // when present - Reviews only for now, same rating value the card shows.
  rating?: string;
  paragraphs: string[];
  // Optional sectioned body copy (title + paragraphs per section), rendered
  // instead of the flat `paragraphs` list when present - Team bios only for
  // now. Reviews/HowItWorks keep using flat `paragraphs`.
  sections?: { title: string; paragraphs: string[] }[];
  // Optional compact stat row (e.g. depth records), rendered above the body
  // copy. Horizontally scrolls on narrow screens rather than wrapping.
  stats?: { value: string; label: string }[];
  // Optional short bullet list rendered after the body copy, behind its own
  // divider - Team's qualifications.
  qualifications?: string[];
  // Optional scannable "what you'll learn" block, rendered after the
  // paragraphs behind a divider. Only How It Works populates this - team
  // bios and reviews don't have this shape, so they just render as before.
  learnPoints?: { title: string; copy: string }[];
  // Optional closing link/CTA ("Book your training ->"), rendered below
  // everything else. Also How It Works-only for now.
  ctaLabel?: string;
  ctaHref?: string;
};

export default function ArticleModal({
  content,
  currentIndex,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  content: ArticleModalContent;
  // When browsing a set (team members, review authors, steps), the header
  // shows a compact "02 / 08" counter with small chevrons instead of the
  // old large circular prev/next buttons floating over the page - only
  // rendered when both are provided and there's more than one item.
  currentIndex?: number;
  total?: number;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  // Lock background scroll while the modal is open; restore on close/unmount.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Which way the last prev/next navigation went - drives the directional
  // slide-in animation below (modal-slide-next/prev, globals.css) on the
  // content region. Every place that can trigger navigation (keyboard,
  // floating arrows, header chevrons, touch swipe) goes
  // through goPrev/goNext below instead of calling onPrev/onNext directly,
  // so this stays in sync with whichever direction actually fired.
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const goPrev = () => {
    setDirection("prev");
    onPrev?.();
  };
  const goNext = () => {
    setDirection("next");
    onNext?.();
  };

  // Close on Escape, navigate with arrow keys - standard expected behavior
  // for any modal/dialog with prev/next.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, onPrev, onNext]);

  // Render via a portal into document.body: this component is opened from
  // inside HowItWorks's <section>, which has overflow-hidden for its Blob
  // decoration. Browsers clip position:fixed descendants to an
  // overflow-hidden ancestor's own bounds even though "fixed" is meant to
  // be viewport-relative - without the portal, scrolling before opening the
  // modal cuts its top off. Only mount the portal client-side (target must
  // exist).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Swipe-to-navigate: track touch start/move on the card itself. Only
  // treated as a horizontal swipe once it clearly outpaces vertical
  // movement, so it doesn't fight with the card's own vertical scrolling.
  const touchState = useRef({ startX: 0, startY: 0, tracking: false });

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchState.current = { startX: t.clientX, startY: t.clientY, tracking: true };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchState.current.tracking) return;
    const t = e.changedTouches[0];
    const deltaX = t.clientX - touchState.current.startX;
    const deltaY = t.clientY - touchState.current.startY;
    touchState.current.tracking = false;
    if (Math.abs(deltaX) < 40 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) return;
    if (deltaX < 0) goNext();
    else goPrev();
  };

  if (!mounted) return null;

  return createPortal(
    <div
      // flex-col (was a plain row): the mobile-only "Swipe to navigate"
      // caption below needs to stack under the card rather than sit beside
      // it. Still centers the whole card+caption group both ways via
      // items-center/justify-center exactly as it did with just the card.
      // px-12 (48px) on mobile matches the Reviews section's own px-6 side
      // padding, giving the card a consistent margin from the screen edge
      // (a mobile edge-peek nub used to live in part of this gutter, but it
      // read as an artificial-looking sliver rather than a real affordance,
      // so it was removed - navigation on mobile is swipe + header chevrons).
      // Uniform bg-black/90 across the entire overlay, margins included
      // (briefly split into a transparent margin + a separately-filled
      // inner backdrop, then reverted - one flat fill everywhere reads
      // more consistent than a see-through strip at the true screen edge).
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-black/90 px-12 py-2.5 md:p-6"
      onClick={onClose}
    >
      {/* Counter + close, now a row sitting on the black overlay above the
          card rather than a bar built into the card's own white top edge -
          the card is just the reading surface now, and these are page-level
          controls floating over it like the arrow buttons already did.
          Same max-w as the card so the close button still lands top-right
          of the reading surface, just outside it instead of inside it.
          relative so the counter pill below can be centered independently
          of the close button, instead of both being grouped at the right
          edge under justify-end. */}
      <div
        className="relative flex w-full max-w-[724px] shrink-0 items-center justify-end"
        onClick={(e) => e.stopPropagation()}
      >
        {typeof currentIndex === "number" && typeof total === "number" && total > 1 && (
          // Centered on the row via absolute + left-1/2/-translate-x-1/2,
          // independent of the close button's own position - was grouped
          // next to the close button at the right under a shared flex row.
          // Solid white fill (was bg-white/10) - the translucent pill let
          // whatever sat behind the overlay show through it, same issue as
          // the edge-peek nub had before that one was reverted. Text/icons
          // No pill background any more (was bg-white/10, then bg-white,
          // then bg-white/80, then bg-white/50) - now floats directly on
          // the black overlay with no fill at all, so the chevrons/total
          // switch to white (was dark-ocean-blue, illegible on black) to
          // stay visible; the current-index number keeps its cta blue.
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 py-1 pl-1 pr-2.5 text-white">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              aria-label="Previous"
              className="flex size-7 items-center justify-center rounded-full transition hover:text-cta"
            >
              <ArrowIcon direction="left" className="size-4" />
            </button>
            <span className="font-switzer text-xs font-medium tabular-nums">
              {/* Current index in the brand blue, total in a muted grey -
                  reads as "you're here" vs. "out of how many" at a glance,
                  instead of one flat-colored string. */}
              <span className="text-cta">{String(currentIndex + 1).padStart(2, "0")}</span>
              <span className="text-white/40"> / {String(total).padStart(2, "0")}</span>
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              aria-label="Next"
              className="flex size-7 items-center justify-center rounded-full transition hover:text-cta"
            >
              <ArrowIcon direction="right" className="size-4" />
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex size-10 items-center justify-center rounded-full bg-white/50 text-dark-ocean-blue transition hover:bg-aquatic hover:text-dark-ocean-blue"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Narrowed from max-w-2xl (672px) to a slightly wider but more
          deliberate ~800px - the earlier width felt like "another page"
          rather than a focused reading surface. modal-scroll (globals.css)
          gives this its own slimmer, more transparent scrollbar than the
          site-wide one, since a mostly-empty white modal makes even a thin
          thumb read as prominent. Mobile overlay padding cut down to a
          near-full-screen 2.5 (from a flat 6 at every breakpoint) so the
          reading surface itself gets the width, not the black margin
          around it - a real "near-full-screen modal" rather than a desktop
          dialog with its edges just barely inside a small viewport. */}
      <div
        // No side margin of its own any more - the overlay's own px-6
        // (mobile) / md:p-6 (desktop) padding above is the entire gutter
        // between the card and the screen edge, matching the Reviews
        // section's side padding.
        // max-h dropped to make room for both the counter/close row above
        // and the caption below, so the whole group still fits the viewport.
        // key={currentIndex} + modal-slide-next/prev (globals.css) - forces
        // a fresh DOM node for the whole white card on every prev/next, so
        // the slide-in animation now moves the card itself (was scoped to
        // just the inner scrollable content region before).
        key={currentIndex}
        className={`relative flex max-h-[80vh] w-full max-w-[724px] flex-col overflow-hidden rounded-lg bg-white md:max-h-[80vh] ${
          direction === "next" ? "modal-slide-next" : "modal-slide-prev"
        }`}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* flex-auto (not flex-1) deliberately: flex-1's flex-basis:0%
            contributes nothing to this auto-height flex column's size
            calculation, so the outer card would resolve to header height
            only and squeeze this entire region (image + text) to 0px.
            flex-auto uses the content's own height as the starting point
            instead, so the card sizes correctly; min-h-0 then overrides
            the default flex-item min-height (also content-based) so this
            region can still shrink below that once max-h-[85vh] is
            actually hit, which is what lets overflow-y-auto ever kick in. */}
        <div className="modal-scroll min-h-0 flex-auto overflow-y-auto">
          {content.image && (
            // Portraits ("tall") get a much taller frame - fluid between the
            // mobile and desktop targets via clamp() so it scales with actual
            // viewport height rather than jumping at a single breakpoint -
            // anchored top by default so a head planted near the top of the
            // source photo is never cropped. Landscape/action shots keep the
            // original compact height and centered crop unless a caller opts
            // into "tall" or overrides the position/fit directly. shrink-0
            // (not shrink) since this now lives inside the scrolling region
            // rather than competing with the text for a fixed height budget -
            // it always renders at its full designed size.
            <div
              className={
                content.imageSize === "tall"
                  ? "h-[clamp(350px,48vh,430px)] w-full shrink-0 overflow-hidden md:h-[clamp(550px,55vh,650px)]"
                  : "h-[200px] w-full shrink-0 overflow-hidden md:h-[300px]"
              }
            >
              <FadeImage
                src={content.image}
                alt={content.title}
                eager
                wrapperClassName="h-full w-full"
                className={`h-full w-full ${content.imagePositionClassName ?? ""}`}
                style={{
                  objectFit: content.imageFit ?? "cover",
                  objectPosition: content.imagePositionClassName
                    ? undefined
                    : content.imagePosition ?? (content.imageSize === "tall" ? "center top" : "center"),
                }}
              />
            </div>
          )}
          {/* Generous outer padding + an inner max-w-[560px] reading column -
              the modal itself stays ~724px so there's real whitespace either
              side, but no line of body text runs wider than roughly 65-75
              characters. mx-auto on the inner column, deliberately: without
              it a block-level div just sits flush against the container's
              left edge, dumping 100% of the leftover width (container
              width minus 560px) onto the right - visibly uneven left/right
              padding. Centering the column splits that leftover width
              evenly instead, so the gap from the outer padding reads the
              same on both sides. */}
          {/* Mobile padding matches the review card's own p-6 (24px all
              round) instead of the previous asymmetric px-5/py-6, so the
              modal's content feels consistent with the card that opened it.
              Desktop keeps its own more generous 12/10. */}
          <div className="p-6 md:px-12 md:py-10">
          <div className="mx-auto max-w-[560px]">
            {content.avatar ? (
              // Byline-style header (Reviews): avatar left, kicker/name
              // stacked to its right, rating on the far right of the same
              // row - matches how the review card itself lays out its
              // header, instead of the stacked avatar-above-name layout the
              // other callers below still use.
              <div className="mb-4 flex items-center gap-4 border-b border-dark-ocean-blue/10 pb-4">
                <FadeImage
                  src={content.avatar}
                  alt={content.title}
                  eager
                  wrapperClassName="size-16 shrink-0 rounded-full md:size-20"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: content.avatarPosition ?? "50% 50%" }}
                />
                <div className="flex flex-1 flex-col gap-0.5">
                  {content.kicker && (
                    <p className="font-switzer text-sm font-medium uppercase tracking-widest text-horizon">
                      {content.kicker}
                    </p>
                  )}
                  <h3 className="font-switzer text-3xl font-light tracking-tight text-dark-ocean-blue md:text-5xl">
                    {content.title}
                  </h3>
                </div>
                {content.rating && <StarRating rating={content.rating} />}
              </div>
            ) : (
              <>
                {content.kicker && (
                  <p className="mb-2 font-switzer text-sm font-medium uppercase tracking-widest text-horizon">
                    {content.kicker}
                  </p>
                )}
                {/* Name and Instagram share one row (name left, link right)
                    instead of a small icon tucked right after the title -
                    reads as "here's this person, here's where to find them"
                    rather than a decoration next to the heading. */}
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-switzer text-3xl font-light tracking-tight text-dark-ocean-blue md:text-5xl">
                    {content.title}
                  </h3>
                  {content.instagram && (
                    <a
                      href={content.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex shrink-0 items-center gap-1 font-switzer text-sm font-medium uppercase tracking-widest text-cta transition hover:text-dark-ocean-blue"
                    >
                      Instagram
                      <span aria-hidden>→</span>
                    </a>
                  )}
                </div>
              </>
            )}
            {content.subtitle && (
              <p className="mt-1 font-switzer text-sm font-medium uppercase tracking-widest text-dark-ocean-blue/50">
                {content.subtitle}
              </p>
            )}

            {/* Compact stat row (e.g. depth records) - scrolls horizontally
                on narrow screens instead of wrapping, so it stays a single
                scannable line rather than an oversized sentence. */}
            {content.stats && content.stats.length > 0 && (
              <div className="mb-2 mt-5 flex gap-6 overflow-x-auto">
                {content.stats.map((s) => (
                  <div key={s.label} className="flex shrink-0 flex-col gap-0.5">
                    <p className="font-switzer text-2xl font-medium tabular-nums text-dark-ocean-blue md:text-3xl">
                      {s.value}
                    </p>
                    <p className="font-switzer text-xs font-semibold uppercase tracking-widest text-aquatic">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Quote mark (Reviews only) - same glyph/treatment as the
                card, sitting right above the quote text with the paragraph
                block pulled up close beneath it via the negative margin
                below, instead of the plain mt-6 gap other callers get. */}
            {content.avatar && (
              <span aria-hidden className="mt-4 block font-switzer text-4xl font-light leading-none text-cta/25">
                &ldquo;
              </span>
            )}
            <div className={content.avatar ? "-mt-2" : "mt-6"}>
              {content.sections && content.sections.length > 0 ? (
                <div className="flex flex-col gap-6">
                  {content.sections.map((section) => (
                    <div key={section.title}>
                      <p className="mb-2 font-switzer text-xs font-semibold uppercase tracking-[0.15em] text-aquatic">
                        {section.title}
                      </p>
                      {section.paragraphs.map((p, i) => (
                        <p
                          key={i}
                          className="mb-3 font-switzer text-[15px] font-light leading-relaxed text-dark-ocean-blue/80 last:mb-0"
                        >
                          {p}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                content.paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className="mb-5 font-switzer text-[15px] font-light leading-relaxed text-dark-ocean-blue/80 last:mb-0"
                  >
                    {p}
                  </p>
                ))
              )}
            </div>

            {/* Short bullet list (Team's qualifications) - deliberately not
                paragraph prose, since a list of certifications/dates reads
                better as scannable lines than as sentences stitched
                together with periods. */}
            {content.qualifications && content.qualifications.length > 0 && (
              <div className="mt-2 border-t border-dark-ocean-blue/10 pt-6">
                <p className="mb-3 font-switzer text-xs font-semibold uppercase tracking-[0.15em] text-aquatic">
                  Background &amp; qualifications
                </p>
                <ul className="flex flex-col gap-2">
                  {content.qualifications.map((q) => (
                    <li
                      key={q}
                      className="font-switzer text-base font-light leading-relaxed text-dark-ocean-blue/70"
                    >
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Scannable "what you'll learn" block - the alternative to
                dropping a second long paragraph in. Only present when the
                caller supplies it (currently just How It Works). */}
            {content.learnPoints && content.learnPoints.length > 0 && (
              <div className="mt-2 border-t border-dark-ocean-blue/10 pt-6">
                <p className="mb-4 font-switzer text-xs font-semibold uppercase tracking-[0.2em] text-aquatic">
                  What you&rsquo;ll learn
                </p>
                <ul className="flex flex-col gap-4">
                  {content.learnPoints.map((point) => (
                    <li key={point.title}>
                      <p className="font-switzer text-base font-medium text-dark-ocean-blue">
                        {point.title}
                      </p>
                      <p className="font-switzer text-base font-light leading-relaxed text-dark-ocean-blue/70">
                        {point.copy}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {content.ctaLabel && content.ctaHref && (
              <a
                href={content.ctaHref}
                onClick={onClose}
                className="group/link mt-8 flex w-fit items-center gap-2 rounded-[6px] border border-cta px-5 py-2.5 font-switzer text-sm font-medium uppercase tracking-widest text-cta transition hover:border-dark-ocean-blue hover:text-dark-ocean-blue"
              >
                {content.ctaLabel}
                <span aria-hidden className="transition-transform duration-200 group-hover/link:translate-x-1">
                  →
                </span>
              </a>
            )}
          </div>
          </div>
        </div>
      </div>

      {/* Swipe hint, below the card rather than inside its header - mobile
          only (md:hidden), part of the flex-col group above so it stacks
          under the card instead of sitting beside it. Desktop doesn't need
          it: it already has the floating arrow buttons either side of the
          card. */}
      {typeof currentIndex === "number" && typeof total === "number" && total > 1 && (
        <p className="font-switzer text-[11px] font-medium uppercase tracking-widest text-white/50 md:hidden">
          Swipe to navigate
        </p>
      )}

      {/* Large floating prev/next arrows on the overlay itself - same style
          as the review carousel's own arrow buttons (Reviews.tsx) - in
          addition to the compact "04 / 18" chevrons in the header bar above.
          Desktop only (md:flex): mobile relies on the swipe gesture and the
          header chevrons instead (a mobile-only edge-peek nub sliver used to
          sit at the card's edges here too, but it read as an artificial-
          looking sliver rather than a real affordance, so it was removed). */}
      {typeof currentIndex === "number" && typeof total === "number" && total > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="Previous"
            className="absolute left-4 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white text-dark-ocean-blue shadow-lg transition hover:bg-aquatic md:flex md:size-12"
          >
            <ArrowIcon direction="left" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="Next"
            className="absolute right-4 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white text-dark-ocean-blue shadow-lg transition hover:bg-aquatic md:flex md:size-12"
          >
            <ArrowIcon direction="right" />
          </button>
        </>
      )}
    </div>,
    document.body
  );
}
