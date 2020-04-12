module.exports = {
  presets: ["next/babel"],
  plugins: [
    "@babel/plugin-proposal-nullish-coalescing-operator",
    "@babel/plugin-proposal-optional-chaining",
    [
      "styled-components",
      {
        displayName: process.env.NODE_ENV !== "production",
        pure: true,
      },
    ],
  ],
};
