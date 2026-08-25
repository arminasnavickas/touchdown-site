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
  avatar?: string;
  instagram?: string;
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

  // Close on Escape, navigate with arrow keys - standard expected behavior
  // for any modal/dialog with prev/next.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
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
    if (deltaX < 0) onNext?.();
    else onPrev?.();
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-2.5 md:p-6"
      onClick={onClose}
    >
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
        className="modal-scroll relative max-h-[94vh] w-full max-w-[800px] overflow-y-auto rounded-lg bg-white md:max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Real header bar (not a floating overlay) - sits in normal flow
            above the hero image and stays pinned via `sticky` as the modal
            scrolls, the same way a page header would. Close + prev/next
            live together here now, off the photograph entirely, instead of
            translucent circles floating on top of it where they could sit
            right over a person's face. */}
        <div className="sticky top-0 z-10 flex items-center justify-end gap-2 rounded-t-lg bg-white px-5 py-3">
          {typeof currentIndex === "number" && typeof total === "number" && total > 1 && (
            <div className="flex items-center gap-1 rounded-full bg-dark-ocean-blue/5 py-1 pl-1 pr-2.5 text-dark-ocean-blue">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPrev?.();
                }}
                aria-label="Previous"
                className="flex size-7 items-center justify-center rounded-full transition hover:text-cta"
              >
                <ArrowIcon direction="left" className="size-4" />
              </button>
              <span className="font-switzer text-xs font-medium tabular-nums text-dark-ocean-blue/60">
                {String(currentIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNext?.();
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
            className="flex size-10 items-center justify-center rounded-full bg-dark-ocean-blue/5 text-dark-ocean-blue transition hover:bg-dark-ocean-blue/10 hover:text-cta"
          >
            <CloseIcon />
          </button>
        </div>

        {content.image && (
          // Portraits ("tall") get a much taller frame - fluid between the
          // mobile and desktop targets via clamp() so it scales with actual
          // viewport height rather than jumping at a single breakpoint -
          // anchored top by default so a head planted near the top of the
          // source photo is never cropped. Landscape/action shots keep the
          // original compact height and centered crop unless a caller opts
          // into "tall" or overrides the position/fit directly.
          <div
            className={
              content.imageSize === "tall"
                ? "h-[clamp(350px,48vh,430px)] w-full overflow-hidden md:h-[clamp(550px,55vh,650px)]"
                : "h-[200px] w-full overflow-hidden md:h-[300px]"
            }
          >
            <FadeImage
              src={content.image}
              alt={content.title}
              eager
              wrapperClassName="h-full w-full"
              className="h-full w-full"
              style={{
                objectFit: content.imageFit ?? "cover",
                objectPosition: content.imagePosition ?? (content.imageSize === "tall" ? "center top" : "center"),
              }}
            />
          </div>
        )}

        {/* Generous outer padding + an inner max-w-[560px] reading column -
            the modal itself stays ~800px so there's real whitespace either
            side, but no line of body text runs wider than roughly 65-75
            characters. */}
        {/* Comfortable margins rather than the desktop's generous 8/8 -
            enough to keep the text off the modal's own edges without
            eating into the reading column on a 375-414px screen. */}
        <div className="px-5 py-6 md:px-12 md:py-10">
          <div className="max-w-[560px]">
            {content.avatar && (
              <FadeImage
                src={content.avatar}
                alt={content.title}
                eager
                wrapperClassName="mb-4 size-16 shrink-0 rounded-full md:size-20"
                className="h-full w-full object-cover"
              />
            )}
            {content.kicker && (
              <p className="mb-2 font-switzer text-sm font-medium uppercase tracking-widest text-horizon">
                {content.kicker}
              </p>
            )}
            {/* Name and Instagram share one row (name left, link right)
                instead of a small icon tucked right after the title - reads
                as "here's this person, here's where to find them" rather
                than a decoration next to the heading. */}
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

            <div className="mt-6">
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
                          className="mb-3 font-switzer text-[17px] font-light leading-relaxed text-dark-ocean-blue/80 last:mb-0 md:text-[20px]"
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
                    className="mb-5 font-switzer text-[17px] font-light leading-relaxed text-dark-ocean-blue/80 last:mb-0 md:text-[20px]"
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
                className="group/link mt-8 flex w-fit items-center gap-1.5 font-switzer text-sm font-medium uppercase tracking-widest text-cta transition hover:text-dark-ocean-blue"
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
    </div>,
    document.body
  );
}
