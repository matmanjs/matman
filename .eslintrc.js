module.exports = {
  env: {
    es2020: true,
    node: true,
    mocha: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {},
  overrides: [
    {
      files: ['*.test.ts', '*.test.js'],
      rules: {
        // Nice way to get rid of no-unused-expressions linter error with chai
        // https://stackoverflow.com/questions/37558795/nice-way-to-get-rid-of-no-unused-expressions-linter-error-with-chai/43525402
        'no-unused-expressions': 'off',
        '@typescript-eslint/no-unused-expressions': ['off'],
      },
    },
  ],
};
