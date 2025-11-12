module.exports = {
  env: {
    browser: true,
    es2021: true,
    webextensions: true, // This enables the chrome global object
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    // Disable rules that are causing issues for the build
    'react/prop-types': 'off',
    'no-redeclare': 'off',
    'no-case-declarations': 'off',
    'no-undef': 'off'
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  globals: {
    chrome: 'readonly'
  }
};
