import {defineConfig, globalIgnores} from 'eslint/config';
import {fixupConfigRules, fixupPluginRules} from '@eslint/compat';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import importQuotes from 'eslint-plugin-import-quotes';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import jestDom from 'eslint-plugin-jest-dom';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import js from '@eslint/js';
import {FlatCompat} from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
});

export default defineConfig([
	globalIgnores(['*', '!src']),
	{
		extends: fixupConfigRules(
			compat.extends(
				'eslint:recommended',
				'plugin:react/recommended',
				'plugin:react-hooks/recommended',
				'plugin:prettier/recommended',
				'plugin:testing-library/react',
				'plugin:jest-dom/recommended'
			)
		),
		plugins: {
			react: fixupPluginRules(react),
			'react-hooks': fixupPluginRules(reactHooks),
			'import-quotes': importQuotes,
			'@typescript-eslint': typescriptEslint,
			'jest-dom': fixupPluginRules(jestDom)
		},

		languageOptions: {
			globals: {
				...globals.node,
				...globals.jest,
				fetch: false,
				window: false,
				document: false
			},

			ecmaVersion: 13,
			sourceType: 'module',

			parserOptions: {
				ecmaFeatures: {
					jsx: true
				},
				project: './tsconfig.json'
			}
		},

		settings: {
			react: {
				version: 'detect'
			}
		},

		rules: {
			'linebreak-style': ['error', 'unix'],
			'import-quotes/import-quotes': ['error', 'single'],
			eqeqeq: 'error',
			curly: ['error', 'multi-line', 'consistent'],
			'no-unused-vars': [
				'error',
				{
					vars: 'all',
					args: 'none',
					ignoreRestSiblings: false
				}
			],

			'no-trailing-spaces': [
				'error',
				{
					ignoreComments: true,
					skipBlankLines: true
				}
			],

			'no-multi-spaces': [
				'error',
				{
					ignoreEOLComments: true
				}
			],

			'block-spacing': 'error',
			quotes: ['error', 'single'],
			'arrow-parens': ['error', 'as-needed'],
			'no-mixed-spaces-and-tabs': ['warn', 'smart-tabs'],
			'jsx-quotes': 1,
			'react/display-name': 0,
			'react/forbid-prop-types': [
				2,
				{
					forbid: ['any']
				}
			],
			'react/react-in-jsx-scope': 0,
			'react/jsx-boolean-value': 1,
			'react/jsx-closing-bracket-location': 0,
			'react/jsx-curly-spacing': 1,
			'react/jsx-indent-props': 0,
			'react/jsx-key': 1,
			'react/jsx-max-props-per-line': 0,
			'react/jsx-no-literals': 0,
			'react/jsx-pascal-case': 1,
			'react/jsx-sort-prop-types': 0,
			'react/jsx-sort-props': 0,
			'react/no-multi-comp': 0,
			'react/self-closing-comp': 1
		}
	},
	{
		files: ['**/*.ts', '**/*.tsx'],
		extends: compat.extends('plugin:@typescript-eslint/recommended'),

		languageOptions: {
			parser: tsParser,
			ecmaVersion: 5,
			sourceType: 'script',

			parserOptions: {
				project: './tsconfig.json'
			}
		},

		rules: {
			'no-extra-boolean-cast': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					args: 'all',
					argsIgnorePattern: '^_',
					caughtErrors: 'all',
					caughtErrorsIgnorePattern: '^_',
					destructuredArrayIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					ignoreRestSiblings: true
				}
			],
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/await-thenable': 'error',
			'testing-library/render-result-naming-convention': 1,
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-unused-expressions': [
				'error',
				{allowShortCircuit: true, allowTernary: true}
			]
		}
	}
]);
