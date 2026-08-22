// Positions computed from the original Figma canvas coordinates,
// converted to percentages of total page height. That page height has
// drifted since (sections got resized/tightened over many edits), so these
// percentages are an approximation of where each blob lands today - not
// exact, and each one has needed re-tuning as sections were resized:
//   - the one that sat around What You Get (~39.5%) was removed
//   - the one that sat around Reviews/FAQ (~90.2%) was removed
//   - the middle one (was 55.6%) was still landing on What You Get, so
//     it's nudged down to 63% to land on Training Rhythm instead
// If one of these still lands somewhere unwanted, nudge/remove that entry
// rather than disabling the whole layer again.
const blobs = [
  { top: "16.8%", left: "-23.6%", size: 900 },
  { top: "63%", left: "-10.8%", size: 900 },
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
