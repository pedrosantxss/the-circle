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
        // Design system colors
        void: "#000000",
        obsidian: "#0A0A0A",
        onyx: "#111111",
        graphite: "#1A1A1A",
        steel: "#2A2A2A",
        ash: "#3A3A3A",
        // Text
        ivory: "#FAFAFA",
        silver: "#C8C8C8",
        mist: "#888888",
        ghost: "#444444",
        // Accent
        chrome: "#D4D4D4",
        platinum: "#E8E8E8",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "Courier New", "monospace"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-2xl": ["clamp(4rem, 10vw, 9rem)", { lineHeight: "0.9", letterSpacing: "-0.04em" }],
        "display-xl": ["clamp(3rem, 7vw, 7rem)", { lineHeight: "0.92", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2.5rem, 5vw, 5rem)", { lineHeight: "0.95", letterSpacing: "-0.025em" }],
        "display-md": ["clamp(2rem, 4vw, 3.5rem)", { lineHeight: "1", letterSpacing: "-0.02em" }],
        "body-lg": ["1.125rem", { lineHeight: "1.75", letterSpacing: "0" }],
        "body-sm": ["0.875rem", { lineHeight: "1.6", letterSpacing: "0.01em" }],
        "label": ["0.75rem", { lineHeight: "1", letterSpacing: "0.12em" }],
      },
      spacing: {
        section: "10rem",
        "section-sm": "6rem",
      },
      maxWidth: {
        container: "1440px",
        content: "1200px",
        prose: "720px",
      },
      animation: {
        "fade-up": "fadeUp 0.8s ease forwards",
        "fade-in": "fadeIn 1s ease forwards",
        "pulse-slow": "pulse 4s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
        "grain": "grain 8s steps(1) infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-2%, -3%)" },
          "20%": { transform: "translate(3%, 2%)" },
          "30%": { transform: "translate(-1%, 4%)" },
          "40%": { transform: "translate(4%, -1%)" },
          "50%": { transform: "translate(-3%, 1%)" },
          "60%": { transform: "translate(2%, -4%)" },
          "70%": { transform: "translate(-4%, 3%)" },
          "80%": { transform: "translate(1%, -2%)" },
          "90%": { transform: "translate(-2%, 4%)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      transitionTimingFunction: {
        "luxury": "cubic-bezier(0.16, 1, 0.3, 1)",
        "cinematic": "cubic-bezier(0.76, 0, 0.24, 1)",
        "elastic": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
