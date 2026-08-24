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

export type ArticleModalContent = {
  title: string;
  kicker?: string;
  image?: string;
  avatar?: string;
  instagram?: string;
  paragraphs: string[];
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
  onClose,
  onPrev,
  onNext,
}: {
  content: ArticleModalContent;
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6"
      onClick={onClose}
    >
      {/* Narrowed from max-w-2xl (672px) to a slightly wider but more
          deliberate ~800px - the earlier width felt like "another page"
          rather than a focused reading surface. modal-scroll (globals.css)
          gives this its own slimmer, more transparent scrollbar than the
          site-wide one, since a mostly-empty white modal makes even a thin
          thumb read as prominent. */}
      <div
        className="modal-scroll relative max-h-[85vh] w-full max-w-[800px] overflow-y-auto rounded-lg bg-white"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Zero-height sticky anchor: keeps the button pinned to the top-right
            of the visible scroll area (not the document) as the modal's
            content scrolls, without taking up any layout space itself. */}
        <div className="sticky top-0 z-10 h-0 overflow-visible">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 flex size-12 items-center justify-center rounded-full bg-white/80 text-dark-ocean-blue backdrop-blur-sm transition hover:text-cta"
          >
            <CloseIcon />
          </button>
        </div>

        {content.image && (
          <FadeImage
            src={content.image}
            alt={content.title}
            eager
            wrapperClassName="h-[200px] w-full md:h-[300px]"
            className="h-full w-full object-cover"
          />
        )}

        {/* Generous outer padding + an inner max-w-[560px] reading column -
            the modal itself stays ~800px so there's real whitespace either
            side, but no line of body text runs wider than roughly 65-75
            characters. */}
        <div className="px-8 py-8 md:px-12 md:py-10">
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
            <div className="mb-6 flex items-center gap-3">
              <h3 className="font-switzer text-4xl font-light tracking-tight text-dark-ocean-blue md:text-5xl">
                {content.title}
              </h3>
              {content.instagram && (
                <a
                  href={content.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${content.title} on Instagram`}
                  className="text-dark-ocean-blue/60 transition hover:text-cta"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-6">
                    <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
                    <circle cx="12" cy="12" r="4.2" />
                    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
              )}
            </div>
            {content.paragraphs.map((p, i) => (
              <p
                key={i}
                className="mb-5 font-switzer text-lg font-light leading-relaxed text-dark-ocean-blue/80 last:mb-0"
              >
                {p}
              </p>
            ))}

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

      {onPrev && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          aria-label="Previous"
          className="fixed left-4 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-dark-ocean-blue shadow-lg transition hover:bg-aquatic md:left-8 md:size-12"
        >
          <ArrowIcon direction="left" />
        </button>
      )}
      {onNext && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          aria-label="Next"
          className="fixed right-4 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-dark-ocean-blue shadow-lg transition hover:bg-aquatic md:right-8 md:size-12"
        >
          <ArrowIcon direction="right" />
        </button>
      )}
    </div>,
    document.body
  );
}
