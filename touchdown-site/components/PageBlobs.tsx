// This used to render 5 large ambient glow blobs positioned by percentage
// down the entire page (from the original Figma canvas coordinates). They
// kept landing on top of section content as things got resized/tightened
// over the course of edits - first reported behind the FAQ heading, then
// again over the What You Get section - and each fix required guessing at
// percentages against a page height that had already drifted from the
// original Figma export. Rather than keep whack-a-moling individual blobs,
// this global layer is disabled entirely; each section that wants its own
// glow already has its own local <Blob> component for that.
export default function PageBlobs() {
  return null;
}
