// Central ESLint 10 flat configuration for the JavaScript and TypeScript curriculum.
// The repository keeps browser globals scoped to browser-facing exercises while
// preserving Node.js globals for scripts, examples, tests, and tooling.

import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import globals from "globals";
import tseslint from "typescript-eslint";

const curriculumFiles = ["**/*.{js,ts}"];
const browserExerciseFiles = [
  "Week3JavaScriptandDOM/**/*.js",
  "Week4AdvAsynchronousJavaScript/**/*.js",
  "Week5MiniProjectAndTypeScript/**/config.example.js",
];

export default defineConfig([
  {
    name: "nova/ignores",
    ignores: [
      "node_modules/",
      "**/dist/",
      "**/build/",
      "**/.turbo/",
      "Week5MiniProjectAndTypeScript/**/compiled/",
      "Week5MiniProjectAndTypeScript/**/out/",
      "Week5MiniProjectAndTypeScript/**/data/",
    ],
  },
  {
    name: "nova/recommended",
    files: curriculumFiles,
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
  },
  {
    name: "nova/browser-exercises",
    files: browserExerciseFiles,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    name: "nova/javascript-compatibility",
    files: ["**/*.js"],
    rules: {
      // The curriculum intentionally includes CommonJS and guided @ts-ignore
      // examples. Review those source exercises in course order instead of
      // turning the ESLint 10 configuration migration into a code rewrite.
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    name: "nova/eslint-10-baseline",
    files: curriculumFiles,
    rules: {
      // ESLint 10 added these checks to eslint:recommended. Keep the verified
      // 65-finding historical baseline stable, then enable and address the new
      // rules in a separate source-aware learning pass.
      "@typescript-eslint/no-unused-vars": ["error", { caughtErrors: "none" }],
      "no-constant-condition": ["error", { checkLoops: "all" }],
      "no-constant-binary-expression": "off",
      "no-unassigned-vars": "off",
      "no-useless-assignment": "off",
    },
  },
  eslintConfigPrettier,
]);
