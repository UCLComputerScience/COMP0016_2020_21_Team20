module.exports = {
  setupFilesAfterEnv: ['expect-puppeteer'],
  testTimeout: 15000,
  testEnvironment: './test/end-to-end/e2e-test.environment.js',
};

process.env.BASE_URL = 'http://localhost:3000';
