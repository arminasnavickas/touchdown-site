// Positions computed from the original Figma canvas coordinates,
// converted to percentages of total page height. That page height has
// drifted since (sections got resized/tightened over many edits), so these
// percentages are an approximation of where each blob lands today - not
// exact. Two of the original 5 are left out on purpose:
//   - the one that sat around What You Get (~39.5%)
//   - the one that sat around Reviews/FAQ (~90.2%)
// both were reported as an unwanted glow over those specific sections.
// The other three are kept for the rest of the page's ambient lighting.
// If one of these still lands somewhere unwanted, nudge/remove that entry
// rather than disabling the whole layer again.
const blobs = [
  { top: "16.8%", left: "-23.6%", size: 900 },
  { top: "55.6%", left: "-10.8%", size: 900 },
  { top: "75.7%", left: "83.3%", size: 950 },
];

export default function PageBlobs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {blobs.map((b, i) => (
        <div
          key={i}
          className="absolute rounded-[58%_42%_45%_55%/52%_48%_55%_45%] bg-[#65CEE6] opacity-70 mix-blend-screen blur-[60px]"
          style={{
            top: b.top,
            left: b.left,
            width: b.size,
            height: b.size,
          }}
        />
      ))}
    </div>
  );
}
