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
    es2021: true
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['**/*.ts'],
      parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
      },
      plugins: ['@typescript-eslint']
    },
    {
      files: ['Week3JavaScriptandDOM/**/*.js'],
      env: {
        browser: true,
        node: false,
        es2021: true
      },
      globals: {
        window: 'readonly',
        document: 'readonly'
      }
    }
  ],
  ignorePatterns: [
    'node_modules/',
    '**/dist/',
    '**/build/',
    '**/.turbo/',
    'Week5MiniProjectAndTypeScript/**/compiled/',
    'Week5MiniProjectAndTypeScript/**/out/'
  ]
};
