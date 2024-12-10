/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          600: '#2563eb', // Customize this color to match your brand
        }
      }
    }
  },
  plugins: [],
}

