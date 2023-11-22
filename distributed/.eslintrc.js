module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
  },
  plugins: ['import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/typescript',
  ],
  ignorePatterns: ['dist'],
  rules: {
    'max-len': 0,
    'no-console': process.env.NODE_ENV !== 'production' ? 'warn' : 'error',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: 'next' }],
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
      },
    ],
    'import/first': 'error',
    'import/no-mutable-exports': 'error',
    'import/newline-after-import': 'error',
    'sort-imports': ['error', { ignoreDeclarationSort: true }],
  },
};
