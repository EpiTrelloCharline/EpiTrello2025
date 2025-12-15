import { defineConfig, devices } from '@playwright/test';

/**
 * Configuration Playwright for Tests End-to-End (E2E)
 * Documentation: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  
  /* Timeout maximum per test */
  timeout: 60 * 1000,
  
  /* Configuration for retries on failed tests */
  retries: process.env.CI ? 2 : 0,
  
  /* Number of parallel workers */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter to generate the HTML report */
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ['json', { outputFile: 'playwright-report/results.json' }]
  ],
  
  /* Global configuration for all tests */
  use: {
    /* Base URL of the application */
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    
    /* Trace collection on failure */
    trace: 'on-first-retry',
    
    /* Screenshots on failure */
    screenshot: 'only-on-failure',
    
    /* Video on failure */
    video: 'retain-on-failure',
    
    /* Timeout for actions */
    actionTimeout: 10 * 1000,
    
    /* Timeout for navigation */
    navigationTimeout: 30 * 1000,
  },

  /* Projects configuration (browsers) */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    
    // Uncomment to test on other browsers
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
