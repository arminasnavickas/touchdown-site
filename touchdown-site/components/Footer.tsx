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
    <div className="flex w-full flex-col items-center gap-4 md:w-auto md:min-w-[120px] md:items-start">
      <p className="font-switzer text-lg font-medium">{title}</p>
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
  instagram,
  telegram,
  facebook,
  whatsapp,
  aboutTitle,
  aboutLinks,
  experienceTitle,
  experienceLinks,
  legalTitle,
  legalLinks,
  contactTitle,
}: {
  email: string;
  phone: string;
  location: string;
  tagline: string;
  instagram: string;
  telegram: string;
  facebook: string;
  whatsapp: string;
  aboutTitle: string;
  aboutLinks: FooterLink[];
  experienceTitle: string;
  experienceLinks: FooterLink[];
  legalTitle: string;
  legalLinks: FooterLink[];
  contactTitle: string;
}) {
  return (
    <footer id="site-footer" className="w-full flex flex-col items-center gap-14 pt-12 text-white" style={{ backgroundColor: "#003252" }}>
      <div className="flex w-full flex-col items-center divide-y divide-white/10 px-6 text-center md:flex-row md:flex-wrap md:items-start md:justify-between md:gap-10 md:divide-y-0 md:px-16 md:text-left">
        <div className="flex w-full flex-col items-center gap-6 py-8 md:w-auto md:min-w-[220px] md:shrink-0 md:items-start md:gap-10 md:py-0">
          <Link href="/" className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt="Touchdown" className="h-5 w-auto max-w-none" />
          </Link>
          <div className="flex gap-6">
            <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition hover:text-cta"><InstagramIcon /></a>
            <a href={telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="transition hover:text-cta"><TelegramIcon /></a>
            <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="transition hover:text-cta"><FacebookIcon /></a>
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="transition hover:text-cta"><WhatsappIcon /></a>
          </div>
        </div>

        {/* Grid on mobile so the four link groups sit 2-per-row instead of
            stacking one at a time full-width; desktop switches back to the
            original flex-row wrap via md:flex. */}
        <div className="grid w-full grid-cols-2 gap-8 py-8 md:flex md:w-auto md:flex-1 md:flex-row md:flex-wrap md:items-start md:content-start md:justify-center md:gap-10 md:py-0">
          <FooterColumn title={aboutTitle} links={aboutLinks} />
          <FooterColumn title={experienceTitle} links={experienceLinks} />
          <FooterColumn title={legalTitle} links={legalLinks} />

          <div className="flex w-full flex-col items-center gap-4 md:w-auto md:min-w-[120px] md:items-start">
            <p className="font-switzer text-lg font-medium">{contactTitle}</p>
            <a
              href={`mailto:${email}`}
              className="font-switzer text-lg font-light text-white/50 transition hover:text-aquatic"
            >
              Email: {email}
            </a>
            <a
              href={`tel:${phone}`}
              className="font-switzer text-lg font-light text-white/50 transition hover:text-aquatic"
            >
              Phone: {phone}
            </a>
            <p className="font-switzer text-lg font-light text-white/50">
              {location}
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-6 py-8 md:w-auto md:min-w-[220px] md:items-end md:py-0">
          <p className="font-switzer text-2xl font-light tracking-tight md:text-3xl">
            {tagline}
          </p>
          <div className="flex flex-col gap-3">
            <BookInButton className="w-fit rounded-[6px] bg-cta px-8 py-4 text-center font-switzer text-base font-medium uppercase tracking-wide text-white transition-all duration-200 ease-out hover:bg-aquatic hover:text-dark-ocean-blue hover:scale-105 hover:shadow-lg hover:shadow-cta/40 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2">
              Book in
            </BookInButton>
          </div>
        </div>
      </div>

      <div className="relative flex w-full flex-col items-center gap-4 border-t border-aquatic/50 px-6 py-6 text-center md:px-16">
        <p className="mx-auto font-switzer text-base font-light text-aquatic">
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
        <a
          href="#"
          aria-label="Back to top"
          className="flex shrink-0 items-center gap-2 font-switzer text-sm font-medium uppercase tracking-widest text-aquatic transition hover:text-white md:absolute md:right-16 md:top-1/2 md:-translate-y-1/2"
        >
          Back to top
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
            <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </footer>
  );
}
