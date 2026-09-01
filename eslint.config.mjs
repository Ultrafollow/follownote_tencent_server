// eslint.config.js
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  { ignores: ['tailwind.config.js'] },
  js.configs.recommended,
  ...compat.extends(
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
    'next',
    'next/core-web-vitals'
  ),
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.amd, ...globals.node },
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } }
    },
    rules: {
      // 关闭引号相关规则
      'quotes': 'off',
      'prettier/prettier': ['error', { 
        singleQuote: false,     // Prettier 不强制单引号
        jsxSingleQuote: false   // Prettier 不强制 JSX 单引号
      }],
      // 其他规则保持不变...
      'react/react-in-jsx-scope': 'off',
      'jsx-a11y/anchor-is-valid': ['error', { components: ['Link'] }],
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off'
    }
  }
];