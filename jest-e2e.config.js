module.exports = {
  preset: 'jest-puppeteer',
  setupFilesAfterEnv: ['expect-puppeteer'],
  testTimeout: 10000,
  testEnvironment: './test/end-to-end/e2e-test.environment.js',
};

process.env.BASE_URL = 'http://localhost:3000';
