import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // TecnoExpress Brand Colors (from logo)
        tecno: {
          bg: '#02010A',           // Deep navy background
          bgDark: '#1F1C78',       // Dark electric blue
          primary: '#2434FF',      // Bright royal blue
          cyan: '#2EC5FF',         // Cyan outline
          mint: '#BCEFE4',         // Mint-light logo text
          lightBlue: '#9FB4FF',    // Soft light blue text
          bolt: '#FFD53D',         // Bolt yellow (updated for punch)
        },
        // Semantic colors
        text: {
          main: '#F5F7FF',         // Main text
          muted: '#9FA8FF',        // Secondary text
        },
        border: {
          subtle: '#262B4F',       // Subtle borders
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(90deg, #2434FF, #2EC5FF)',
        'gradient-hero': 'linear-gradient(135deg, #02010A 0%, #2434FF 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(31, 28, 120, 0.5) 0%, rgba(36, 52, 255, 0.3) 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(46, 197, 255, 0.3)',
        'glow-lg': '0 0 30px rgba(46, 197, 255, 0.4)',
        'bolt': '0 0.35rem 1rem rgba(255, 213, 61, 0.45)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(46, 197, 255, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(46, 197, 255, 0.6)',
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
