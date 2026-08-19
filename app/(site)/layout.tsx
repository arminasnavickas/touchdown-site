import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageBlobs from "@/components/PageBlobs";
import LightboxProvider from "@/components/LightboxContext";
import BookingProvider from "@/components/BookingContext";
import { getSiteContent, getPricingTiers } from "@/lib/content";

// Chrome (nav/footer/blobs/providers) shared by all public-facing pages.
// Deliberately NOT applied to /studio, which lives outside this route
// group so the Sanity Studio gets a bare page with no site chrome.
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [siteContent, pricingTiers] = await Promise.all([
    getSiteContent(),
    getPricingTiers(),
  ]);

  return (
    <BookingProvider tiers={pricingTiers}>
      <LightboxProvider>
        <Navigation
          email={siteContent.footerEmail}
          telegram={siteContent.socialTelegram}
          whatsapp={siteContent.socialWhatsapp}
          navLinks={siteContent.headerNavLinks}
        />
        <div className="relative z-0">
          <PageBlobs />
          <div className="relative z-10">
            {children}
            <Footer
              email={siteContent.footerEmail}
              phone={siteContent.footerPhone}
              location={siteContent.footerLocation}
              tagline={siteContent.footerTagline}
              instagram={siteContent.socialInstagram}
              telegram={siteContent.socialTelegram}
              facebook={siteContent.socialFacebook}
              whatsapp={siteContent.socialWhatsapp}
              aboutTitle={siteContent.footerAboutTitle}
              aboutLinks={siteContent.footerAboutLinks}
              experienceTitle={siteContent.footerExperienceTitle}
              experienceLinks={siteContent.footerExperienceLinks}
              legalTitle={siteContent.footerLegalTitle}
              legalLinks={siteContent.footerLegalLinks}
              contactTitle={siteContent.footerContactTitle}
            />
          </div>
        </div>
      </LightboxProvider>
    </BookingProvider>
  );
}
