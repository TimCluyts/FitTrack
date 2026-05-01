import type {Config} from 'jest';

const config: Config = {
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	moduleNameMapper: {
		'^@components/(.*)$': '<rootDir>/src/components/$1',
		'^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
		'^@pages/(.*)$': '<rootDir>/src/pages/$1',
		'^@settings/(.*)$': '<rootDir>/src/settings/$1',
		'^@api/(.*)$': '<rootDir>/src/api/$1',
		'^@commonTypes/(.*)$': '<rootDir>/src/types/$1',
		'^@store/(.*)$': '<rootDir>/src/store/$1',
		'^@booking/(.*)$': '<rootDir>/src/booking/$1',
		'\\.(css|scss|sass)$': '<rootDir>/__mocks__/styleMock.js'
	},
	transform: {
		'^.+\\.(ts|tsx)$': [
			'ts-jest',
			{
				tsconfig: {
					moduleResolution: 'node',
					module: 'CommonJS',
					jsx: 'react-jsx'
				}
			}
		]
	}
};

export default config;
