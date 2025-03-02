import type { Config } from "tailwindcss";
import { type ScreensConfig } from "tailwindcss/types/config";

//https://tailwindcss.com/docs/screens
const TAILWIND_SCREENS_DEFAULT: ScreensConfig = {
  "sm": "640px",
  "md": "768px",
  "lg": "1024px",
  "xl": "1280px",
  "2xl": "1536px",
};

const SCREENS: ScreensConfig = {
  "sm": "560px",
  "md": "768px",
  "lg": "1024px",
  "xl": "1280px",
  "2xl": "1536px",
};

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: SCREENS,
      container: {
        screens: SCREENS,
        center: true,
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      aspectRatio: {
        "21/9": "21 / 9",
      },
    },
  },
  plugins: [],
} satisfies Config;
