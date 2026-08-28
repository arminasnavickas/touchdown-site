// CSS approximation of the exported Figma blob: same fill color and
// opacity as the SVG (#65CEE6 @ 60%), organic border-radius shape, heavy
// blur. Simpler than the SVG asset (no separate file, no filter-id
// collisions) - trades away the grain texture for reliability.
//
// -z-10, not z-0: several of these now deliberately bleed past their own
// section's edge into the section next to it (see WhoWeAre/OurFacility/
// WhatYouGet/TrainingRhythm/WaterDaySchedule/MeetOurTeam/Faq). Every
// Reveal-wrapped content block on the page carries a permanent CSS
// `transform` (Reveal's translate-y utility, even at rest), which creates
// its own implicit stacking context - so with z-0, painting order in the
// overlap zone came down to DOM order between sections, and a blob whose
// section happened to render later in the page would paint on TOP of the
// real content (a photo, a card) in the section it bled into. A negative
// z-index paints in an earlier stacking-order pass than any of that
// (transformed or not, positioned or not), so a Blob now always sits
// behind page content, guaranteed by the stacking rules rather than by
// which section happens to come first in the DOM.
export default function Blob({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute -z-10 hidden rounded-[58%_42%_45%_55%/52%_48%_55%_45%] bg-[#65CEE6]/60 blur-[90px] md:block ${className ?? ""}`}
    />
  );
}

