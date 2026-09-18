import Link from "next/link";
import FadeImage from "@/components/FadeImage";
import { getSiteContent } from "@/lib/content";

// This is a duplicate of app/(site)/not-found.tsx. Next.js always renders a
// root-level not-found.tsx through the bare root layout (no matter what's
// inside a nested route group), so it can't reuse the (site) group's
// Navigation/Footer chrome - this covers genuinely unmatched top-level URLs
// that fall outside every defined route, while the (site) version handles
// notFound() triggered from within any real page.
//
// Without this, Next.js prerenders the special /_not-found route as fully
// static at build time (revalidate: false by default) since this file has
// no route segment config of its own - so a fetch here only ever runs once,
// at build. Matching the revalidate window used on every real page (see
// app/(site)/page.tsx) keeps this in sync with Sanity without a redeploy.
export const revalidate = 60;

export default async function NotFound() {
  const siteContent = await getSiteContent();
  return (
    <main className="relative flex min-h-[500px] w-full overflow-hidden bg-dark-ocean-blue md:min-h-[700px]">
      <div className="absolute inset-0">
        {/* style below (the actual Sanity hotspot crop) is what controls
            framing now - the .not-found-image CSS class in globals.css
            used to hardcode a fixed 55%/50% (20%/50% on desktop) position
            that completely ignored whatever focal point was set with the
            crop tool in Studio, which is why the bottom kept getting cut
            off regardless of what was picked there. Inline style always
            wins over that class's selector, so this actually respects it
            now. Kept in sync with app/(site)/not-found.tsx. */}
        <FadeImage
          src={siteContent.notFoundImage}
          alt="Touchdown freediver"
          eager
          wrapperClassName="h-full w-full"
          className="!opacity-100 h-full w-full object-cover"
          style={{ objectPosition: siteContent.notFoundImagePosition }}
        />
        {/* Was fading all the way to the right edge (100%) - now reaches
            fully transparent by the middle of the image (50%) instead, so
            the dark overlay sits over the text half only and the right
            half of the photo shows through clean, with no scrim over it
            at all. Kept in sync with app/(site)/not-found.tsx (see the
            comment at the top of this file for why there are two). */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(100deg, rgba(4,12,20,0.96) 0%, rgba(4,12,20,0.82) 18%, rgba(4,12,20,0.4) 38%, rgba(4,12,20,0) 50%)",
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-[500px] w-full items-center justify-start px-6 py-12 md:min-h-[700px] md:px-16">
        <div className="max-w-xl text-left">
          <p className="font-switzer text-base uppercase tracking-widest text-white">
            404
          </p>
          <h1 className="mt-2 font-switzer text-4xl font-light tracking-tight text-white md:text-6xl">
            <span className="block">Looks like you&apos;ve</span>
            <span className="block">gone off the line.</span>
          </h1>
          <p className="mt-4 max-w-md font-switzer text-lg font-light text-white/80 md:max-w-none">
            <span className="block">We couldn&apos;t find the page you were looking for.</span>
            <span className="block">It may have moved, or the link might be out of date.</span>
          </p>

          <div className="mt-10 flex justify-start">
            <Link
              href="/"
              className="rounded-[6px] bg-cta px-8 py-4 font-switzer text-base font-medium uppercase tracking-wide text-white transition hover:bg-aquatic hover:text-dark-ocean-blue"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
