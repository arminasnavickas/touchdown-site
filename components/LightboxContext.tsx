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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-8">
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-8">
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
      window.scrollTo(0, scrollY);
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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-dark-ocean-blue/50 p-6 backdrop-blur-sm"
          onClick={onOverlayClick}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full text-white transition hover:text-aquatic"
          >
            <CloseIcon />
          </button>

          {state.images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              aria-label="Previous image"
              className="absolute left-4 text-white transition hover:text-aquatic md:left-8"
            >
              <ChevronIcon direction="left" />
            </button>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={state.images[state.index]}
            alt=""
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
          />

          {state.images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              aria-label="Next image"
              className="absolute right-4 text-white transition hover:text-aquatic md:right-8"
            >
              <ChevronIcon direction="right" />
            </button>
          )}
        </div>
      )}
    </LightboxContext.Provider>
  );
}
