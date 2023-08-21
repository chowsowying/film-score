/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#c91e35",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // for use of antd components without tailwind styles
  },
};
