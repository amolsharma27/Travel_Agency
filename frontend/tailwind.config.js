/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#101B26',
          light: '#1B2A3A',
          soft: '#334455',
        },
        paper: {
          DEFAULT: '#FDF7F0',
          dim: '#F9EFE5',
        },
        cliff: {
          50: '#FDF7F0',
          100: '#F9EFE5',
          400: '#f59e0b',
          500: '#e0882e',
          600: '#c6721d',
          700: '#a35914',
          dark: '#1c385e',
        },
        sand: {
          400: '#F0BC6E',
          500: '#e0882e',
          600: '#C7852A',
        },
      },
      fontFamily: {
        display: ['"Montserrat"', '"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Montserrat"', '"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['"Montserrat"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 10px 30px -12px rgba(16, 27, 38, 0.12)',
        pop: '0 20px 45px -15px rgba(224, 136, 46, 0.25)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};
