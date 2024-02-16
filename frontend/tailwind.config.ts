import type { Config } from "tailwindcss";
// import { COLORS } from "@/constants/color.constants"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // colors: COLORS,
      transitionDuration: {
        default: '266ms'
      },
      fontFamily: {
        // Шрифты
      },
    },
  },
  plugins: [],
};
export default config;
