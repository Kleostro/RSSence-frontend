import angular from 'angular-eslint';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginNoRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';
import perfectionist from 'eslint-plugin-perfectionist';
import unusedImports from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';

import eslint from '@eslint/js';

import { myEslintRules } from './eslint-rules/my-eslint-rules.js';

export default tseslint.config(
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
  },
  { linterOptions: { reportUnusedDisableDirectives: true } },
  { ignores: ['.angular', 'dist'] },
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      eslintPluginImport.flatConfigs.recommended,
      perfectionist.configs['recommended-natural'],
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...tseslint.configs.stylisticTypeChecked,
      ...tseslint.configs.strictTypeChecked,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    plugins: {
      'unused-imports': unusedImports,
      'no-relative-import-paths': eslintPluginNoRelativeImportPaths,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        alias: {
          extensions: ['.ts', '.js', '.jsx', '.json'],
          map: [['@', './src']],
        },
      },
    },
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      ...myEslintRules,
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {
      '@angular-eslint/template/prefer-self-closing-tags': ['error'],
      '@angular-eslint/template/elements-content': ['off'],
    },
  },
);
