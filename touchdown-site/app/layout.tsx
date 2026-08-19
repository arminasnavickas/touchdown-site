import type { Metadata } from "next";
import "./globals.css";
import LightboxProvider from "@/components/LightboxContext";
import BookingProvider from "@/components/BookingContext";
import { getPricingTiers } from "@/lib/content";

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
      </head>
      <body className="font-switzer antialiased">
        <BookingProvider tiers={pricingTiers}>
          <LightboxProvider>{children}</LightboxProvider>
        </BookingProvider>
      </body>
    </html>
  );
}
