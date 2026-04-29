/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bs-cream': '#FBFBF9',
        'bs-green': '#2D4739',
      }
    },
  },
  plugins: [],
}