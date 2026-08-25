import type { TocEntry } from "@/lib/blog";

// <details>/<summary> gives collapsibility on every breakpoint for free, no
// client component or JS needed - open by default so desktop reads as
// "visible beside the article" out of the box, while mobile can be
// collapsed with a tap instead of eating a large block of vertical space
// above the article body.
export default function TableOfContents({ headings }: { headings: TocEntry[] }) {
  if (headings.length < 2) return null;

  return (
    <details
      open
      className="group mb-12 border-l border-dark-ocean-blue/15 pl-6 [&_summary::-webkit-details-marker]:hidden"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-switzer text-xs font-semibold uppercase tracking-[0.25em] text-cta">
        In this article
        <span
          aria-hidden
          className="text-dark-ocean-blue/30 transition-transform duration-200 group-open:rotate-180"
        >
          ⌄
        </span>
      </summary>
      <nav aria-label="Table of contents" className="mt-4">
        <ul className="flex flex-col gap-2.5">
          {headings.map((h, i) => (
            <li key={h.slug} className={h.level === 3 ? "ml-6" : ""}>
              <a
                href={`#${h.slug}`}
                className="group/toc flex items-baseline gap-3 font-switzer text-base font-light text-dark-ocean-blue/70 transition hover:text-cta"
              >
                <span className="font-switzer text-xs tabular-nums text-dark-ocean-blue/35 transition group-hover/toc:text-cta">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}
