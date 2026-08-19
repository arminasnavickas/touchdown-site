import Link from "next/link";
import FadeImage from "@/components/FadeImage";
import { getSiteContent } from "@/lib/content";

export default async function NotFound() {
  const siteContent = await getSiteContent();
  return (
    <main className="relative flex h-[500px] w-full items-start justify-center overflow-hidden bg-dark-ocean-blue md:h-[700px]">
      <div className="absolute inset-0">
        <FadeImage
          src={siteContent.notFoundImage}
          alt="Touchdown freediver"
          eager
          wrapperClassName="h-full w-full"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="relative z-10 flex -translate-y-5 flex-col items-center px-6 pb-12 pt-12 text-center md:px-16 md:pt-16">
        <p className="font-switzer text-base uppercase tracking-widest text-dark-ocean-blue">
          404
        </p>
        <h1 className="mt-2 font-switzer text-4xl font-light tracking-tight text-dark-ocean-blue md:text-6xl">
          {siteContent.notFoundHeadline}
        </h1>
        <p className="mt-4 max-w-md font-switzer text-lg font-light text-dark-ocean-blue/80 md:max-w-none md:whitespace-nowrap">
          {siteContent.notFoundSubtext}
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="rounded-[6px] bg-cta px-8 py-4 font-switzer text-base font-medium uppercase tracking-wide text-white transition hover:bg-aquatic hover:text-dark-ocean-blue"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
