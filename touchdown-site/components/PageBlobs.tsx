// Positions computed from the actual "blob" vector coordinates in the
// Figma source (frame 4:49, 1728x12754), converted to percentages so they
// scale with whatever the page's total height ends up being here.
const blobs = [
  { top: "16.8%", left: "-23.6%", size: 900 },
  { top: "39.5%", left: "70.6%", size: 950 },
  { top: "55.6%", left: "-10.8%", size: 900 },
  { top: "75.7%", left: "83.3%", size: 950 },
  { top: "90.2%", left: "22.8%", size: 900 },
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
