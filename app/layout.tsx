import type { Metadata } from "next";
import "./globals.css";

// Preview deployments are password-gated by middleware.ts. Vercel's edge
// CDN caches statically-rendered pages independent of middleware's
// Cache-Control headers, which let a single cached (authenticated) 200
// response get served to unauthenticated visitors too. Forcing every route
// to render dynamically on preview deployments means there is never a
// static asset for the CDN to cache in the first place, so every request
// re-runs the middleware auth check. Production is untouched (stays
// statically optimized) since VERCEL_ENV is only "preview" on previews.
export const dynamic =
  process.env.VERCEL_ENV === "preview" ? "force-dynamic" : "auto";

export const viewport = {
  themeColor: "#003354",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://touchdownfreediving.com"),
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
    url: "https://touchdownfreediving.com",
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

// Bare root layout: only <html>/<body>, global CSS, and metadata.
// Site chrome (nav/footer) lives in app/(site)/layout.tsx so that
// /studio (outside that route group) renders with no chrome at all.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      <body className="font-switzer antialiased">{children}</body>
    </html>
  );
}
