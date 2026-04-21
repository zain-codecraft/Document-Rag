/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Source Sans 3", "sans-serif"],
      },
      colors: {
        kr: {
          950: "#031833",
          900: "#04264d",
          800: "#063568",
          700: "#0b4d94",
          600: "#176ac9",
          500: "#2483ff",
          300: "#7ab8ff",
          100: "#eaf4ff",
        },
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        floaty: {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-7px)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        rise: "rise 600ms ease",
        floaty: "floaty 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
