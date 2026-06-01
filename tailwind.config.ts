import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0F4C81",
          hover: "#0a3a65",
        },
        teal: {
          DEFAULT: "#14B8A6",
          light: "#F0FDFA",
        },
        amber: {
          DEFAULT: "#F59E0B",
          dark: "#D97706",
          light: "#FFFBEB",
        },
        dark: {
          DEFAULT: "#0B1220",
          medium: "#0F2D4F",
          light: "#0a2540",
        },
        canvas: "#F8FAFC",
        border: "#E2E8F0",
        body: "#475569",
        heading: "#0F172A",
        muted: "#94A3B8",
        highlight: {
          blue: "#EFF6FF",
          purple: "#F5F3FF",
        }
      },
      fontFamily: {
        outfit: ["var(--font-outfit)", "sans-serif"],
        dmsans: ["var(--font-dmsans)", "sans-serif"],
      },
      borderRadius: {
        card: "18px",
        input: "10px",
        btn: "11px",
      },
      boxShadow: {
        premium: "0 24px 48px rgba(15, 76, 129, 0.11)",
        btnNavy: "0 4px 12px rgba(15, 76, 129, 0.3)",
        btnAmber: "0 4px 12px rgba(245, 158, 11, 0.25)",
      },
      keyframes: {
        pulseDot: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: ".5", transform: "scale(1.4)" },
        },
        fadeDown: {
          from: { opacity: "0", transform: "translateY(-12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        }
      },
      animation: {
        pulseDot: "pulseDot 2s infinite ease-in-out",
        fadeDown: "fadeDown 0.6s ease both",
        fadeUp: "fadeUp 0.7s ease both",
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
