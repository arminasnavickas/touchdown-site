// Gives each blog category its own accent within the existing brand
// palette, so the grid is scannable at a glance once there are more posts.
// Falls back to the aquatic/dark-ocean-blue pairing used everywhere else on
// the site for any category not listed here.
export const categoryColors: Record<string, { bg: string; text: string }> = {
  Training: { bg: "bg-cta", text: "text-white" },
  Safety: { bg: "bg-horizon", text: "text-white" },
  Equipment: { bg: "bg-danish-blue", text: "text-dark-ocean-blue" },
  Travel: { bg: "bg-aquatic", text: "text-dark-ocean-blue" },
  "Community Stories": { bg: "bg-dark-ocean-blue", text: "text-white" },
  News: { bg: "bg-navy", text: "text-white" },
};

export function getCategoryColor(category: string | null) {
  if (category && categoryColors[category]) return categoryColors[category];
  return { bg: "bg-aquatic", text: "text-dark-ocean-blue" };
}
