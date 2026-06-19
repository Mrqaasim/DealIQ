import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#10201a",
        canvas: "#f4f6f2",
        panel: "#fbfcfa",
        line: "#dce3dc",
        pine: "#174f3b",
        mint: "#c7ead9",
        signal: "#c8ff43",
      },
      boxShadow: {
        card: "0 18px 50px rgba(22, 47, 36, 0.07)",
      },
    },
  },
  plugins: [],
};

export default config;

