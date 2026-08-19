// CSS approximation of the exported Figma blob: same fill color and
// opacity as the SVG (#65CEE6 @ 60%), organic border-radius shape, heavy
// blur. Simpler than the SVG asset (no separate file, no filter-id
// collisions) - trades away the grain texture for reliability.
export default function Blob({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute z-0 hidden rounded-[58%_42%_45%_55%/52%_48%_55%_45%] bg-[#65CEE6]/60 blur-[90px] md:block ${className ?? ""}`}
    />
  );
}

