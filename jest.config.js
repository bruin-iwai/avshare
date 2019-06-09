module.exports = {
  projects: [
    {
      displayName: 'lint',
      runner: 'jest-runner-eslint',
      testMatch: [
        '<rootDir>/*.js',
        '<rootDir>/app/**/*.js',
        '<rootDir>/__mocks__/**/*.js',
        '<rootDir>/__tests__/**/*.js',
      ],
    },
    {
      displayName: 'test',
      clearMocks: true,
      testEnvironment: 'node',
      testPathIgnorePatterns: ['/node_modules/', '/__tests__/test-utils.js'],
      setupFilesAfterEnv: ['jest-extended'],
    },
  ],
  collectCoverage: true,
  collectCoverageFrom: ['index.js', 'app/**/*.js'],
  coverageThreshold: {
    global: {
      statements: 95,
    },
  },
};
