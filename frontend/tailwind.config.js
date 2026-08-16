/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        pcte: {
          maroon: {
            DEFAULT: '#9B1C1C',
            50: '#FDF2F2',
            100: '#FDE8E8',
            200: '#FBD5D5',
            300: '#F8B4B4',
            400: '#E02424',
            500: '#C81E1E',
            600: '#9B1C1C',
            700: '#771D1D',
            800: '#551616',
            900: '#3A0E0E',
          },
          navy: {
            DEFAULT: '#1B1464',
            50: '#EEF2FF',
            100: '#E0E7FF',
            200: '#C7D2FE',
            300: '#A5B4FC',
            400: '#818CF8',
            500: '#4338CA',
            600: '#3730A3',
            700: '#262262',
            800: '#1B1464',
            900: '#110D44',
            dark: '#0B0830',
          },
          gold: {
            DEFAULT: '#D97706',
            400: '#F59E0B',
            500: '#D97706',
            600: '#B45309',
          },
        },
        ink: {
          DEFAULT: '#110D44',
          light: '#1B1464',
          soft: '#3B3864',
        },
        paper: {
          DEFAULT: '#FAFAF9',
          dim: '#F3F0EC',
        },
        cliff: {
          50: '#FDF2F2',
          100: '#FDE8E8',
          400: '#F59E0B',
          500: '#9B1C1C',
          600: '#771D1D',
          700: '#551616',
          dark: '#1B1464',
        },
        sand: {
          400: '#F59E0B',
          500: '#9B1C1C',
          600: '#771D1D',
        },
      },
      fontFamily: {
        display: ['"Montserrat"', '"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Montserrat"', '"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['"Montserrat"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 10px 30px -12px rgba(27, 20, 100, 0.12)',
        pop: '0 20px 45px -15px rgba(155, 28, 28, 0.25)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};
