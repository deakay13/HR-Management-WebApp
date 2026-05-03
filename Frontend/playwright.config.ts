import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  /* Chạy test file đồng thời */
  fullyParallel: true,
  /* Fail build trên CI nếu có `.only` trong source code. */
  forbidOnly: !!process.env.CI,
  /* Retry 2 lần trên CI */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Config chung cho tất cả các project */
  use: {
    /* Base URL để dùng các relative url ví dụ: `await page.goto('/')`. */
    baseURL: 'http://localhost:5173',

    /* Collect trace khi test fail */
    trace: 'on-first-retry',
  },

  /* Cấu hình các Browser projects */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],

  /* Chạy dev server local trước khi bắt đầu các tests */
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
