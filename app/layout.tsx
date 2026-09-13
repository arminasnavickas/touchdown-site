import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import LightboxProvider from "@/components/LightboxContext";
import BookingProvider from "@/components/BookingContext";
import { getPricingTiers } from "@/lib/content";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

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
