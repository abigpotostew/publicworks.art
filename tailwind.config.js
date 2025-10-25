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
        body: "var(--font-body)", // note: you can call the left side of this whatever you want - barlow-bold or title-font or foo-bar, this is what you'll use in your Tailwind css classes to use this font
        title: "var(--font-title)", // note: the bit that goes inside the var() function is the same variable name we defined in app.tsx
      },
    },
  },
  plugins: [],
  prefix: "tw-",
  corePlugins: {
    preflight: false,
  },
  important: true,
};
