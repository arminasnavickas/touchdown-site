import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { getSiteContent } from "@/lib/content";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteContent = await getSiteContent();

  // showReviews toggles the whole Reviews section off the homepage (see
  // Reviews usage in app/(site)/page.tsx) without deleting any review
  // entries in Sanity - filtering it out of both link lists here too keeps
  // the header nav and footer from linking to a section that isn't there.
  // blogEnabled works the same way for the Blog nav/footer link and the
  // /blog routes (redirected in app/(site)/blog/page.tsx and
  // app/(site)/blog/[slug]/page.tsx, and excluded from app/sitemap.ts).
  const navLinks = siteContent.headerNavLinks.filter((link) => {
    if (link.id === "reviews" && !siteContent.showReviews) return false;
    if (link.id === "blog" && !siteContent.blogEnabled) return false;
    return true;
  });
  const footerAboutLinks = siteContent.showReviews
    ? siteContent.footerAboutLinks
    : siteContent.footerAboutLinks.filter((link) => link.id !== "reviews");
  const footerExperienceLinks = siteContent.blogEnabled
    ? siteContent.footerExperienceLinks
    : siteContent.footerExperienceLinks.filter((link) => link.id !== "blog");

  return (
    <>
      <Navigation
        email={siteContent.footerEmail}
        telegram={siteContent.socialTelegram}
        whatsapp={siteContent.socialWhatsapp}
        navLinks={navLinks}
      />
      {/* The two page-wide ambient blobs that used to live here are gone -
          combined with every section's own local Blob, cyan glow was
          showing up almost everywhere on the page rather than reading as a
          deliberate accent. Glow now only appears at the three strongest
          information moments (Hero, How It Works, Pricing), each via its
          own local Blob. */}
      <div className="relative z-0">
        <div className="relative z-10">
          {children}
          <Footer
            email={siteContent.footerEmail}
            phone={siteContent.footerPhone}
            location={siteContent.footerLocation}
            tagline={siteContent.footerTagline}
            ctaSubcopy={siteContent.footerCtaSubcopy}
            instagram={siteContent.socialInstagram}
            telegram={siteContent.socialTelegram}
            facebook={siteContent.socialFacebook}
            whatsapp={siteContent.socialWhatsapp}
            aboutTitle={siteContent.footerAboutTitle}
            aboutLinks={footerAboutLinks}
            experienceTitle={siteContent.footerExperienceTitle}
            experienceLinks={footerExperienceLinks}
            legalLinks={siteContent.footerLegalLinks}
            contactTitle={siteContent.footerContactTitle}
          />
        </div>
      </div>
    </>
  );
}
