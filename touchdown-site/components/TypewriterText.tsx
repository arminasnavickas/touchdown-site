"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reveals text one letter at a time on scroll-into-view, using the exact
 * same IntersectionObserver + requestAnimationFrame mechanism the old Stats
 * counter used for its count-up animation - just counting through
 * characters instead of a numeric value. Resets so it replays each time it
 * scrolls back into view, matching the old counter's behavior.
 */
export default function TypewriterText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (frameRef.current !== null) {
          cancelAnimationFrame(frameRef.current);
          frameRef.current = null;
        }

        if (entry.isIntersecting) {
          const duration = 900;
          const start = performance.now();

          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            setCount(Math.round(progress * text.length));
            if (progress < 1) {
              frameRef.current = requestAnimationFrame(tick);
            } else {
              frameRef.current = null;
            }
          };
          frameRef.current = requestAnimationFrame(tick);
        } else {
          // Reset so the typewriter plays again next time it scrolls into view.
          setCount(0);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [text]);

  return (
    <span ref={ref} className={className}>
      {text.slice(0, count)}
      {/* Invisible remainder reserves the final width so the layout doesn't
          jump as letters appear. */}
      <span aria-hidden="true" className="opacity-0">
        {text.slice(count)}
      </span>
    </span>
  );
}
