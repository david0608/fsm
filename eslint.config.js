const tsParser = require('@typescript-eslint/parser')
const ts = require('@typescript-eslint/eslint-plugin')
const ttf = require('eslint-plugin-total-functions')

module.exports = [
  {
    files: [
      'src/**/*.ts',
      'example/**/*.ts'
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': ts,
      'total-functions': ttf,
    },
    rules: {
      semi: ['error', 'always'],
      ...ts.configs['recommended-type-checked'].rules,
      '@typescript-eslint/indent': ['error', 2],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/require-await': 'off',
      ...ttf.configs.recommended.rules,
    },
  }
]
