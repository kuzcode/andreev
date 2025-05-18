/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3c87ff",
        light: "#f2f6f8",
        middle: "#e0e8ed",
        secondary: {
          DEFAULT: "#3c87ff",
          100: "#3c87ff",
          200: "#3c87ff",
        },
        black: {
          DEFAULT: "#000",
          100: "#1E1E2D",
          200: "#232533",
        },
        gray: {
          100: "#CDCDE0",
        },
      },
      fontFamily: {
        pregular: ["Installed-Regular", "sans-serif"],
        psemibold: ["Installed-Semibold", "sans-serif"],
        pbold: ["Installed-Bold", "sans-serif"]
      },
    },
  },
  plugins: [],
};
