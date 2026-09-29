import Link from "next/link";
import { InstagramIcon, TelegramIcon, FacebookIcon, WhatsappIcon } from "./SocialIcons";
import BookInButton from "./BookInButton";
import Blob from "./Blob";
import NewsletterSignup from "./NewsletterSignup";
import type { FooterLink } from "@/lib/content";

const logo = "/images/logo-white.svg";

// Fixed regardless of what the Studio's link text says — a renamed label
// can never silently break navigation, since the href is resolved by this
// stable id, not by matching the displayed text.
const hrefById: Record<string, string> = {
  "about-us": "/#about-us",
  team: "/#team",
  reviews: "/#reviews",
  faq: "/#faq",
  "how-it-works": "/#courses",
  schedule: "/#schedule",
  prices: "/#prices",
  blog: "/blog",
  "privacy-policy": "/privacy",
  "terms-and-conditions": "/terms",
};

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div className="flex w-full flex-col items-start gap-3 text-left">
      <p className="font-switzer text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
        {title}
      </p>
      {links.map((link) => (
        <a
          key={link.id}
          href={hrefById[link.id] ?? "#"}
          data-fab-avoid
          className="font-switzer text-base font-light text-white/70 transition hover:text-cta"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}

export default function Footer({
  email,
  phone,
  location,
  tagline,
  ctaSubcopy,
  instagram,
  telegram,
  facebook,
  whatsapp,
  aboutTitle,
  aboutLinks,
  experienceTitle,
  experienceLinks,
  legalLinks,
  contactTitle,
}: {
  email: string;
  phone: string;
  location: string;
  tagline: string;
  ctaSubcopy: string;
  instagram: string;
  telegram: string;
  facebook: string;
  whatsapp: string;
  aboutTitle: string;
  aboutLinks: FooterLink[];
  experienceTitle: string;
  experienceLinks: FooterLink[];
  legalLinks: FooterLink[];
  contactTitle: string;
}) {
  return (
    <footer id="site-footer" className="relative w-full flex flex-col items-center overflow-hidden bg-body-navy text-white">
      <div className="relative flex w-full flex-col items-center">
      {/* Third and final glow of exactly three on the page (Hero, Pricing,
          and here) - sits behind the closing "Ready to Dive In?" CTA so the
          page's last beat gets the same quiet emphasis as its first,
          rather than ending on flat navy. */}
      <Blob className="left-[10%] top-[10%] h-[180px] w-[180px] -translate-y-1/3 md:h-[300px] md:w-[300px]" />

      {/* Subtle top seam - a thin gradient line instead of the same flat
          navy the page above already uses, so the footer reads as a
          deliberate final section rather than just where the last section
          happened to stop. */}
      <div className="relative z-10 h-px w-full shrink-0 bg-gradient-to-r from-transparent via-aquatic/40 to-transparent" />

      {/* Left-aligned at every breakpoint, including mobile - this used to
          center everything below md, which combined with the old
          flex-col-then-row CTA/brand block made mobile read as "a desktop
          footer collapsed into one column" rather than a deliberately
          designed compact layout. */}
      <div className="relative z-10 flex w-full flex-col items-start divide-y divide-white/10 px-6 text-left md:px-16">
        {/* A real 2-column grid at every breakpoint (not flex-col on mobile
            switching to flex-row at md) - CTA on the left, brand/socials on
            the right, from the smallest screen up. Keeps the mobile footer
            compact instead of stacking these into one tall column. */}
        {/* This block is the page's real ending, not another footer row -
            more vertical room (py-10 -> py-20 on desktop) and a bigger
            tagline (5xl -> 6xl) than the pass before it, so the site
            visibly concludes on a statement instead of just running out of
            sections. */}
        <div className="grid w-full grid-cols-1 items-start gap-x-8 gap-y-12 py-14 md:grid-cols-5 md:py-24">
          <div className="flex w-full flex-row flex-wrap items-end justify-between gap-x-6 gap-y-4 md:col-span-3 md:flex-col md:items-start md:justify-start md:gap-6">
            <div className="flex flex-col gap-1 sm:gap-3">
              <p className="font-switzer text-4xl font-extralight tracking-tight sm:text-5xl md:text-5xl lg:text-6xl">
                {tagline}
              </p>
              <p className="font-switzer text-base font-light leading-relaxed text-white/70 md:text-lg">
                {ctaSubcopy}
              </p>
            </div>
            {/* "Book in" -> "Book your dive" - reads as an actual next step
                rather than a slightly awkward standalone verb, and pairs
                naturally with "Ready to Dive In?" above it. Compact on
                mobile (this column is only half the screen now), full size
                from sm up. */}
            <BookInButton className="ml-auto w-fit md:ml-0" />
          </div>
          <div className="hidden w-full flex-col gap-5 md:col-span-2 md:col-start-4 md:flex md:self-end">
            <div className="flex flex-col gap-1.5">
              <p className="font-switzer text-xl font-medium text-white md:text-2xl">
                Stay in the loop
              </p>
              <p className="font-switzer text-base font-light text-white/60">
                Diving tips, course updates and Dahab stories, straight to your inbox.
              </p>
            </div>
            <NewsletterSignup className="w-full" />
          </div>

          <div className="flex w-full flex-col items-start gap-5 border-t border-white/10 pt-12 md:hidden">
            <p className="font-switzer text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Follow our dives
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex size-12 items-center justify-center md:size-14 rounded-full border border-white/10 bg-white/[0.04] text-white/80 transition hover:border-cta/40 hover:text-cta [&>svg]:size-6 md:[&>svg]:size-7"><InstagramIcon /></a>
              <a href={telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="flex size-12 items-center justify-center md:size-14 rounded-full border border-white/10 bg-white/[0.04] text-white/80 transition hover:border-cta/40 hover:text-cta [&>svg]:size-6 md:[&>svg]:size-7"><TelegramIcon /></a>
              <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex size-12 items-center justify-center md:size-14 rounded-full border border-white/10 bg-white/[0.04] text-white/80 transition hover:border-cta/40 hover:text-cta [&>svg]:size-6 md:[&>svg]:size-7"><FacebookIcon /></a>
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex size-12 items-center justify-center md:size-14 rounded-full border border-white/10 bg-white/[0.04] text-white/80 transition hover:border-cta/40 hover:text-cta [&>svg]:size-6 md:[&>svg]:size-7"><WhatsappIcon /></a>
            </div>
          </div>
        </div>

        {/* About | Experience already reads well as a 2-up mobile row, so
            that part's unchanged structurally - just slightly smaller link
            text (text-lg -> text-base) and tighter vertical padding to fit
            the more compact rhythm of the section above. Three columns
            instead of four overall - Legal moved down into the bottom bar
            below (two short links didn't need a whole column of their
            own), and Contact spans both columns on mobile (col-span-2)
            rather than fighting About/Experience for width in a cramped
            3-up row. */}
        <div className="grid w-full grid-cols-2 gap-x-8 gap-y-8 py-10 max-md:!border-t-0 md:grid-cols-5 md:gap-y-8 md:py-12">
          <div className="hidden w-full flex-col items-start gap-5 md:col-span-1 md:flex">
            <p className="font-switzer text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Follow our dives
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex size-12 items-center justify-center md:size-14 rounded-full border border-white/10 bg-white/[0.04] text-white/80 transition hover:border-cta/40 hover:text-cta [&>svg]:size-6 md:[&>svg]:size-7"><InstagramIcon /></a>
              <a href={telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="flex size-12 items-center justify-center md:size-14 rounded-full border border-white/10 bg-white/[0.04] text-white/80 transition hover:border-cta/40 hover:text-cta [&>svg]:size-6 md:[&>svg]:size-7"><TelegramIcon /></a>
              <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex size-12 items-center justify-center md:size-14 rounded-full border border-white/10 bg-white/[0.04] text-white/80 transition hover:border-cta/40 hover:text-cta [&>svg]:size-6 md:[&>svg]:size-7"><FacebookIcon /></a>
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex size-12 items-center justify-center md:size-14 rounded-full border border-white/10 bg-white/[0.04] text-white/80 transition hover:border-cta/40 hover:text-cta [&>svg]:size-6 md:[&>svg]:size-7"><WhatsappIcon /></a>
            </div>
          </div>
          <FooterColumn title="Get to know us" links={aboutLinks} />
          <FooterColumn title="Dive with us" links={experienceLinks} />

          <div className="flex w-full min-w-0 flex-col items-start gap-3 md:col-span-1">
            <p className="font-switzer text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Say hello
            </p>
            {/* Email in the cyan CTA color and a size up from the other
                contact lines - the one piece of contact info most likely to
                actually get used, so it gets to look like a destination
                rather than reading identically to a nav link. */}
            <a
              href={`mailto:${email}`}
              className="break-all font-switzer text-base font-medium text-cta transition hover:text-white"
            >
              {email}
            </a>
            <a
              href={`tel:${phone}`}
              className="font-switzer text-base font-light text-white/70 transition hover:text-cta"
            >
              {phone}
            </a>
            <p className="font-switzer text-base font-light text-white/70">
              {location}
            </p>
          </div>

          <div className="min-w-0 md:col-span-1">
            <FooterColumn title="The small print" links={legalLinks} />
          </div>

          <div className="col-span-2 flex w-full flex-col gap-5 border-t border-white/10 pt-12 md:hidden">
            <div className="flex flex-col gap-1.5">
              <p className="font-switzer text-xl font-medium text-white md:text-2xl">
                Stay in the loop
              </p>
              <p className="font-switzer text-base font-light text-white/60">
                Diving tips, course updates and Dahab stories, straight to your inbox.
              </p>
            </div>
            <NewsletterSignup className="w-full" />
          </div>
        </div>

      </div>

      {/* Its own visual panel rather than another plain divide-y row - a
          bordered card with a bigger icon, heading and form so it reads as
          a real invitation to subscribe instead of a footnote next to the
          contact details. Sized up from the old inline-label version:
          text-xl/2xl heading (was a text-sm uppercase label), a 48px/56px
          icon circle, and a taller form (see NewsletterSignup's own sizing).
          Sits outside the divide-y container above so its own border does
          not fight with the automatic divider that container adds. */}
      {/* Legal lives here now as a compact inline list next to the
          copyright, instead of a whole column above for two short links -
          also lets Back to top keep its exact spot at the far right.
          border-white/10 (was border-aquatic/50) - every other divider on
          the page (Pricing, FAQ, What You Get, Training Rhythm) already
          agrees on a quiet white hairline; this was the one place a bright,
          saturated cyan rule broke that shared convention. */}
      {/* Oversized, near invisible wordmark sitting above the copyright bar. Decorative only, so it is hidden from assistive tech. */}
      <div aria-hidden className="pointer-events-none relative z-0 w-full select-none px-6 pb-10 pt-4 md:px-16 md:pb-14">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} alt="" className="w-full opacity-[0.07]" />
      </div>

      <div className="relative z-10 w-full px-6 md:px-16">
        <div className="flex w-full flex-col items-center gap-4 border-t border-white/10 py-6 text-center md:flex-row md:items-center md:justify-between md:gap-6 md:text-left">
          {/* Copyright and credits on one quiet line; two separate spans so a
              screen reader still reads them as distinct statements. */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 font-switzer text-sm font-light text-white/45 md:justify-start">
            <p>© {new Date().getFullYear()} Touchdown Space. All rights reserved.</p>
            <p>
              Website design by{" "}
              <a
                href="https://arminas.website"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-white"
              >
                Arminas
              </a>
              . Pictures by{" "}
              <a
                href="https://eslampiko.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-white"
              >
                Eslam Piko
              </a>
              .
            </p>
          </div>

          <a
            href="#"
            aria-label="Back to top"
            className="group/top flex shrink-0 items-center gap-2 font-switzer text-xs font-medium uppercase tracking-widest text-white/60 transition hover:text-white"
          >
            Back to top
            <span className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition group-hover/top:border-cta/40 group-hover/top:text-cta">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-3.5">
                <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        </div>
      </div>

    </div>
    </footer>
  );
}
