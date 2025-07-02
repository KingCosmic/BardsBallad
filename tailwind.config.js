/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      height: {
        'screen-dynamic': 'calc(var(--vh, 1vh) * 100)',
      },
      colors: {
        background: 'var(--background)',

        brand: {
          50: 'var(--brand-50)',
          100: 'var(--brand-100)',
          200: 'var(--brand-200)',
          300: 'var(--brand-300)',
          400: 'var(--brand-400)',
          500: 'var(--brand-500)',
          600: 'var(--brand-600)',
          700: 'var(--brand-700)',
          800: 'var(--brand-800)',
          900: 'var(--brand-900)',
          950: 'var(--brand-950)',
        },

        neutral: {
          50: 'var(--neutral-50)',
          100: 'var(--neutral-100)',
          200: 'var(--neutral-200)',
          300: 'var(--neutral-300)',
          400: 'var(--neutral-400)',
          500: 'var(--neutral-500)',
          600: 'var(--neutral-600)',
          700: 'var(--neutral-700)',
          800: 'var(--neutral-800)',
          900: 'var(--neutral-900)',
          950: 'var(--neutral-950)',
        },

        orange: {
          50: 'var(--orange-50)',
          100: 'var(--orange-100)',
          200: 'var(--orange-200)',
          300: 'var(--orange-300)',
          400: 'var(--orange-400)',
          500: 'var(--orange-500)',
          600: 'var(--orange-600)',
          700: 'var(--orange-700)',
          800: 'var(--orange-800)',
          900: 'var(--orange-900)',
          950: 'var(--orange-950)',
        },

        red: {
          50: 'var(--red-50)',
          100: 'var(--red-100)',
          200: 'var(--red-200)',
          300: 'var(--red-300)',
          400: 'var(--red-400)',
          500: 'var(--red-500)',
          600: 'var(--red-600)',
          700: 'var(--red-700)',
          800: 'var(--red-800)',
          900: 'var(--red-900)',
          950: 'var(--red-950)',
        },

        blue: {
          50: 'var(--blue-50)',
          100: 'var(--blue-100)',
          200: 'var(--blue-200)',
          300: 'var(--blue-300)',
          400: 'var(--blue-400)',
          500: 'var(--blue-500)',
          600: 'var(--blue-600)',
          700: 'var(--blue-700)',
          800: 'var(--blue-800)',
          900: 'var(--blue-900)',
          950: 'var(--blue-950)',
        },

        green: {
          50: 'var(--green-50)',
          100: 'var(--green-100)',
          200: 'var(--green-200)',
          300: 'var(--green-300)',
          400: 'var(--green-400)',
          500: 'var(--green-500)',
          600: 'var(--green-600)',
          700: 'var(--green-700)',
          800: 'var(--green-800)',
          900: 'var(--green-900)',
          950: 'var(--green-950)',
        },

        fantasy: {
          dark: '#1a2332',
          medium: '#2d3b52',
          light: '#1e2a3a',
          accent: '#ffa500',
          'accent-dark': '#ff8c00',
          'accent-light': '#ffd700',
          text: '#e8eaed',
          'text-muted': '#9ca3af',
          border: 'rgba(255, 165, 0, 0.2)',
          glass: 'rgba(15, 23, 35, 0.9)',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        float: 'float 8s infinite linear',
        glow: 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%': {
            transform: 'translateY(100vh) translateX(0px)',
            opacity: '0',
          },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': {
            transform: 'translateY(-10px) translateX(100px)',
            opacity: '0',
          },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(255, 165, 0, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 165, 0, 0.8)' },
        },
      },
    },
  },
  plugins: [],
};
