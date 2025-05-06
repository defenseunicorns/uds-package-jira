/**
 * Copyright 2024 Defense Unicorns
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial
 */

import { test, expect, devices } from '@playwright/test';
import path from 'path';

// Function to generate a unique screenshot filename with a custom base name
const getUniqueScreenshotPath = (baseName: string) => {
  let screenshotPath = path.resolve(__dirname, 'screenshots', `${defaultBrowserType}-${baseName}.png`);
  return screenshotPath;
};

let defaultBrowserType: string;

test.beforeEach(async ({ browserName }) => {
  // Use browserName provided by Playwright to determine the browser type
  defaultBrowserType = browserName;
});

test.describe('Jira', () => {
  test('Reach Jira setup page', async ({ page, baseURL }) => {

    console.log('🔄 Navigating to Jira setup page...');
    await page.goto(baseURL);

    console.log('🛑 Wait for 10 seconds...');
    await page.waitForTimeout(10000);

    // Wait for the <h1 id="logo"> element
    console.log('⏳ Waiting for the setup page to be visible...');
    const logoHeader = await page.locator('h1#logo');
    await expect(logoHeader).toBeVisible();

    // Ensure it contains the expected <img> with alt="Jira"
    const logoImg = logoHeader.locator('img[alt="Jira"]');
    await expect(logoImg).toBeVisible();

    console.log('📸 Taking screenshot of setup page...');
    let screenshotPath = getUniqueScreenshotPath('1.setup-page');
    await page.screenshot({ path: screenshotPath });

    console.log('🎉 Successfully reached Jira setup page!');

  });
});
