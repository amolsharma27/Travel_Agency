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
          DEFAULT: '#FAF7F1',
          dim: '#F1ECE1',
        },
        lagoon: {
          50: '#EAF6F2',
          100: '#CFEBE2',
          300: '#66BFA8',
          500: '#1F8A70',
          600: '#187360',
          700: '#125747',
        },
        sand: {
          400: '#F0BC6E',
          500: '#E8A33D',
          600: '#C7852A',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 10px 30px -12px rgba(16, 27, 38, 0.18)',
        pop: '0 20px 45px -15px rgba(16, 27, 38, 0.35)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};
