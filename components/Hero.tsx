"use client";

import { useEffect, useRef } from "react";
import FadeImage from "./FadeImage";
import BookInButton from "./BookInButton";

const logoBadge = "/images/touchdown-stamp.svg";

export default function Hero({
  headline,
  subcopy,
  slides,
}: {
  headline: string;
  subcopy: string;
  slides: string[];
}) {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const headlineLines = headline.split("\n");
  const subcopyLines = subcopy.split(". ").filter(Boolean);
  // Carousel removed - always just the first photo from Sanity. Cycling
  // through multiple full-size background photos meant every extra slide
  // competed for bandwidth and kept causing loading/rendering issues,
  // especially on mobile.
  const heroImage = slides[0];
  // Only the bundled local fallback photo has a pre-generated mobile-sized
  // variant sitting next to it in /public/images. A Sanity-hosted image
  // comes from their CDN under a different URL entirely, so there's no
  // matching "-mobile" file to point at - in that case we just fall back to
  // serving the single `heroImage` URL at every width, same as before.
  const isLocalHeroImage = heroImage === "/images/hero.jpg";

  // Parallax via a ref + direct style write instead of React state - the
  // old version called setOffset() on every native scroll event, which
  // re-rendered the whole Hero component (including re-splitting the
  // headline/subcopy strings) dozens of times per second while scrolling.
  // Writing transform straight to the DOM node, throttled to one update
  // per animation frame, gets the same visual effect without any of that
  // React work on the hot path.
  useEffect(() => {
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (parallaxRef.current) {
          parallaxRef.current.style.transform = `translateY(${window.scrollY * 0.3}px)`;
        }
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative h-[500px] w-full overflow-hidden bg-dark-ocean-blue md:h-[700px]">
      {/* Background underwater image (parallax) */}
      <div
        ref={parallaxRef}
        className="absolute inset-0"
        style={{ willChange: "transform" }}
      >
        {heroImage && (
          <FadeImage
            src={heroImage}
            srcSet={
              isLocalHeroImage
                ? "/images/hero-mobile.jpg 800w, /images/hero.jpg 1600w"
                : undefined
            }
            sizes={isLocalHeroImage ? "100vw" : undefined}
            alt="Freediver underwater in Dahab"
            eager
            wrapperClassName="absolute inset-0 h-[calc(100%+150px)]"
            className="h-full w-full object-cover object-[center_65%]"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(0deg, #000000 0%, #000000 100%)",
            opacity: 0.5,
          }}
        />
      </div>

      {/* Decorative blob */}
      <div
        aria-hidden
        className="absolute left-[13px] top-[75px] hidden h-[919px] w-[806px] rounded-[58%_42%_45%_55%/52%_48%_55%_45%] bg-[#65CEE6] opacity-60 mix-blend-screen blur-[100px] md:block"
      />

      {/* Copy + CTA */}
      <div className="relative z-10 flex h-full max-w-3xl flex-col justify-start gap-8 px-6 pt-8 md:justify-center md:px-16 md:pt-0">
        <div className="flex flex-col gap-2">
          <p className="font-switzer text-base font-medium uppercase tracking-widest text-white/80 md:text-lg">
            {headlineLines[0]}
          </p>
          <h1 className="font-switzer text-6xl font-extralight leading-tight tracking-tight text-white md:text-8xl">
            {headlineLines.slice(1).map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </h1>
        </div>
        <div className="max-w-xl font-switzer text-xl font-light text-white/90">
          {subcopyLines.map((line, i) => (
            <p key={i}>
              {line}
              {i < subcopyLines.length - 1 ? "." : ""}
            </p>
          ))}
        </div>
        <BookInButton className="w-fit rounded-[6px] bg-cta px-8 py-4 font-switzer text-base font-medium uppercase tracking-wide text-white transition-all duration-200 ease-out hover:bg-aquatic hover:text-dark-ocean-blue hover:scale-105 hover:shadow-lg hover:shadow-cta/40 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2">
          Book in
        </BookInButton>
      </div>

      {/* Logo badge */}
      <div className="absolute right-6 top-[270px] block h-[150px] w-[150px] md:right-24 md:top-[380px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoBadge} alt="Touchdown space badge" className="h-full w-full object-contain" />
      </div>
    </section>
  );
}
