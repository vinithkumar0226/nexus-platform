import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // NEXUS Design System
        nexus: {
          bg: "#0a0f1e",
          panel: "#0f1629",
          card: "#141c35",
          "card-hover": "#1a2440",
          border: "rgba(255,255,255,0.08)",
          "border-strong": "rgba(255,255,255,0.15)",
          cyan: "#00d4ff",
          "cyan-dim": "#00a8cc",
          blue: "#4f8ef7",
          "blue-dim": "#3a6ed4",
          green: "#00e676",
          "green-dim": "#00b85e",
          amber: "#ffb300",
          "amber-dim": "#e09a00",
          red: "#ff3d5a",
          "red-dim": "#cc2943",
          purple: "#8b5cf6",
          text: "#e8edf5",
          "text-secondary": "#8492a8",
          "text-muted": "#556070",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      fontSize: {
        "2xs": "0.625rem",
        xs: "0.75rem",
        sm: "0.8125rem",
        base: "0.875rem",
        lg: "1rem",
        xl: "1.125rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
        "4xl": "1.875rem",
        "5xl": "2.25rem",
      },
      spacing: {
        "sidebar": "240px",
        "topbar": "56px",
      },
      backgroundImage: {
        "nexus-gradient": "linear-gradient(135deg, #0a0f1e 0%, #0f1629 100%)",
        "cyan-gradient": "linear-gradient(135deg, #00d4ff 0%, #4f8ef7 100%)",
        "panel-gradient": "linear-gradient(180deg, #141c35 0%, #0f1629 100%)",
        "danger-gradient": "linear-gradient(135deg, #ff3d5a 0%, #cc2943 100%)",
        "success-gradient": "linear-gradient(135deg, #00e676 0%, #00b85e 100%)",
      },
      boxShadow: {
        "nexus-sm": "0 1px 3px rgba(0,0,0,0.4)",
        "nexus": "0 4px 16px rgba(0,0,0,0.4)",
        "nexus-lg": "0 8px 32px rgba(0,0,0,0.5)",
        "nexus-xl": "0 16px 48px rgba(0,0,0,0.6)",
        "cyan-glow": "0 0 20px rgba(0,212,255,0.2)",
        "green-glow": "0 0 16px rgba(0,230,118,0.2)",
        "red-glow": "0 0 16px rgba(255,61,90,0.2)",
        "amber-glow": "0 0 16px rgba(255,179,0,0.2)",
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-in": "slideIn 0.3s ease-out",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(-10px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(0,212,255,0.2)" },
          "100%": { boxShadow: "0 0 20px rgba(0,212,255,0.4)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
