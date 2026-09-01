"use client";

import { useEffect, useRef, useState } from "react";

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
      <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function FloatingActions() {
  const [pastHero, setPastHero] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const [overlapping, setOverlapping] = useState(false);
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > 900);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  // This stack is `fixed` in the bottom-right corner, which means it sits on
  // top of - and can visually cover - whatever page content happens to
  // scroll into that same corner (e.g. a card's own CTA button in a
  // multi-column grid, like How It Works on mobile). Rather than trying to
  // guess a safe spot for every section that might end up there, we check
  // on scroll whether any element opted in via `data-fab-avoid` currently
  // overlaps this stack's own footprint, and fade the stack out for as long
  // as that's true - same treatment as the existing footer-proximity check.
  useEffect(() => {
    let ticking = false;
    function checkOverlap() {
      const stackEl = stackRef.current;
      if (!stackEl) return;
      const stackRect = stackEl.getBoundingClientRect();
      const targets = document.querySelectorAll<HTMLElement>("[data-fab-avoid]");
      let hit = false;
      targets.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (
          r.right > stackRect.left &&
          r.left < stackRect.right &&
          r.bottom > stackRect.top &&
          r.top < stackRect.bottom
        ) {
          hit = true;
        }
      });
      setOverlapping(hit);
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        checkOverlap();
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    checkOverlap();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const visible = pastHero && !footerVisible && !overlapping;

  return (
    <div
      ref={stackRef}
      className={`fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      {/* Floating "Book your dive" pill removed - the footer, hero, nav,
          and every section CTA already offer it; the fixed copy following
          you down the whole page read as insistent rather than helpful.
          Back-to-top alone stays, since it's a plain utility rather than a
          sales prompt. */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className="flex size-11 items-center justify-center rounded-full bg-dark-ocean-blue text-white shadow-lg transition hover:bg-navy"
      >
        <ArrowUpIcon />
      </button>
    </div>
  );
}
