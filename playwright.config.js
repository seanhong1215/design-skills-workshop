// @ts-check
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './.docs/ec2-test',
  testMatch: '**/*.spec.js',
  timeout: 120000,
  outputDir: '.docs/ec2-test/test-results',
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    launchOptions: {
      slowMo: 2000,
    },
    viewport: { width: 1280, height: 800 },
    screenshot: 'on',
    video: 'on',
    ignoreHTTPSErrors: true,
  },
  reporter: [
    ['list'],
    ['json', { outputFile: '.docs/ec2-test/results.json' }]
  ],
})
