module.exports = {
  extends: ["typescript", "next",  "prettier"],//"turbo",
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "react/jsx-key": "off",
  },
};
