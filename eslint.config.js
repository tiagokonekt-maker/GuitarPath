import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist', 'coverage', '*.bak']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      // `ecmaVersion: 2020` empêchait de lire `?.` et `??` dans certains
      // contextes, et surtout le champ `import.meta.env` utilisé partout.
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', {
        varsIgnorePattern: '^[A-Z_]',
        argsIgnorePattern: '^_',
        // Le motif `const { a, ...rest } = obj` sert à EXCLURE des champs :
        // sans cette option, chaque destructuration de ce type est signalée.
        ignoreRestSiblings: true,
      }],
      // Les dépendances d'effets sont la première source de bugs subtils dans
      // cette base de code : on veut un avertissement visible, pas le silence.
      'react-hooks/exhaustive-deps': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    // Les tests tournent sous Node, pas dans un navigateur.
    files: ['test/**/*.mjs', 'scripts/**/*.mjs'],
    languageOptions: { globals: globals.node },
    rules: { 'no-console': 'off' },
  },
]);
