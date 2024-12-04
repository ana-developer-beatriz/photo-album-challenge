module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    jest: true,
    browser: true,
    amd: true,
    node: true,
  },
  plugins: ["react", "@typescript-eslint"],
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:prettier/recommended'],
  rules: {
    'no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: false, argsIgnorePattern: '^_',}],
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
     'react/prop-types': 'off'
  },
};
