import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        park: {
          cream: "#FAF6F0",
          paper: "#F5EFE6",
          green: {
            DEFAULT: "#2D5016",
            light: "#4A7C28",
            dark: "#1B3009",
          },
          sepia: "#8B7355",
          brown: "#6B5B47",
          gold: "#C4A265",
          rust: "#A0522D",
          red: "#8B2500",
        },
      },
      fontFamily: {
        serif: ['"Crimson Pro"', "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "paper-texture":
          "url(\"data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

export default config;
