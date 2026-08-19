"use client";

import { useEffect, useRef, useState } from "react";

type FadeImageProps = {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  eager?: boolean;
};

/**
 * Plain <img> wrapped with a fade-in transition and a pulsing placeholder
 * shown until the image finishes loading. Used instead of next/image across
 * this project because next/image's built-in optimizer fails hard on the
 * temporary Figma asset URLs (see README) — this keeps the nicer loading
 * feel without depending on that optimizer.
 */
export default function FadeImage({
  src,
  alt,
  className = "",
  wrapperClassName = "",
  eager = false,
}: FadeImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // If the browser already has this image cached, the "load" event can fire
  // before React finishes attaching the onLoad handler below — leaving
  // `loaded` stuck at false forever and the image permanently invisible
  // even though it's actually there. Checking `.complete` on mount catches
  // that case; onLoad below still handles the normal (not yet cached) case.
  useEffect(() => {
    if (imgRef.current?.complete) {
      setLoaded(true);
    }
  }, [src]);

  if (errored) {
    // Graceful fallback for any image that fails to load (expired temp
    // asset URL, network hiccup, etc.) — a soft brand-colored gradient
    // instead of the browser's default broken-image icon, so a dead image
    // reads as an unstyled placeholder rather than a visibly broken page.
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-horizon/30 to-dark-ocean-blue ${wrapperClassName}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-8 text-white/40">
          <path d="M4 16l4.5-4.5a2 2 0 0 1 2.83 0L17 17M14 14l1.5-1.5a2 2 0 0 1 2.83 0L20 14M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-white/10" />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        className={`transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
      />
    </div>
  );
}
