/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ios: {
          bg: "#F2F2F7",
          card: "#FFFFFF",
          subcard: "#F8F9FA",
          text: "#000000",
          subtext: "#8E8E93",
          border: "#E5E5EA",
          blue: "#007AFF",
          green: "#34C759",
          red: "#FF3B30",
          orange: "#FF9500",
          purple: "#AF52DE",
          teal: "#30B0C7",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)",
        button: "0 2px 8px rgba(0, 122, 255, 0.25)",
        floating: "0 10px 30px rgba(0, 0, 0, 0.08)",
      },
      borderRadius: {
        '2xl': '18px',
        '3xl': '24px',
      }
    },
  },
  plugins: [],
};
