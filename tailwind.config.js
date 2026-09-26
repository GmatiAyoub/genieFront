/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        indigo: {
          deep: "#3730A3",
          blue: "#1E3A8A",
        },
        charcoal: "#262626",
        gold: "#B8935A",
        cream: "#FAF8F5",
        stone: {
          light: "#E6E2D9",
          muted: "#6B6B6B",
          faint: "#A3A3A3",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};