// CSS approximation of the exported Figma blob: same fill color and
// opacity as the SVG (#65CEE6 @ 60%), organic border-radius shape, heavy
// blur. Simpler than the SVG asset (no separate file, no filter-id
// collisions) - trades away the grain texture for reliability.
//
// Now shown at every breakpoint (was `hidden md:block` - mobile had none
// of the page's three glow moments at all). Each call site supplies its
// own mobile-sized position/size plus md: overrides for the original
// desktop values, since a size/position tuned for a wide grid layout
// doesn't carry over to mobile's narrower, differently-stacked sections.
export default function Blob({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute z-0 rounded-[58%_42%_45%_55%/52%_48%_55%_45%] bg-[#65CEE6]/60 blur-[60px] md:blur-[90px] ${className ?? ""}`}
    />
  );
}

