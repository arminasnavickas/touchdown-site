// Shared "eyebrow" label style used above section headings site-wide (About
// us, Gallery, FAQ, and now Hero) - was a copy-pasted className string in
// each of those components, which is how Hero's version had already drifted
// to a different size/weight before this. One component now, one place to
// change the look everywhere it's used.
export default function SectionKicker({
  children,
  tone = "cta",
  className = "",
}: {
  children: React.ReactNode;
  // "cta" is the default cyan accent used over light/white section
  // backgrounds. "white" is for use over a photo/video background (Hero),
  // where the cyan doesn't have enough weight against the underwater image.
  tone?: "cta" | "white";
  className?: string;
}) {
  return (
    <p
      className={`font-switzer text-xs font-semibold uppercase tracking-[0.25em] md:text-sm ${
        tone === "white" ? "text-white" : "text-cta"
      } ${className}`}
    >
      {children}
    </p>
  );
}
