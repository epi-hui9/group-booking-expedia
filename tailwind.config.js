/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        expedia: {
          blue: "#1668E3",
          "blue-hover": "#0F50B5",
          "blue-soft": "#E8F0FE",
          "blue-deep": "#003B95",
          navy: "#191E3B",
          "navy-deep": "#0E1226",
          yellow: "#FFC72C",
          "yellow-hover": "#F4B800",
          ink: "#0D1421",
          body: "#1F2937",
          slate: "#4B5563",
          mute: "#6B7280",
          line: "#E5E7EB",
          "line-soft": "#F0F1F4",
          surface: "#F7F8FA",
          cream: "#FAFAFA",
          success: "#0F8A4C",
          "success-soft": "#E6F4EC",
          warn: "#B25E13",
          "warn-soft": "#FCF1E5",
          danger: "#B23A2A",
        },
      },
      fontFamily: {
        sans: [
          "'Inter'",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: [
          "'Plus Jakarta Sans'",
          "'Inter'",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(13, 20, 33, 0.04), 0 2px 8px rgba(13, 20, 33, 0.05)",
        cardHover:
          "0 2px 6px rgba(13, 20, 33, 0.06), 0 10px 24px rgba(13, 20, 33, 0.08)",
        hero: "0 12px 32px rgba(13, 20, 33, 0.08), 0 2px 6px rgba(13, 20, 33, 0.04)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(4px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: 0, transform: "translateY(16px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        pop: {
          "0%": { transform: "scale(0.96)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
      },
      animation: {
        fadeIn: "fadeIn .3s ease-out both",
        slideUp: "slideUp .35s cubic-bezier(.2,.7,.2,1) both",
        pop: "pop .25s cubic-bezier(.2,.8,.2,1.05) both",
      },
    },
  },
  plugins: [],
};
