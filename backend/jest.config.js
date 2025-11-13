export default {
  testEnvironment: 'node',
  
  // Use Babel to transform ES modules
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  
  // Test file patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/__tests__/**/*.js',
  ],
  
  // Coverage configuration
  collectCoverageFrom: [
    'models/**/*.js',
    'routes/**/*.js',
    'utils/**/*.js',
    'config/**/*.js',
    '!server.js',
    '!**/node_modules/**',
  ],
  
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'json', 'html'],
  
  // Test timeout
  testTimeout: 10000,
  
  // Other settings
  verbose: true,
  forceExit: true,
  detectOpenHandles: true,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // MongoDB connection settings
  globalSetup: undefined,
  globalTeardown: undefined,
};