/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'palja-red': {
          deep: '#8B0000',
          mid: '#B22222',
          bright: '#C41E3A',
          glow: '#FF2D55',
        },
        'palja-gold': {
          DEFAULT: '#FFD700',
          light: '#FFEC8B',
          dark: '#DAA520',
        },
      },
      fontFamily: {
        'serif-kr': ['Noto Serif KR', 'serif'],
        'cinzel': ['Cinzel', 'serif'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%': { filter: 'brightness(1)', textShadow: '0 0 20px #FFD700' },
          '100%': { filter: 'brightness(1.1)', textShadow: '0 0 40px #FFD700' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
