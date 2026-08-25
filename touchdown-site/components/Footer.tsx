import Link from "next/link";
import { InstagramIcon, TelegramIcon, FacebookIcon, WhatsappIcon } from "./SocialIcons";
import BookInButton from "./BookInButton";
import Blob from "./Blob";
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
    <div className="flex w-full flex-col items-start gap-4 text-left">
      <p className="font-switzer text-sm font-semibold uppercase tracking-[0.15em] text-aquatic">
        {title}
      </p>
      {links.map((link) => (
        <a
          key={link.id}
          href={hrefById[link.id] ?? "#"}
          data-fab-avoid
          className="font-switzer text-base font-light text-white/50 transition hover:text-aquatic"
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
    <footer id="site-footer" className="relative w-full flex flex-col items-center overflow-hidden text-white" style={{ backgroundColor: "#003252" }}>
      {/* Third and final glow of exactly three on the page (Hero, Pricing,
          and here) - sits behind the closing "Ready to Dive In?" CTA so the
          page's last beat gets the same quiet emphasis as its first,
          rather than ending on flat navy. */}
      <Blob className="left-[10%] top-[10%] h-[300px] w-[300px] -translate-y-1/3" />

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
        <div className="grid w-full grid-cols-2 items-start gap-x-4 gap-y-6 py-10 sm:gap-x-6 md:items-center md:gap-8 md:py-20">
          <div className="flex flex-col items-start gap-4 sm:gap-6">
            <div className="flex flex-col gap-1 sm:gap-3">
              <p className="font-switzer text-3xl font-light tracking-tight sm:text-4xl md:text-6xl">
                {tagline}
              </p>
              <p className="font-switzer text-sm font-light text-white/60 sm:text-base md:text-lg">
                {ctaSubcopy}
              </p>
            </div>
            {/* "Book in" -> "Book your dive" - reads as an actual next step
                rather than a slightly awkward standalone verb, and pairs
                naturally with "Ready to Dive In?" above it. Compact on
                mobile (this column is only half the screen now), full size
                from sm up. */}
            <BookInButton className="flex w-fit items-center gap-1.5 rounded-[6px] bg-cta px-4 py-2.5 text-center font-switzer text-xs font-medium uppercase tracking-wide text-white transition-all duration-200 ease-out hover:bg-aquatic hover:text-dark-ocean-blue hover:scale-105 hover:shadow-lg hover:shadow-cta/40 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 sm:gap-2 sm:px-8 sm:py-4 sm:text-base">
              Book your dive
              <span aria-hidden>→</span>
            </BookInButton>
          </div>

          <div className="flex flex-col items-start gap-2.5 sm:gap-4">
            <Link href="/" className="shrink-0">
              {/* Capped to ~130px on mobile (was rendering much wider at a
                  fixed height with no max-width) so it doesn't dominate a
                  column that's now only half the screen. Left-aligned like
                  everything else here, not pushed to the far right edge. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo} alt="Touchdown" className="h-4 w-auto max-w-[130px] sm:h-5 sm:max-w-none" />
            </Link>
            {/* Icons grouped tight to the logo, and sized down on mobile via
                the [&>svg] override below - SocialIcons' own size-8 default
                is sized for a desktop-width column, not a 2-up mobile one. */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-5">
              <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition hover:text-cta [&>svg]:size-5 sm:[&>svg]:size-6"><InstagramIcon /></a>
              <a href={telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="transition hover:text-cta [&>svg]:size-5 sm:[&>svg]:size-6"><TelegramIcon /></a>
              <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="transition hover:text-cta [&>svg]:size-5 sm:[&>svg]:size-6"><FacebookIcon /></a>
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="transition hover:text-cta [&>svg]:size-5 sm:[&>svg]:size-6"><WhatsappIcon /></a>
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
        <div className="grid w-full grid-cols-2 gap-x-8 gap-y-6 py-6 md:grid-cols-3 md:gap-y-8 md:py-8">
          <FooterColumn title={aboutTitle} links={aboutLinks} />
          <FooterColumn title={experienceTitle} links={experienceLinks} />

          <div className="col-span-2 flex w-full flex-col items-start gap-3 md:col-span-1 md:gap-4">
            <p className="font-switzer text-sm font-semibold uppercase tracking-[0.15em] text-aquatic">
              {contactTitle}
            </p>
            {/* Email in the cyan CTA color and a size up from the other
                contact lines - the one piece of contact info most likely to
                actually get used, so it gets to look like a destination
                rather than reading identically to a nav link. */}
            <a
              href={`mailto:${email}`}
              className="font-switzer text-base font-medium text-cta transition hover:text-white"
            >
              {email}
            </a>
            <a
              href={`tel:${phone}`}
              className="font-switzer text-base font-light text-white/50 transition hover:text-aquatic"
            >
              {phone}
            </a>
            <p className="font-switzer text-base font-light text-white/50">
              {location}
            </p>
          </div>
        </div>
      </div>

      {/* Legal lives here now as a compact inline list next to the
          copyright, instead of a whole column above for two short links -
          also lets Back to top keep its exact spot at the far right. */}
      <div className="relative z-10 flex w-full flex-col items-start gap-3 border-t border-aquatic/50 px-6 py-5 text-left md:flex-row md:items-center md:justify-between md:gap-6 md:px-16">
        <p className="font-switzer text-sm font-light text-aquatic/80">
          © {new Date().getFullYear()} Touchdown Space. All rights reserved.
          <br />
          Website design by{" "}
          <a
            href="https://arminas.website"
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition hover:text-white"
          >
            Arminas
          </a>
          . Pictures by{" "}
          <a
            href="https://eslampiko.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition hover:text-white"
          >
            Eslam Piko
          </a>
          .
        </p>

        <div className="flex items-center gap-6">
          <p className="font-switzer text-sm font-light text-aquatic/80">
            {legalLinks.map((link, i) => (
              <span key={link.id}>
                {i > 0 && <span className="mx-1.5 text-aquatic/40">·</span>}
                <a href={hrefById[link.id] ?? "#"} className="transition hover:text-white">
                  {link.label}
                </a>
              </span>
            ))}
          </p>
          <a
            href="#"
            aria-label="Back to top"
            className="flex shrink-0 items-center gap-1.5 font-switzer text-xs font-medium uppercase tracking-widest text-aquatic/80 transition hover:text-white"
          >
            Back to top
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-3.5">
              <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
