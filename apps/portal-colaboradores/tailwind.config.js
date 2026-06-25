/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        wine: { DEFAULT: "#701F20", deep: "#5A1819", soft: "#8E3A3B", tint: "#F3E9E5" },
        ink: { DEFAULT: "#262323", soft: "#4A4644" },
        navy: { DEFAULT: "#2D2F92", soft: "#4A4CB0" },
        cream: "#FAF9F5",
        stone: "#959595",
        line: "#E7E2DA",
        ok: "#2E7D52",
        warn: "#9A6A00",
        info: "#2D2F92",
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
        body: ['"Jost"', "system-ui", "sans-serif"],
      },
      borderRadius: { DEFAULT: "2px" },
    },
  },
  plugins: [],
};
