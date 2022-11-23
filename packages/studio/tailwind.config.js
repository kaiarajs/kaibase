const windmill = require('@kaiarajs/react-ui/config')
/** @type {import('tailwindcss').Config} */
module.exports = windmill({
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
})