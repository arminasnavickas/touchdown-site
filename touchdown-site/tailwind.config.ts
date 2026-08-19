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
      },
      fontFamily: {
        switzer: ["Switzer", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
