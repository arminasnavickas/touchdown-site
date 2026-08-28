"use client";

import { useEffect, useRef, useState } from "react";
import FadeImage from "./FadeImage";
import BookInButton from "./BookInButton";
import Reveal from "./Reveal";

const logoBadge = "/images/touchdown-stamp.svg";

// How long each slide stays on screen before crossfading to the next.
const SLIDE_DURATION_MS = 6000;
// How long the crossfade itself takes.
const CROSSFADE_MS = 1200;

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

  const slideCount = slides.length;

  // Carousel, take two. The first version rendered every slide's full-size
  // <img> up front, which meant a school with half a dozen hero photos in
  // Sanity shipped all of them to every visitor on page load - the loading/
  // rendering issues that got it ripped out. This version only ever mounts
  // a slide the first time it's actually shown, and keeps it mounted after
  // that so flipping back to it later is instant rather than a re-fetch.
  // So at any moment the browser has downloaded, at most, the slide on
  // screen now plus whichever ones have been on screen before it.
  const [activeIndex, setActiveIndex] = useState(0);
  const [mountedIndices, setMountedIndices] = useState<Set<number>>(() => new Set([0]));

  useEffect(() => {
    setMountedIndices((prev) => (prev.has(activeIndex) ? prev : new Set(prev).add(activeIndex)));
  }, [activeIndex]);

  // One slide ahead gets warmed in the background - a plain Image() fetch,
  // not a mount - so that by the time the crossfade reaches it, it's
  // already sitting in the browser's cache instead of starting a fresh
  // download right as it needs to appear. Still only ever one slide ahead,
  // never the whole set.
  useEffect(() => {
    if (slideCount < 2) return;
    const nextSrc = slides[(activeIndex + 1) % slideCount];
    if (!nextSrc) return;
    const preload = new window.Image();
    preload.src = nextSrc;
  }, [activeIndex, slideCount, slides]);

  // Autoplay - skipped entirely for a single-slide hero, and for anyone who
  // has asked their OS/browser for reduced motion. Re-runs on every index
  // change (including a manual dot click below), which has the nice side
  // effect of giving a visitor a full fresh interval after they navigate
  // manually instead of cutting straight to whatever was left of the
  // previous slide's countdown.
  useEffect(() => {
    if (slideCount < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % slideCount);
    }, SLIDE_DURATION_MS);
    return () => window.clearInterval(id);
  }, [slideCount, activeIndex]);

  // Only the bundled local fallback photo has a pre-generated mobile-sized
  // variant sitting next to it in /public/images. A Sanity-hosted image
  // comes from their CDN under a different URL entirely, so there's no
  // matching "-mobile" file to point at - in that case we just fall back to
  // serving that slide's own URL at every width, same as before.
  const isLocalHeroImage = (src: string) => src === "/images/hero.jpg";

  // Parallax via a ref + direct style write instead of React state - the
  // old version called setOffset() on every native scroll event, which
  // re-rendered the whole Hero component (including re-splitting the
  // headline/subcopy strings) dozens of times per second while scrolling.
  // Writing transform straight to the DOM node, throttled to one update
  // per animation frame, gets the same visual effect without any of that
  // React work on the hot path. Applied once to the layer stack as a whole
  // so every mounted slide - not just the active one - tracks together and
  // a mid-crossfade doesn't show two photos drifting at different rates.
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
    // Mobile height increased (460 -> 560) so Gallery's negative-margin
    // overlap (bumped in step, see Gallery.tsx) can tuck its entire first
    // row under hero's own bottom edge - hero's photo now visually
    // "finishes" right at the row 1/row 2 boundary instead of handing off
    // just 64px into row 1. Desktop pushed taller (700 -> 780) - this is the
    // first, iconic impression of the page, and the extra height lets the
    // headline scale up a full step below without ever feeling cramped
    // against the section's own edges - closer to a campaign key visual
    // than a website header banner.
    <section className="relative h-[560px] w-full overflow-hidden bg-dark-ocean-blue md:h-[780px]">
      {/* Background underwater image(s) (parallax) */}
      <div
        ref={parallaxRef}
        className="absolute inset-0"
        style={{ willChange: "transform" }}
      >
        {/* Every mounted slide stays in the DOM, stacked, and only opacity
            decides which one is visible - a plain crossfade rather than a
            slide/swipe transition, so it reads as one continuous photo
            breathing rather than a slideshow control. */}
        {slides.map((src, i) => {
          if (!mountedIndices.has(i)) return null;
          const isActive = i === activeIndex;
          return (
            <div
              key={src + i}
              aria-hidden={!isActive}
              className="absolute inset-0 transition-opacity ease-in-out"
              style={{ opacity: isActive ? 1 : 0, transitionDuration: `${CROSSFADE_MS}ms` }}
            >
              <FadeImage
                src={src}
                srcSet={
                  isLocalHeroImage(src)
                    ? "/images/hero-mobile.jpg 800w, /images/hero.jpg 1600w"
                    : undefined
                }
                sizes={isLocalHeroImage(src) ? "100vw" : undefined}
                alt="Freediver underwater in Dahab"
                eager={i === 0}
                wrapperClassName="absolute inset-0 h-[calc(100%+150px)]"
                className="h-full w-full object-cover object-[center_65%] md:scale-[1.35] md:object-[calc(50%_-_100px)_calc(65%_+_60px)]"
              />
            </div>
          );
        })}
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
              "linear-gradient(100deg, rgba(4,12,20,0.92) 0%, rgba(4,12,20,0.7) 28%, rgba(4,12,20,0.34) 54%, rgba(4,12,20,0.1) 76%, rgba(4,12,20,0) 100%)",
          }}
        />
        {/* Second, vertical layer - grounds the bottom-anchored copy block
            (moved down from a centered composition to a lower-third title
            card, the way a film opens on the frame before the title
            settles) without needing a second flat scrim over the whole
            image. */}
        <div
          className="absolute inset-x-0 bottom-0 h-[55%] md:h-[60%]"
          style={{
            backgroundImage: "linear-gradient(0deg, rgba(4,12,20,0.55) 0%, rgba(4,12,20,0) 100%)",
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

      {/* Copy + CTA - bottom-anchored on desktop (was vertically centered),
          a lower-third title-card composition instead of a mid-frame block,
          so the top two-thirds of the photograph gets to breathe as pure
          image before the copy grounds the frame. Mobile content is
          top-anchored (justify-start) so it isn't affected by the taller
          560px mobile height below - pb-[95px]/md:pb-[195px] keeps the
          whole block clear of Gallery's overlap zone (now a full 160px on
          mobile, up from ~64px, so Gallery's entire first row tucks under
          hero's bottom edge - see Gallery.tsx), with real breathing room to
          spare. */}
      <div className="relative z-10 flex h-full max-w-3xl translate-y-[35px] flex-col justify-start gap-5 px-6 pb-[95px] pt-6 md:translate-y-0 md:justify-end md:-translate-y-[100px] md:gap-8 md:px-16 md:pb-[195px]">
        <Reveal className="flex flex-col gap-2">
          <p className="font-switzer text-base font-medium uppercase tracking-[0.2em] text-white/80 md:text-lg">
            {headlineLines[0]}
          </p>
          {/* Mobile stays restrained at text-5xl (room for the deliberate
              two-line break below); desktop holds at 8xl - wider than that
              risks the headline wrapping mid-word inside its own column, so
              scale is pushed everywhere else in the frame (gradient depth,
              negative space, the bottom anchor above) instead of the type
              itself. */}
          <h1 className="font-switzer text-5xl font-extralight leading-[1.05] tracking-tight text-white md:text-8xl">
            {mainLineLead}
            <br className="md:hidden" />
            {" "}
            {mainLineLastWord}
          </h1>
        </Reveal>
        {/* Narrower on mobile (was max-w-xl, wider than the viewport itself
            once you subtract the section's own padding, so it was
            effectively unconstrained) - now wraps into a genuinely narrow,
            deliberate column instead of running edge to edge. */}
        <Reveal delay={80} className="max-w-[280px] font-switzer text-[15px] font-light text-white/90 sm:max-w-sm md:max-w-xl">
          {subcopyLines.map((line, i) => (
            <p key={i}>
              {line}
              {i < subcopyLines.length - 1 ? "." : ""}
            </p>
          ))}
        </Reveal>
        {/* "Book in" -> "Book your dive" - matches the rename already made
            everywhere else the CTA appears (footer, pricing cards); this
            was the one spot still using the old generic label. */}
        <Reveal delay={160}>
          <BookInButton className="flex w-fit items-center gap-2 rounded-[6px] bg-cta px-8 py-4 font-switzer text-base font-medium uppercase tracking-wide text-white transition-all duration-200 ease-out hover:bg-aquatic hover:text-dark-ocean-blue hover:scale-105 hover:shadow-lg hover:shadow-cta/40 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2">
            Book your dive
            <span aria-hidden>→</span>
          </BookInButton>
        </Reveal>
      </div>

      {/* Slide indicators - only worth showing once there's more than one
          photo to move between. Sits above the logo badge on the same
          right-aligned baseline rather than overlapping the copy block,
          which owns the left two-thirds of the frame. Each dot both shows
          progress and is a direct jump control. */}
      {slideCount > 1 && (
        <div
          role="tablist"
          aria-label="Hero image slides"
          className="absolute bottom-[180px] left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 md:bottom-[116px]"
        >
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Show slide ${i + 1} of ${slideCount}`}
              onClick={() => setActiveIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-6 bg-cta" : "w-1.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}

      {/* Logo badge - moved from a mid-frame float to the frame's bottom
          right corner, grounded on the same baseline as the copy block on
          the left instead of floating independently in open water. Reads as
          a deliberately placed insignia closing the composition, the way a
          film's mark sits in a corner of its opening frame, rather than a
          logo laid on top of a photo. Mobile offset raised again
          (bottom-[80px] -> bottom-[180px]), matched to hero's own +100px
          height increase, so the badge sits at the exact same absolute
          position as before while clearing Gallery's enlarged 160px overlap
          zone underneath it (with 20px to spare). */}
      <Reveal delay={240} className="absolute bottom-[180px] right-6 block size-[80px] md:bottom-[180px] md:right-20 md:size-[150px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoBadge} alt="Touchdown space badge" className="h-full w-full object-contain drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]" />
      </Reveal>
    </section>
  );
}
