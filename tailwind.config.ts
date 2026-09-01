import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-ocean-blue": "#023048", // primary — headlines, primary buttons, deep-water bg
        horizon: "#127BB5", // secondary — links, active states, mid-depth accents
        aquatic: "#65CEE6", // accent — highlights, hover states (use sparingly on dark)
        navy: "#052962", // support — dark UI surfaces, footers, night-dive contexts
        "danish-blue": "#8AACAF", // neutral — muted text, borders, disabled states
        cta: "#00BFFF", // measured from reference design — actual "Book in" button color
        // Canonical page background — the single source of truth for "page
        // navy". Previously typed separately by eye in three places: body's
        // own background in globals.css (#003354, this value), Footer.tsx's
        // inline style (#003252, off by 1-2 hex units), and HowItWorks.tsx's
        // numbered-rail swatch (#003354 again, but as its own untraceable
        // literal). All three now reference this token instead.
        "body-navy": "#003354",
        // Star-rating fill/stroke in Reviews.tsx — the one intentionally
        // off-palette color on the site (amber reads as "rating" the way
        // cyan/navy don't), named here so it's a traceable design decision
        // rather than a stray hex typed inline.
        "rating-star": "#FBBF24",
      },
      fontFamily: {
        switzer: ["Switzer", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
