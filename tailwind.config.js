/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Frank Ruhl Libre', 'serif'],
      },
      colors: {
        primary: '#112a55',
        secondary: '#a48327',
        accent: '#8b6f1f',
        background: '#f8f6f1',
      }
    },
  },
  plugins: [],
}