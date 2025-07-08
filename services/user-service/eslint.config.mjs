// @ts-check
import tseslint from 'typescript-eslint';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

/**
 * @type {import('typescript-eslint').Config}
 */
export default tseslint.config(
  ...tseslint.configs.recommended,

  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.vitest,
      },
    },
  },

  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },

  {
    ignores: [
      'node_modules/',
      'dist/',
      'coverage/',
      '.pnpm-store/',
      'pnpm-lock.yaml',
    ],
  },

  prettier
);
