// Positions computed from the original Figma canvas coordinates,
// converted to percentages of total page height. That page height has
// drifted since (sections got resized/tightened over many edits), so these
// percentages are an approximation of where each blob lands today - not
// exact, and each one has needed re-tuning as sections were resized:
//   - the one that sat around What You Get (~39.5%, then drifted to
//     ~16.8-22.2%) was removed - confirmed via live DOM measurement that
//     it overlapped the What You Get section (15.4-20.3% of page height)
//   - the one that sat around Reviews/FAQ (~90.2%) was removed
//   - the middle one (was 55.6%) was still landing on What You Get, so
//     it's nudged down to 63% to land on Training Rhythm instead
// If one of these still lands somewhere unwanted, nudge/remove that entry
// rather than disabling the whole layer again.
const blobs = [
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
