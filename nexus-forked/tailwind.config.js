/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        nexus: {
          bg: "var(--nexus-bg)",
          surface: "var(--nexus-surface)",
          "surface-hover": "var(--nexus-surface-hover)",

          primary: "var(--nexus-primary)",
          "primary-hover": "var(--nexus-primary-hover)",
          secondary: "var(--nexus-secondary)",
          accent: "var(--nexus-accent)",

          text: "var(--nexus-text)",
          "text-secondary": "var(--nexus-text-secondary)",
          "text-muted": "var(--nexus-text-muted)",

          border: "var(--nexus-border)",
          success: "var(--nexus-success)",
          error: "var(--nexus-error)",
          like: "var(--nexus-like)",
        },
      },
    },
  },
  plugins: [],
};
