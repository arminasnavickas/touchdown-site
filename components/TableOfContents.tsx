import type { TocEntry } from "@/lib/blog";

export default function TableOfContents({ headings }: { headings: TocEntry[] }) {
  if (headings.length < 2) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="mb-12 border-l-2 border-dark-ocean-blue/10 pl-6"
    >
      <p className="mb-3 font-switzer text-sm font-medium uppercase tracking-widest text-horizon">
        In this article
      </p>
      <ul className="flex flex-col gap-2">
        {headings.map((h) => (
          <li key={h.slug} className={h.level === 3 ? "ml-4" : ""}>
            <a
              href={`#${h.slug}`}
              className="font-switzer text-base font-light text-dark-ocean-blue/70 transition hover:text-cta"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
