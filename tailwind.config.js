/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#0d1117',
          100: '#161b22',
          200: '#21262d',
          300: '#30363d',
          400: '#484f58',
        },
        accent: {
          DEFAULT: '#58a6ff',
          green: '#3fb950',
          purple: '#bc8cff',
          orange: '#f0883e',
          red: '#f85149',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
