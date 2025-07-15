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
