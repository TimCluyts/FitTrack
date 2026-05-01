import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default tseslint.config(
	{
		ignores: ['**/.build/**', '**/node_modules/**', 'src/routeTree.gen.ts']
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		plugins: {
			react: reactPlugin,
			'react-hooks': reactHooksPlugin
		},
		languageOptions: {
			parserOptions: {
				ecmaFeatures: {jsx: true}
			}
		},
		settings: {
			react: {version: 'detect'}
		},
		rules: {
			'react/react-in-jsx-scope': 'off',
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',
			quotes: ['error', 'single', {avoidEscape: true}],
			'arrow-parens': ['error', 'as-needed'],
			'@typescript-eslint/no-unused-vars': [
				'error',
				{argsIgnorePattern: '^_'}
			]
		}
	}
);
