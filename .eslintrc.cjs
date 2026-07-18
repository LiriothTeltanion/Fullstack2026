// Module: eslint-config
// Purpose: Centralize linting defaults for browser exercises and TypeScript tooling across the curriculum.
// Author: Kevin "Lirioth" Cusnir
// Date: 2025-10-09 | TZ: Asia/Jerusalem
// Notes: Comments in ENGLISH; emojis sparingly.

module.exports = {
  root: true,
  env: {
    browser: false,
    node: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  overrides: [
    {
      files: ["**/*.js"],
      rules: {
        // Plain JavaScript exercises legitimately mix browser scripts and
        // CommonJS. TypeScript-only migration rules should not flag them.
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/ban-ts-comment": "off",
      },
    },
    {
      files: ["**/*.ts"],
      parserOptions: {
        ecmaVersion: 12,
        sourceType: "module",
      },
      plugins: ["@typescript-eslint"],
    },
    {
      files: [
        "Week3JavaScriptandDOM/**/*.js",
        "Week4AdvAsynchronousJavaScript/**/*.js",
        "Week5MiniProjectAndTypeScript/**/config.example.js",
      ],
      env: {
        browser: true,
        node: true,
        es2021: true,
      },
    },
  ],
  ignorePatterns: [
    "node_modules/",
    "**/dist/",
    "**/build/",
    "**/.turbo/",
    "Week5MiniProjectAndTypeScript/**/compiled/",
    "Week5MiniProjectAndTypeScript/**/out/",
  ],
};
