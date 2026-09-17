import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import LightboxProvider from "@/components/LightboxContext";
import BookingProvider from "@/components/BookingContext";
import { getPricingTiers, getSiteContent, fallbackSiteContent } from "@/lib/content";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const viewport = {
  themeColor: "#003354",
};

// Was a static `export const metadata` with the title/description hardcoded
// here in the code. Pulled from Sanity's new metaTitle/metaDescription
// fields (siteContent.ts) instead, so Gus can update the browser-tab title
// and Google search snippet from Studio without a code change. Falls back
// to the exact same strings as before (fallbackSiteContent) whenever Sanity
// is unreachable or either field is left blank in Studio.
export async function generateMetadata(): Promise<Metadata> {
  const { metaTitle, metaDescription } = await getSiteContent();
  const title = metaTitle || fallbackSiteContent.metaTitle!;
  const description = metaDescription || fallbackSiteContent.metaDescription!;

  return {
    metadataBase: new URL("https://touchdown-space.com"),
    title: {
      default: title,
      template: "%s | Touchdown Freediving School",
    },
    description,
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
      title,
      description,
      url: "https://touchdown-space.com",
      siteName: "Touchdown Freediving School",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pricingTiers = await getPricingTiers();

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
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className="font-switzer antialiased">
        <BookingProvider tiers={pricingTiers}>
          <LightboxProvider>{children}</LightboxProvider>
        </BookingProvider>
      </body>
    </html>
  );
}
