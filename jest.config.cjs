/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: '<rootDir>/jest.jsdom.cjs',
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  setupFiles: ['<rootDir>/src/__tests__/browserSetup.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  transform: {
    '^.+\\.(t|j)sx?$': [
      'babel-jest',
      { configFile: './babel.config.jest.cjs' },
    ],
    '^.+\\.mjs$': ['babel-jest', { configFile: './babel.config.jest.cjs' }],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(msw|@mswjs|until-async|@bundled-es-modules|outvariant|strict-event-emitter|headers-polyfill|is-node-process|graphql|tough-cookie|tldts)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs', 'json'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': '<rootDir>/src/__tests__/styleMock.cjs',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/__tests__/**',
    '!src/debug/**',
    '!src/i18n/**',
    '!src/remote/**',
    '!src/styles/**',
    '!src/index.ts',
    '!src/main.tsx',
    '!src/types/**',
    '!src/vite-env.d.ts',
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coverageReporters: ['text', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
