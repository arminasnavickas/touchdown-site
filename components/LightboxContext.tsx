"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

type LightboxState = {
  images: string[];
  index: number;
} | null;

type LightboxContextValue = {
  openLightbox: (images: string[], index?: number) => void;
};

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error("useLightbox must be used within LightboxProvider");
  return ctx;
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

// Sized down from size-8 to fit a smaller, more minimal 44-48px hit area
// (was a bare icon with no defined touch target at all) without the icon
// itself feeling oversized inside it.
function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5 md:size-6">
      <path
        d={direction === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function LightboxProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LightboxState>(null);

  const openLightbox = (images: string[], index = 0) => setState({ images, index });
  const close = () => setState(null);

  // Swipe-to-navigate. A ghost "click" event always follows touchend on
  // touch devices (even after a deliberate swipe) - without justSwiped,
  // that ghost click would immediately fire the overlay's close handler
  // right after the swipe updates the index, making it look like swiping
  // does nothing.
  const touchState = useRef({ startX: 0, startY: 0, tracking: false });
  const justSwiped = useRef(false);

  // Focus the close button the moment the lightbox opens, so keyboard users
  // land somewhere inside the dialog instead of on whatever happened to be
  // focused on the page behind it. Keyed off the open/closed transition
  // specifically (not every state change) - navigating with prev/next also
  // produces a new state object, and re-stealing focus on every image
  // change would be disruptive rather than helpful.
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (state && !wasOpenRef.current) {
      closeButtonRef.current?.focus();
    }
    wasOpenRef.current = Boolean(state);
  }, [state]);

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchState.current = { startX: t.clientX, startY: t.clientY, tracking: true };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchState.current.tracking || !state) return;
    const t = e.changedTouches[0];
    const deltaX = t.clientX - touchState.current.startX;
    const deltaY = t.clientY - touchState.current.startY;
    touchState.current.tracking = false;
    if (Math.abs(deltaX) < 40 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) return;
    justSwiped.current = true;
    if (deltaX < 0) {
      setState({ ...state, index: (state.index + 1) % state.images.length });
    } else {
      setState({ ...state, index: (state.index - 1 + state.images.length) % state.images.length });
    }
  };

  const onOverlayClick = () => {
    if (justSwiped.current) {
      justSwiped.current = false;
      return;
    }
    close();
  };

  const goPrev = () => {
    if (!state) return;
    setState({ ...state, index: (state.index - 1 + state.images.length) % state.images.length });
  };
  const goNext = () => {
    if (!state) return;
    setState({ ...state, index: (state.index + 1) % state.images.length });
  };

  // Lock background scroll while open; restore on close. `overflow:
  // hidden` alone doesn't prevent touch-scrolling on iOS Safari, so we pin
  // the body at its current scroll position instead and restore it on close.
  useEffect(() => {
    if (!state) return;
    const scrollY = window.scrollY;
    const { style } = document.body;
    const html = document.documentElement;
    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.left = "0";
    style.right = "0";
    style.overflow = "hidden";
    return () => {
      style.position = "";
      style.top = "";
      style.left = "";
      style.right = "";
      style.overflow = "";
      // globals.css sets `scroll-behavior: smooth` on <html>, which
      // otherwise makes this restore visibly animate instead of snapping
      // back instantly. Force it off just for this jump.
      const previousScrollBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, scrollY);
      html.style.scrollBehavior = previousScrollBehavior;
    };
  }, [state]);

  // Close on Escape, navigate with arrow keys.
  useEffect(() => {
    if (!state) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <LightboxContext.Provider value={{ openLightbox }}>
      {children}

      {state && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo gallery"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/78 p-3 backdrop-blur-md md:p-6"
          onClick={onOverlayClick}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Counter + close share one top-right cluster, same pattern used
              in the site's other modal (ArticleModal) - plain text with no
              background of its own, so it reads as a quiet label rather
              than another piece of UI competing with the photo. */}
          <div className="absolute right-4 top-4 z-10 flex items-center gap-4 md:right-6 md:top-6">
            {state.images.length > 1 && (
              <span className="font-switzer text-xs font-medium tracking-widest text-white/70 tabular-nums">
                {String(state.index + 1).padStart(2, "0")} / {String(state.images.length).padStart(2, "0")}
              </span>
            )}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={close}
              aria-label="Close gallery"
              className="flex size-12 items-center justify-center rounded-full text-white transition hover:text-aquatic"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Pulled in from the viewport edge to sit close to the image
              itself (was a flat left-4/left-8 regardless of how wide the
              image actually was) - scales with the image's own max-width so
              the arrows stay near it rather than stranded out at the
              screen's edge on a wide viewport. Vertically centered relative
              to the dialog (previously unset, so its resting position was
              whatever the browser's default static placement worked out to
              for an absolutely-positioned flex child - not reliably
              centered). A subtle circular hit area (was a bare icon with no
              defined touch target) at the requested ~44-48px. */}
          {state.images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              aria-label={`Previous image (${state.index === 0 ? state.images.length : state.index} of ${state.images.length})`}
              className="absolute left-[3vw] top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 hover:text-aquatic md:size-12"
            >
              <ChevronIcon direction="left" />
            </button>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={state.images[state.index]}
            alt={`Enlarged image ${state.index + 1} of ${state.images.length}`}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-[94vw] rounded-md object-contain md:max-h-[85vh] md:max-w-[87vw] md:rounded-lg"
          />

          {state.images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              aria-label={`Next image (${state.index === state.images.length - 1 ? 1 : state.index + 2} of ${state.images.length})`}
              className="absolute right-[3vw] top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 hover:text-aquatic md:size-12"
            >
              <ChevronIcon direction="right" />
            </button>
          )}
        </div>
      )}
    </LightboxContext.Provider>
  );
}
