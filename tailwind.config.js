/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f3f0f9',
          100: '#e7e1f3',
          200: '#d0c3e6',
          300: '#b8a5d9',
          400: '#a187cc',
          500: '#8968bf',
          600: '#7654b3',
          700: '#6346a7',
          800: '#5D3891', // primary
          900: '#482e70',
        },
        secondary: {
          50: '#fdfbea',
          100: '#fcf8d5',
          200: '#f9f0ab',
          300: '#F0EB8D', // accent gold
          400: '#e9da56',
          500: '#d8c632',
          600: '#b8a723',
          700: '#95871d',
          800: '#766b1e',
          900: '#62591f',
        },
        success: {
          500: '#22c55e',
        },
        warning: {
          500: '#f97316',
        },
        error: {
          500: '#ef4444',
        }
      },
      fontFamily: {
        'heading': ['Montserrat', 'sans-serif'],
        'body': ['Poppins', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      }
    },
  },
  plugins: [],
}