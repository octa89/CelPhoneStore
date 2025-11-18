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
        // Honor Global Official Design System
        honor: {
          // Backgrounds
          bg: '#FFFFFF',
          'bg-light': '#F5F5F7',
          'bg-dark': '#F8F8F8',

          // Text colors
          'text-primary': '#1A1A1A',
          'text-secondary': '#6A6A6A',
          'text-muted': '#999999',

          // Brand colors
          primary: '#1A1F71',      // Deep blue
          accent: '#E10071',       // Magenta accent

          // Borders & dividers
          border: '#E5E5E5',
          divider: '#EBEBEB',
        },
        // Maintain backward compatibility
        tecno: {
          bg: '#FFFFFF',
          bgDark: '#F5F5F7',
          primary: '#1A1F71',
          cyan: '#1A1F71',
          mint: '#6A6A6A',
          lightBlue: '#999999',
          bolt: '#E10071',
        },
        text: {
          main: '#1A1A1A',
          muted: '#6A6A6A',
        },
        border: {
          subtle: '#E5E5E5',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #1A1F71 0%, #2A3F91 100%)',
        'gradient-hero': 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F7 100%)',
        'gradient-card': 'linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 100%)',
        'gradient-accent': 'linear-gradient(135deg, #E10071 0%, #F91091 100%)',
      },
      boxShadow: {
        'honor': '0 2px 12px rgba(0, 0, 0, 0.06)',
        'honor-lg': '0 8px 24px rgba(0, 0, 0, 0.08)',
        'honor-xl': '0 12px 32px rgba(0, 0, 0, 0.12)',
        'honor-lift': '0 16px 48px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        'honor': '12px',
        'honor-lg': '16px',
        'honor-xl': '24px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '120': '30rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'zoom': 'zoom 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        zoom: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
