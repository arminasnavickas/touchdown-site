"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import BookInButton from "./BookInButton";
import type { FooterLink } from "@/lib/content";

const logo = "/images/logo.svg";

// Fixed regardless of what the Studio's link text says — same pattern as
// the footer nav, so a renamed label can never silently break navigation
// or the scroll-spy highlight.
const hrefById: Record<string, string> = {
  "about-us": "/#about-us",
  "how-it-works": "/#courses",
  schedule: "/#schedule",
  prices: "/#prices",
  team: "/#team",
  reviews: "/#reviews",
  faq: "/#faq",
  blog: "/blog",
};

const slugById: Record<string, string> = {
  "about-us": "about-us",
  "how-it-works": "courses",
  schedule: "schedule",
  prices: "prices",
  team: "team",
  reviews: "reviews",
  faq: "faq",
};

function WhatsappIcon({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.42-1.36a9.9 9.9 0 0 0 4.62 1.14h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2Zm5.72 14.02c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.13.11-1.82-.11-.42-.13-.96-.32-1.66-.62-2.92-1.26-4.82-4.19-4.97-4.38-.15-.2-1.19-1.58-1.19-3.01 0-1.43.75-2.13 1.02-2.42.27-.29.58-.36.78-.36.2 0 .39 0 .56.01.18.01.42-.07.66.5.24.58.82 2 .89 2.15.07.15.11.32.02.52-.09.2-.14.32-.28.5-.14.17-.29.38-.42.51-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.11.6-.07.16-.18.68-.79.87-1.06.18-.27.36-.22.6-.13.24.09 1.55.73 1.81.86.27.14.45.2.51.31.06.12.06.68-.18 1.35Z" />
    </svg>
  );
}

function TelegramIcon({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M21.05 3.53 2.9 10.6c-1.24.5-1.24 1.2-.23 1.5l4.66 1.46 1.79 5.5c.22.6.11.85.75.85.5 0 .72-.23 1-.5l2.4-2.34 4.98 3.68c.92.51 1.58.25 1.81-.85l3.28-15.46c.34-1.35-.5-1.96-1.29-1.65Z" />
    </svg>
  );
}

function EnvelopeIcon({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <path d="m3 6 9 6.5L21 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-9">
      {open ? (
        <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
      ) : (
        <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
      )}
    </svg>
  );
}

export default function Navigation({
  email,
  telegram,
  whatsapp,
  navLinks,
}: {
  email: string;
  telegram: string;
  whatsapp: string;
  navLinks: FooterLink[];
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const pathname = usePathname();
  const onHomepage = pathname === "/";

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock background scroll while the mobile menu is open. `overflow:
  // hidden` alone does NOT prevent touch-scrolling on iOS Safari - the
  // page behind still scrolls, dragging this sticky header (logo + close
  // button) off-screen with it. Pinning the body at its current scroll
  // position via `position: fixed` is the reliable cross-browser fix, then
  // we restore the exact scroll position on close.
  useEffect(() => {
    if (!open) return;
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
  }, [open]);

  // Scroll-spy: highlight whichever homepage section is currently in view.
  // Only relevant on the homepage itself - other pages (like /blog) don't
  // have these sections to observe.
  useEffect(() => {
    if (!onHomepage) return;
    const sectionSlugs = navLinks
      .filter((link) => link.id !== "blog")
      .map((link) => slugById[link.id])
      .filter(Boolean);
    const sections = sectionSlugs
      .map((slug) => document.getElementById(slug))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [onHomepage, navLinks]);

  function isActive(id: string) {
    if (id === "blog") return pathname?.startsWith("/blog") ?? false;
    return onHomepage && activeSection === slugById[id];
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        // Solid background (no backdrop-blur) whenever the mobile menu is
        // open - Safari has a rendering bug where a sticky element's own
        // content (the logo, the close icon) can render blurred when the
        // element also has backdrop-filter applied, and the menu is about
        // to sit on solid white below it anyway, so translucency here
        // wasn't buying anything visually.
        scrolled || open ? "bg-white shadow-sm" : "bg-white/80 shadow-none backdrop-blur-md"
      }`}
    >
      {/* z-50 here matters: the mobile backdrop below is z-40, and without
          an explicit z-index this row defaults to stacking level 0 - which
          put the backdrop's dark blur ON TOP of the logo and close button
          instead of behind them, which is what actually made them look
          blurred/faded (not the header's own backdrop-blur). */}
      <div className="relative z-50 flex items-center gap-8 px-6 py-4 md:gap-12 md:px-16">
        <Link
          href="/"
          className="absolute left-1/2 top-1/2 shrink-0 -translate-x-1/2 -translate-y-1/2 md:static md:left-auto md:top-auto md:translate-x-0 md:translate-y-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt="Touchdown" className="h-10 w-auto md:h-5" />
        </Link>

        <nav className="hidden flex-1 items-center justify-end gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={hrefById[link.id] ?? "#"}
              className={`group relative font-switzer text-sm font-medium uppercase tracking-wide transition hover:text-horizon ${
                isActive(link.id) ? "text-horizon" : "text-dark-ocean-blue"
              }`}
            >
              {link.label}
              <span
                className={`absolute -bottom-1 left-0 h-[2px] bg-horizon transition-all duration-300 ${
                  isActive(link.id) ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-4 text-dark-ocean-blue md:flex">
          <div className="flex items-center gap-3">
            <a href={`mailto:${email}`} aria-label="Email" className="transition hover:text-horizon">
              <EnvelopeIcon />
            </a>
            <a href={telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="transition hover:text-horizon">
              <TelegramIcon />
            </a>
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="transition hover:text-horizon">
              <WhatsappIcon />
            </a>
          </div>
          <BookInButton className="rounded-[6px] bg-cta px-6 py-3 font-switzer text-sm font-medium uppercase tracking-wide text-white transition hover:bg-aquatic hover:text-dark-ocean-blue">
            Book in
          </BookInButton>
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="ml-auto text-dark-ocean-blue md:hidden"
        >
          <MenuIcon open={open} />
        </button>
      </div>

      {/* Backdrop behind the mobile menu, so the open panel reads clearly
          against the page content instead of sitting flush on top of it.
          No backdrop-blur here on purpose: Safari has a rendering bug
          where backdrop-filter on an element inside a position:sticky
          ancestor (the header) can blur nearby content unpredictably -
          that's what was making the logo/close icon look blurred, not a
          z-index issue. Plain tint avoids the whole bug. */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-dark-ocean-blue/70 transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Mobile menu - absolutely positioned (relative to the sticky
          header) so it floats as an overlay on top of the page instead of
          pushing the rest of the content down as it opens. Scrolls
          internally if it's taller than the viewport. */}
      <div
        className={`absolute inset-x-0 top-full z-50 overflow-y-auto overscroll-contain border-t border-danish-blue/20 bg-white transition-all duration-300 md:hidden ${
          open ? "max-h-[calc(100vh-5rem)]" : "max-h-0 border-t-0"
        }`}
      >
        <nav className="flex flex-col px-6 py-2">
          {navLinks.map((link, i) => (
            <a
              key={link.id}
              href={hrefById[link.id] ?? "#"}
              onClick={() => setOpen(false)}
              className={`py-4 font-switzer text-lg font-medium uppercase tracking-wide transition hover:text-horizon ${
                i > 0 ? "border-t border-danish-blue/20" : ""
              } ${isActive(link.id) ? "text-horizon" : "text-dark-ocean-blue"}`}
            >
              {link.label}
            </a>
          ))}
          <BookInButton className="mt-4 w-full rounded-[6px] bg-cta px-8 py-4 font-switzer text-base font-medium uppercase tracking-wide text-white transition hover:bg-aquatic hover:text-dark-ocean-blue">
            Book in
          </BookInButton>
          <div className="mt-4 flex items-center justify-center gap-8 border-t border-danish-blue/20 pb-8 pt-6 text-dark-ocean-blue">
            <a href={`mailto:${email}`} aria-label="Email" className="transition hover:text-horizon">
              <EnvelopeIcon className="size-9" />
            </a>
            <a href={telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="transition hover:text-horizon">
              <TelegramIcon className="size-9" />
            </a>
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="transition hover:text-horizon">
              <WhatsappIcon className="size-9" />
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
