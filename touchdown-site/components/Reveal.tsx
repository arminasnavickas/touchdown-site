"use client";

import { useEffect, useRef, useState } from "react";

export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [effectiveDelay, setEffectiveDelay] = useState(delay);

  useEffect(() => {
    // On mobile, grids collapse to a single column, so items already stagger
    // naturally by scroll position - an artificial delay just makes an
    // already-visible item sit invisible for a beat, which reads as lag
    // rather than polish. Only apply the delay at md: and up.
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setEffectiveDelay(mq.matches ? delay : 0);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [delay]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${effectiveDelay}ms` }}
      className={`transition-all duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}
