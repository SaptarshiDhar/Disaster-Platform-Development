import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

/**
 * ESLint flat configuration.
 *
 * eslint-config-next 16 ships native flat configs, so no eslintrc compatibility
 * layer is needed. `next lint` was removed in Next 16 — lint runs as its own
 * script (`pnpm run lint`) and its own CI step.
 */
const config = [
  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // RAKSHA engineering rule: no implicit `any`. Prefer `unknown` plus an
      // explicit narrowing step, usually a Zod schema.
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
    },
  },
];

export default config;
