/** @type {import('tailwindcss').Config} */

export default {
  content: ["./entrypoints/reader/App.vue"],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

