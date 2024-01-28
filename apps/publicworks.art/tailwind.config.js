/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // sans: ["Advent Pro", "sans-serif"],
        title: "var(--font-advent-pro)", //["Advent Pro", "sans-serif"],
        sans: "var(--font-roboto-flex)", //["Roboto+Flex", "serif"],
        serif: "var(--font-roboto-flex)", //["Roboto+Flex", "serif"],
        body: "var(--font-roboto-flex)", //["Roboto+Flex", "serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  // prefix: "tw-",
  corePlugins: {
    preflight: false,
  },
  important: true,

  daisyui: {
    utils: true,
    // prefix: "ds-",
    logs: true,
    // darkTheme: "dark",
    base: true,
    styled: true,
    themes: [
      // "dark",
      {
        mytheme: {
          "color-scheme": "light",
          primary: "#5E81AC",
          secondary: "#81A1C1",
          accent: "#88C0D0",
          neutral: "#ffffff",
          // neutral: "#4C566A",
          "neutral-content": "#D8DEE9",
          "base-100": "#ECEFF4",
          "base-200": "#E5E9F0",
          "base-300": "#D8DEE9",
          // "base-content": "#ffffff",
          "base-content": "#2E3440",
          info: "#B48EAD",
          success: "#A3BE8C",
          warning: "#EBCB8B",
          error: "#BF616A",
          "--rounded-box": "1.35rem", // border radius rounded-box utility class, used in card and other large boxes
          "--rounded-btn": "1.35rem", // border radius rounded-btn utility class, used in buttons and similar element
          "--rounded-badge": "1.9rem", // border radius rounded-badge utility class, used in badges and similar
          "--animation-btn": "0.25s", // duration of animation when you click on button
          "--animation-input": "0.2s", // duration of animation for inputs like checkbox, toggle, radio, etc
          "--btn-focus-scale": "0.95", // scale transform of button when you focus on it
          "--border-btn": "1px", // border width of buttons
          "--tab-border": "1px", // border width of tabs
          "--tab-radius": "0.5rem", // border radius of tabs
        },
      },
      "dark",
    ],
  },
};
