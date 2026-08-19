import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageBlobs from "@/components/PageBlobs";
import LightboxProvider from "@/components/LightboxContext";
import BookingProvider from "@/components/BookingContext";
import { getSiteContent, getPricingTiers } from "@/lib/content";

export const viewport = {
  themeColor: "#003354",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://touchdown-space.com"),
  title: {
    default: "Touchdown Freediving School — Dahab, Egypt",
    template: "%s | Touchdown Freediving School",
  },
  description:
    "Freediving school founded by Gus Kreivenas in Dahab, Egypt. World-class coaching, depth training, and tailored courses at the legendary Blue Hole.",
  keywords: [
    "freediving",
    "freediving school",
    "Dahab",
    "Blue Hole",
    "freediving course",
    "Gus Kreivenas",
    "Touchdown freediving",
    "AIDA freediving instructor",
    "freediving Egypt",
  ],
  authors: [{ name: "Touchdown Freediving School" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Touchdown Freediving School — Dahab, Egypt",
    description:
      "Freediving school founded by Gus Kreivenas in Dahab, Egypt. World-class coaching, depth training, and tailored courses at the legendary Blue Hole.",
    url: "https://touchdown-space.com",
    siteName: "Touchdown Freediving School",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Touchdown Freediving School — Dahab, Egypt",
    description:
      "Freediving school founded by Gus Kreivenas in Dahab, Egypt. World-class coaching, depth training, and tailored courses at the legendary Blue Hole.",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [siteContent, pricingTiers] = await Promise.all([
    getSiteContent(),
    getPricingTiers(),
  ]);

  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/Switzer-Extralight.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-switzer antialiased">
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
      </body>
    </html>
  );
}
