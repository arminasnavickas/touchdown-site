"use client";

import { useEffect, useState } from "react";
import FadeImage from "./FadeImage";
import Bubbles from "./Bubbles";
import BookInButton from "./BookInButton";

// Object-position tuning is a visual/technical concern, not content, so it
// stays in code even though the actual photos come from Sanity. Any slide
// beyond these two (e.g. a third photo added later in the Studio) falls
// back to plain object-center.
const slidePositions = ["object-[center_65%]", "object-[center_38%]"];
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
  const [offset, setOffset] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const headlineLines = headline.split("\n");
  const subcopyLines = subcopy.split(". ").filter(Boolean);

  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY * 0.3);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-advance the background carousel every 6s, pausing implicitly
  // whenever the tab isn't in the foreground since rAF/timers throttle then.
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide((i) => (i + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="relative h-[500px] w-full overflow-hidden bg-dark-ocean-blue md:h-[700px]">
      {/* Background underwater image carousel (parallax) */}
      <div
        className="absolute inset-0"
        style={{ transform: `translateY(${offset}px)`, willChange: "transform" }}
      >
        {slides.map((src, i) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === activeSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <FadeImage
              src={src}
              alt="Freediver underwater in Dahab"
              eager
              wrapperClassName="absolute inset-0 h-[calc(100%+150px)]"
              className={`h-full w-full object-cover ${slidePositions[i] ?? "object-center"}`}
            />
          </div>
        ))}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(0deg, #000000 0%, #000000 100%)",
            opacity: 0.5,
          }}
        />
      </div>

      {/* Carousel dot indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-24 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-full bg-[#023048]/40 px-3 py-2 backdrop-blur-sm md:bottom-32">
          {slides.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveSlide(i)}
              aria-label={`Show background image ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === activeSlide ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      )}

      <Bubbles />

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
