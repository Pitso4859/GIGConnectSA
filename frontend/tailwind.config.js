/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fef3ee',
          100: '#fde4d4',
          200: '#fbc5a8',
          300: '#f89c73',
          400: '#f4663c',
          500: '#f14519',  /* primary orange */
          600: '#e22b0e',
          700: '#bb1f0f',
          800: '#951c14',
          900: '#791b13',
        },
        slate: {
          950: '#0b1120',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: { xl: '1rem', '2xl': '1.5rem' },
      boxShadow: {
        card: '0 2px 12px 0 rgba(0,0,0,0.08)',
        'card-hover': '0 8px 30px 0 rgba(0,0,0,0.14)',
      },
    },
  },
  plugins: [],
};
