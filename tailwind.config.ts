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
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#1A237E",
        "primary-light": "#3949AB",
        surface: "#0A0A0B",
        "surface-container": "#141417",
        "on-surface": "#F4F4F5",
        "on-surface-variant": "#A1A1AA",
        outline: "#27272A",
        ayres: {
          primary: "#3b82f6", // Blue
          secondary: "#10b981", // Emerald
          dark: "#0f172a", // Slate 900
        }
      },
      fontFamily: {
        headline: ["var(--font-montserrat)", "sans-serif"],
        body: ["var(--font-poppins)", "sans-serif"],
        label: ["var(--font-poppins)", "sans-serif"]
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'tilt': 'tilt 10s infinite linear',
      },
      keyframes: {
        tilt: {
          '0%, 50%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(1deg)' },
          '75%': { transform: 'rotate(-1deg)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
