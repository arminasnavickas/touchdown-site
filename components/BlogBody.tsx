import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlForImage } from "@/lib/sanityImage";
import { slugifyHeading } from "@/lib/blog";
import FadeImage from "./FadeImage";

function headingText(children: React.ReactNode): string {
  return Array.isArray(children) ? children.join("") : String(children ?? "");
}

const components: PortableTextComponents = {
  block: {
    // index 0 is always the article's opening paragraph (our content always
    // leads with a plain paragraph before any heading) - styled larger and
    // bolder as a lead-in, same idea as a classic magazine drop-in.
    normal: ({ children, index }) =>
      index === 0 ? (
        <p className="mb-6 font-switzer text-2xl font-light leading-relaxed text-dark-ocean-blue break-words">
          {children}
        </p>
      ) : (
        <p className="mb-6 font-switzer text-lg font-light leading-relaxed text-dark-ocean-blue/90 break-words">
          {children}
        </p>
      ),
    h2: ({ children }) => (
      <h2
        id={slugifyHeading(headingText(children))}
        className="mb-4 mt-12 scroll-mt-28 font-switzer text-3xl font-light tracking-tight text-dark-ocean-blue break-words"
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        id={slugifyHeading(headingText(children))}
        className="mb-3 mt-8 scroll-mt-28 font-switzer text-2xl font-light tracking-tight text-dark-ocean-blue break-words"
      >
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="relative my-10 border-l-4 border-cta py-1 pl-8 pr-2">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-[3px] -top-5 select-none font-switzer text-7xl leading-none text-cta/25"
        >
          &ldquo;
        </span>
        <p className="relative font-switzer text-2xl font-light italic leading-snug text-dark-ocean-blue break-words">
          {children}
        </p>
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 list-disc space-y-2 pl-6 font-switzer text-lg font-light text-dark-ocean-blue/90">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-6 list-decimal space-y-2 pl-6 font-switzer text-lg font-light text-dark-ocean-blue/90">
        {children}
      </ol>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-horizon underline transition hover:text-cta"
      >
        {children}
      </a>
    ),
    strong: ({ children }) => <strong className="font-medium text-dark-ocean-blue">{children}</strong>,
  },
  types: {
    image: ({ value }) => {
      const src = urlForImage(value);
      if (!src) return null;
      return (
        <FadeImage
          src={src}
          alt={value?.alt || ""}
          wrapperClassName="my-8 h-[320px] w-full rounded-lg md:h-[440px]"
          className="h-full w-full object-cover"
        />
      );
    },
  },
};

export default function BlogBody({ body }: { body: unknown }) {
  // Fallback posts store body as a plain string; real Sanity posts store it
  // as an array of portable-text blocks.
  if (typeof body === "string") {
    return (
      <p className="mb-6 font-switzer text-2xl font-light leading-relaxed text-dark-ocean-blue break-words">
        {body}
      </p>
    );
  }
  if (Array.isArray(body) && body.length > 0) {
    return <PortableText value={body as never} components={components} />;
  }
  return null;
}
