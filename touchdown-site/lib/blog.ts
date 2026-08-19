// Small, dependency-free helpers for the blog reading experience. Kept
// separate from lib/content.ts (which only fetches/shapes data) since these
// derive presentation details (reading time, table of contents) from a
// post's body rather than fetching anything.

export type TocEntry = { text: string; slug: string; level: 2 | 3 };

type PortableBlock = {
  _type?: string;
  style?: string;
  children?: { text?: string }[];
};

function blockText(block: PortableBlock): string {
  return (block.children ?? []).map((c) => c.text ?? "").join("");
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

const WORDS_PER_MINUTE = 200;

/** Estimated reading time in minutes, rounded up to the nearest minute (min 1). */
export function estimateReadingTime(body: unknown): number {
  let wordCount = 0;

  if (typeof body === "string") {
    wordCount = body.split(/\s+/).filter(Boolean).length;
  } else if (Array.isArray(body)) {
    for (const block of body as PortableBlock[]) {
      if (block?._type === "block") {
        wordCount += blockText(block).split(/\s+/).filter(Boolean).length;
      }
    }
  }

  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}

/** Pulls h2/h3 headings out of a portable-text body for a table of contents. */
export function extractHeadings(body: unknown): TocEntry[] {
  if (!Array.isArray(body)) return [];

  const headings: TocEntry[] = [];
  for (const block of body as PortableBlock[]) {
    if (block?._type === "block" && (block.style === "h2" || block.style === "h3")) {
      const text = blockText(block);
      if (!text) continue;
      headings.push({
        text,
        slug: slugifyHeading(text),
        level: block.style === "h2" ? 2 : 3,
      });
    }
  }
  return headings;
}
