module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["plugin:react/recommended", "plugin:prettier/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: [
    "react",
    "@typescript-eslint",
    "react-hooks",
    "react-refresh",
    "unused-imports",
    "eslint-plugin-no-inline-styles",
    "vietnamese",
    "prettier",
  ],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": 0,
    "react/display-name": 0,
    "no-mixed-spaces-and-tabs": 0,
    "no-console": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 1 }],
    "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
    "react-hooks/exhaustive-deps": "warn", // Checks effect dependencies
    //
    "no-unused-vars": "off", // or "@typescript-eslint/no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" },
    ],
    "no-inline-styles/no-inline-styles": 2,
    "vietnamese/vietnamese-words": "error",
  },
};
