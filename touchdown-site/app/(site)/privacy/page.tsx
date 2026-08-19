import type { Metadata } from "next";
import { getPrivacyPolicy } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Touchdown Freediving School collects, uses, and protects your personal information.",
};

export default async function PrivacyPage() {
  const { lastUpdated, sections } = await getPrivacyPolicy();
  return (
    <main className="bg-[#F4F8FA]">
      <div className="mx-auto max-w-3xl px-6 pb-20 pt-28 md:px-16 md:pb-28 md:pt-36">
        <p className="font-switzer text-base uppercase tracking-widest text-danish-blue">Legal</p>
        <h1 className="mt-2 font-switzer text-4xl font-light tracking-tight text-dark-ocean-blue md:text-6xl">
          Privacy Policy
        </h1>
        <p className="mt-4 font-switzer text-lg font-light text-dark-ocean-blue/70">
          Last updated: {lastUpdated || "[date]"}
        </p>

        <div className="mt-12 flex flex-col">
          {sections.map((section) => (
            <section key={section.heading} className="mb-10">
              <h2 className="mb-3 font-switzer text-2xl font-light tracking-tight text-dark-ocean-blue">
                {section.heading}
              </h2>
              {section.body.map((paragraph, i) => (
                <p
                  key={i}
                  className="mb-4 font-switzer text-lg font-light leading-relaxed text-dark-ocean-blue/90"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
