module.exports = {
  env: {
    es6: true,
    node: true,
    mocha: true,
  },
  extends: [
    '@tencent/eslint-config-tencent',
    '@tencent/eslint-config-tencent/ts',
  ],
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
