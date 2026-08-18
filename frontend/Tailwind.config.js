/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // enables dark: variants, toggled via a 'dark' class on <html>
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // EliteCollege brand palette — updated to blue & cream theme
        ink: "#1A1F6E",        // deep navy blue — primary, headers, nav
        "ink-light": "#2E3A8C",
        gold: "#4A9EFF",       // sky blue — accent, active states, CTAs
        "gold-dark": "#2D7DD2",
        parchment: "#FAF6EE",  // warm cream (background)
        leaf: "#4B7F3A",       // lawn green — sparing accent (badges, success states) — unchanged
        "leaf-light": "#EAF2E6",
        charcoal: "#1C1C1C",   // body text
        slate: "#5B6270",      // muted/secondary text
      },
      fontFamily: {
        display: ["Fraunces", "serif"],   // headings — academic, editorial serif
        body: ["Inter", "sans-serif"],    // body copy
      },
    },
  },
  plugins: [],
};