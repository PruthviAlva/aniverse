/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        anime: {
          bg: "#0f0f15",
          card: "#1a1a2e",
          border: "#2a2a4a",
          primary: "#e85d04",
          purple: "#7c3aed",
          text: "#e2e8f0",
          muted: "#64748b",
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      }
    },
  },
  plugins: [],
}

