import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        neon: {
          blue: "#00f0ff",
          purple: "#b300ff",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
