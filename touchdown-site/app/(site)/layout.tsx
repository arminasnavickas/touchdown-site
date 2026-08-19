import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageBlobs from "@/components/PageBlobs";
import { getSiteContent } from "@/lib/content";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteContent = await getSiteContent();

  return (
    <>
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
    </>
  );
}
