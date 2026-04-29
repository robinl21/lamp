/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sketch-bg': '#050505',
        'sketch-line': '#FFFFFF',
        'sketch-gray': '#1A1A1A',
        'sketch-accent': '#00FF00', // A subtle technical green for status
      }
    },
  },
  plugins: [],
}