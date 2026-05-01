import '@testing-library/jest-dom';

(globalThis as Record<string, unknown>).__ENV__ = 'test';
(globalThis as Record<string, unknown>).__APP_VERSION__ = '0.0.0-test';
(globalThis as Record<string, unknown>).__API_BASE_URL__ = 'http://localhost';
