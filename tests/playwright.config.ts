/**
 * Copyright 2024 Defense Unicorns
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial
 */

import { defineConfig, devices } from '@playwright/test';

export const playwrightDir = '.playwright';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // Give failing tests 5 retry attempts
  retries: 5,
  timeout: 5 * 60 * 1000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI, // fail CI if you accidently leave `test.only` in source
  workers: 1,
  reporter: [
    // Reporter to use. See https://playwright.dev/docs/test-reporters
    ['html', { outputFolder: `${playwrightDir}/reports`, open: 'never' }],
    ['json', { outputFile: `${playwrightDir}/reports/test-results.json`, open: 'never' }],
    ['list']
  ],

  outputDir: `${playwrightDir}/output`,

  use: {
    video: 'on',
    baseURL: process.env.BASE_URL || 'https://jira.uds.dev', // for `await page.goto('/')` etc
    trace: 'on', // collect trace running the test. See https://playwright.dev/docs/trace-viewer
  },

  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ }, // authentication

    ...[
      'Desktop Chrome',
    ].map((p) => ({
      name: devices[p].defaultBrowserType,
      dependencies: ['setup'],
      use: {
        ...devices[p],
      },
    })),
  ],
});
