/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "path-to-your-node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "path-to-your-node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "progress-bar": {
          "0%": { transform: "scaleX(1)", transformOrigin: "right" },
          "100%": { transform: "scaleX(0)", transformOrigin: "right" },
        },
      },
      animation: {
        "progress-bar": "progress-bar 5s linear forwards",
      },
    },
  },
  plugins: [],
};
