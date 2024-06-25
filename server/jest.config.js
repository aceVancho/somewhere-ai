// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { /* ts-jest config goes here in Jest */ }],
  },
  testMatch: ['**/test/**/*.test.(ts|tsx|js)'], // Only run tests in the test directory
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/src/'], // Ignore these directories
};
