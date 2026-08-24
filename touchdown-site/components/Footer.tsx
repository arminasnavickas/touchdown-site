import Link from "next/link";
import { InstagramIcon, TelegramIcon, FacebookIcon, WhatsappIcon } from "./SocialIcons";
import BookInButton from "./BookInButton";
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
          className="font-switzer text-lg font-light text-white/50 transition hover:text-aquatic"
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
    <footer id="site-footer" className="w-full flex flex-col items-center text-white" style={{ backgroundColor: "#003252" }}>
      {/* Subtle top seam - a thin gradient line instead of the same flat
          navy the page above already uses, so the footer reads as a
          deliberate final section rather than just where the last section
          happened to stop. */}
      <div className="h-px w-full shrink-0 bg-gradient-to-r from-transparent via-aquatic/40 to-transparent" />

      <div className="flex w-full flex-col items-center divide-y divide-white/10 px-6 text-center md:px-16">
        {/* The CTA is the footer's actual job (get one more booking before
            the visitor leaves), so it's now the largest, most prominent
            thing here - not a small headline sharing a 2x2 grid with the
            logo. Logo/socials moved into their own group on the right,
            independent of the CTA block's height. */}
        <div className="flex w-full flex-col items-start gap-8 py-10 text-left md:flex-row md:items-center md:justify-between md:gap-6">
          <div className="flex flex-col items-start gap-5">
            <div className="flex flex-col gap-2">
              <p className="font-switzer text-3xl font-light tracking-tight md:text-5xl">
                {tagline}
              </p>
              <p className="font-switzer text-lg font-light text-white/60">
                {ctaSubcopy}
              </p>
            </div>
            {/* "Book in" -> "Book your dive" - reads as an actual next step
                rather than a slightly awkward standalone verb, and pairs
                naturally with "Ready to Dive In?" above it. */}
            <BookInButton className="flex w-fit items-center gap-2 rounded-[6px] bg-cta px-8 py-4 text-center font-switzer text-base font-medium uppercase tracking-wide text-white transition-all duration-200 ease-out hover:bg-aquatic hover:text-dark-ocean-blue hover:scale-105 hover:shadow-lg hover:shadow-cta/40 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2">
              Book your dive
              <span aria-hidden>→</span>
            </BookInButton>
          </div>

          <div className="flex shrink-0 flex-col items-start gap-4 md:items-end">
            <Link href="/" className="shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo} alt="Touchdown" className="h-5 w-auto max-w-none" />
            </Link>
            {/* Icons grouped tight to the logo (was a wide gap-6 sitting on
                its own row below) so logo + socials read as one unit. */}
            <div className="flex items-center gap-5">
              <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition hover:text-cta"><InstagramIcon /></a>
              <a href={telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="transition hover:text-cta"><TelegramIcon /></a>
              <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="transition hover:text-cta"><FacebookIcon /></a>
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="transition hover:text-cta"><WhatsappIcon /></a>
            </div>
          </div>
        </div>

        {/* Three columns instead of four - Legal moved down into the
            bottom bar below (two short links didn't need a whole column of
            their own), which turns this into a proper About / Experience /
            Get in touch system instead of four visually-equal blocks.
            Contact spans both columns on mobile (col-span-2) rather than
            fighting About and Experience for width in a cramped 3-up row. */}
        <div className="grid w-full grid-cols-2 gap-x-8 gap-y-8 py-8 text-left md:grid-cols-3">
          <FooterColumn title={aboutTitle} links={aboutLinks} />
          <FooterColumn title={experienceTitle} links={experienceLinks} />

          <div className="col-span-2 flex w-full flex-col items-start gap-4 md:col-span-1">
            <p className="font-switzer text-sm font-semibold uppercase tracking-[0.15em] text-aquatic">
              {contactTitle}
            </p>
            {/* Email in the cyan CTA color and a size up from the other
                contact lines - the one piece of contact info most likely to
                actually get used, so it gets to look like a destination
                rather than reading identically to a nav link. */}
            <a
              href={`mailto:${email}`}
              className="font-switzer text-lg font-medium text-cta transition hover:text-white"
            >
              {email}
            </a>
            <a
              href={`tel:${phone}`}
              className="font-switzer text-lg font-light text-white/50 transition hover:text-aquatic"
            >
              {phone}
            </a>
            <p className="font-switzer text-lg font-light text-white/50">
              {location}
            </p>
          </div>
        </div>
      </div>

      {/* Legal lives here now as a compact inline list next to the
          copyright, instead of a whole column above for two short links -
          also lets Back to top keep its exact spot at the far right. */}
      <div className="relative flex w-full flex-col items-center gap-3 border-t border-aquatic/50 px-6 py-5 text-center md:flex-row md:items-center md:justify-between md:gap-6 md:px-16 md:text-left">
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
