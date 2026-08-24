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
  // Deliberate mobile line break: everything but the last word on its own
  // line, the last word on its own below that ("Consistently delivering" /
  // "quality") - instead of leaving the browser to wrap wherever the
  // viewport happens to cut it, which could just as easily strand a single
  // short word up top or leave an awkward ragged break mid-phrase. On
  // tablet/desktop the <br> is hidden and this reads as one normal line.
  const mainLine = headlineLines.slice(1).join(" ");
  const mainLineWords = mainLine.split(" ");
  const mainLineLead = mainLineWords.slice(0, -1).join(" ");
  const mainLineLastWord = mainLineWords[mainLineWords.length - 1];
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
    // Mobile height brought down from 500px - the old height plus a
    // text-6xl headline meant the copy/CTA stack routinely ran right up to
    // (or past) the hero's own bottom edge, pushing the stamp and diver out
    // of the first viewport and forcing a scroll just to see them. A
    // shorter section combined with the smaller headline below fits the
    // full "eyebrow -> headline -> copy -> CTA -> stamp/diver" stack
    // comfortably without shrinking the photo down to a sliver.
    <section className="relative h-[460px] w-full overflow-hidden bg-dark-ocean-blue md:h-[700px]">
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
        {/* Directional overlay (was a flat black wash at a fixed opacity) -
            darkest on the left where the text sits, easing off across the
            middle, and nearly clear on the right so the diver and the
            stamp stay genuinely visible instead of dimmed by the same flat
            scrim as the copy. Dark/text -> image -> diver/stamp, left to
            right. */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(100deg, rgba(4,12,20,0.82) 0%, rgba(4,12,20,0.6) 32%, rgba(4,12,20,0.28) 58%, rgba(4,12,20,0.08) 78%, rgba(4,12,20,0) 100%)",
          }}
        />
        {/* Light bottom feather so the image collage below reads as
            emerging from the hero rather than a hard photo-to-photo seam -
            subtle enough not to compete with the directional overlay
            above. */}
        <div
          className="absolute inset-x-0 bottom-0 h-24 md:h-32"
          style={{
            backgroundImage: "linear-gradient(0deg, rgba(4,12,20,0.35) 0%, rgba(4,12,20,0) 100%)",
          }}
        />
      </div>

      {/* Decorative blob */}
      <div
        aria-hidden
        className="absolute left-[13px] top-[75px] hidden h-[919px] w-[806px] rounded-[58%_42%_45%_55%/52%_48%_55%_45%] bg-[#65CEE6] opacity-60 mix-blend-screen blur-[100px] md:block"
      />

      {/* Copy + CTA */}
      <div className="relative z-10 flex h-full max-w-3xl flex-col justify-start gap-5 px-6 pt-6 md:justify-center md:gap-8 md:px-16 md:pt-0">
        <div className="flex flex-col gap-2">
          <p className="font-switzer text-base font-medium uppercase tracking-widest text-white/80 md:text-lg">
            {headlineLines[0]}
          </p>
          {/* Sized down a step (was text-6xl/text-8xl) - a slightly more
              restrained headline reads as a deliberate typographic choice
              rather than the biggest thing that would fit, and gives the
              mobile two-line break (below) room to land cleanly instead of
              nearly filling the viewport on its own. */}
          <h1 className="font-switzer text-5xl font-extralight leading-[1.05] tracking-tight text-white md:text-7xl">
            {mainLineLead}
            <br className="md:hidden" />
            {" "}
            {mainLineLastWord}
          </h1>
        </div>
        {/* Narrower on mobile (was max-w-xl, wider than the viewport itself
            once you subtract the section's own padding, so it was
            effectively unconstrained) - now wraps into a genuinely narrow,
            deliberate column instead of running edge to edge. */}
        <div className="max-w-[280px] font-switzer text-xl font-light text-white/90 sm:max-w-sm md:max-w-xl">
          {subcopyLines.map((line, i) => (
            <p key={i}>
              {line}
              {i < subcopyLines.length - 1 ? "." : ""}
            </p>
          ))}
        </div>
        {/* "Book in" -> "Book your dive" - matches the rename already made
            everywhere else the CTA appears (footer, pricing cards); this
            was the one spot still using the old generic label. */}
        <BookInButton className="flex w-fit items-center gap-2 rounded-[6px] bg-cta px-8 py-4 font-switzer text-base font-medium uppercase tracking-wide text-white transition-all duration-200 ease-out hover:bg-aquatic hover:text-dark-ocean-blue hover:scale-105 hover:shadow-lg hover:shadow-cta/40 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2">
          Book your dive
          <span aria-hidden>→</span>
        </BookInButton>
      </div>

      {/* Logo badge - scaled down (was a flat 100x100px at every
          breakpoint) so it reads as a supporting brand mark rather than
          competing with the headline for attention, and repositioned
          slightly to stay clear of both the shorter mobile hero's content
          stack above it and the image collage's overlap below it. */}
      <div className="absolute right-6 top-[300px] block size-[72px] md:right-24 md:top-[380px] md:size-[92px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoBadge} alt="Touchdown space badge" className="h-full w-full object-contain drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]" />
      </div>
    </section>
  );
}
