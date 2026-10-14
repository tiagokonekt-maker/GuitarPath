import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  // smoke/_entry.jsx est régénéré par smoke/build.mjs à chaque `npm run smoke`
  // (une suite de `export * as …`) : rien à vérifier dedans.
  globalIgnores(['dist', 'coverage', '*.bak', 'smoke/_entry.jsx']),
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
      // Plusieurs modules de composants exportent aussi des constantes, un
      // contexte ou un hook (ThemeContext, diagrams, JamSession) : on tolère
      // ce mélange (simple perte du Fast Refresh) plutôt que de découper.
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    // Les tests tournent sous Node, pas dans un navigateur.
    files: ['test/**/*.mjs', 'scripts/**/*.mjs', 'smoke/**/*.mjs'],
    languageOptions: { globals: globals.node },
    rules: { 'no-console': 'off' },
  },
]);
