/**
 * Copyright 2025 Defense Unicorns
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial
 */

import { test, expect, Page } from "@playwright/test";

test("initial jira setup", async ({ page }: { page: Page }) => {
  try {
    await test.step('ensure logged out', async () => {
      console.log('Ensuring user is logged out...');
      await page.goto('/logout');
      await page.waitForTimeout(1000);
      console.log('Logged out successfully');
    });

    await test.step('navigate to login', async () => {
      console.log('Navigating to login page...');
      await page.goto('/login.jsp');
      await page.waitForLoadState('networkidle');
      
      // Debug: Log all input fields on the page
      const inputs = await page.$$('input');
      console.log('Found input fields:', await Promise.all(inputs.map(async input => {
        const id = await input.getAttribute('id');
        const name = await input.getAttribute('name');
        const type = await input.getAttribute('type');
        return `id=${id}, name=${name}, type=${type}`;
      })));
    });

    await test.step('fill in username', async () => {
      console.log('Waiting for login form...');
      await page.waitForSelector('#login-form');
      
      // Try multiple possible selectors for username
      const selectors = [
        'input[name="os_username"]',
        '#username-field',
        'input[id="username-field"]',
        'input[name="username"]'
      ];

      let usernameField = null;
      for (const selector of selectors) {
        console.log(`Trying selector: ${selector}`);
        const field = page.locator(selector);
        if (await field.count() > 0) {
          console.log(`Found username field with selector: ${selector}`);
          usernameField = field;
          break;
        }
      }

      if (!usernameField) {
        await page.screenshot({ path: 'username-field-not-found.png', fullPage: true });
        throw new Error('Could not find username field with any known selector');
      }

      await usernameField.fill('admin');
      console.log('Filled in username');
    });

    await test.step('fill in password', async () => {
      // Try multiple possible selectors for password
      const selectors = [
        'input[name="os_password"]',
        '#password-field',
        'input[id="password-field"]',
        'input[name="password"]'
      ];

      let passwordField = null;
      for (const selector of selectors) {
        console.log(`Trying selector: ${selector}`);
        const field = page.locator(selector);
        if (await field.count() > 0) {
          console.log(`Found password field with selector: ${selector}`);
          passwordField = field;
          break;
        }
      }

      if (!passwordField) {
        await page.screenshot({ path: 'password-field-not-found.png', fullPage: true });
        throw new Error('Could not find password field with any known selector');
      }

      await passwordField.fill('admin');
      console.log('Filled in password');
    });

    await test.step('click login button', async () => {
      // Try multiple possible selectors for login button
      const selectors = [
        'button#login-button',
        '#login-button',
        'input[name="login"]',
        'button[type="submit"]'
      ];

      let loginButton = null;
      for (const selector of selectors) {
        console.log(`Trying selector: ${selector}`);
        const button = page.locator(selector);
        if (await button.count() > 0) {
          console.log(`Found login button with selector: ${selector}`);
          loginButton = button;
          break;
        }
      }

      if (!loginButton) {
        await page.screenshot({ path: 'login-button-not-found.png', fullPage: true });
        throw new Error('Could not find login button with any known selector');
      }

      await loginButton.click();
      console.log('Clicked login button');
    });

    await test.step('wait for navigation after login', async () => {
      console.log('Waiting for navigation after login...');
      await page.waitForNavigation();
    });

    await test.step('navigate to setup', async () => {
      console.log('Navigating to initial setup...');
      await page.goto('/');
      await page.waitForLoadState('networkidle');
    });

    await test.step('language selection', async () => {
      console.log('Selecting language...');
      // English (United States) is usually pre-selected as default
      const continueButton = page.locator('input#next[value="Continue"]');
      if (await continueButton.count() > 0) {
        console.log('Clicking Continue on language selection...');
        await continueButton.click();
      }
    });

    await test.step('avatar setup', async () => {
      console.log('Handling avatar setup...');
      
      // Try multiple selectors for the Next button
      const nextButtonSelectors = [
        'button:has-text("Next")',
        'input[value="Next"]',
        'button.next-button',
        'button[type="submit"]',
        '[data-testid="next-button"]'
      ];

      let nextButtonFound = false;
      for (const selector of nextButtonSelectors) {
        console.log(`Trying Next button selector: ${selector}`);
        const nextButton = page.locator(selector);
        if (await nextButton.count() > 0) {
          console.log(`Found Next button with selector: ${selector}`);
          await nextButton.click();
          nextButtonFound = true;
          break;
        }
      }

      if (!nextButtonFound) {
        console.log('Taking screenshot of avatar setup failure...');
        await page.screenshot({ path: 'avatar-setup-failed.png', fullPage: true });
        throw new Error('Could not find Next button on avatar setup page');
      }

      await page.waitForTimeout(2000); // Wait for transition
    });

    await test.step('create first project', async () => {
      console.log('Starting project creation...');
      const createProjectButton = page.locator('button#emptyProject.add-project-trigger');
      if (await createProjectButton.count() > 0) {
        console.log('Clicking Create new project...');
        await createProjectButton.click();
      }

      // Wait for template selection with multiple possible selectors
      console.log('Waiting for template selection...');
      
      // Wait for the template container to be visible
      await page.waitForSelector('.dialog-page-body.select-project-templates-page', { timeout: 5000 });
      
      // Find and click the Basic Software Development template
      const templateId = 'com\\.pyxis\\.greenhopper\\.jira\\:basic-software-development-template';
      console.log('Looking for Basic Software Development template...');
      
      // Try multiple selector strategies
      const templateSelectors = [
        // Target the radio input directly
        'input[name="project-template"][id="com.pyxis.greenhopper.jira:basic-software-development-template"]',
        // Target the containing div
        'div.template.selected[data-item-module-complete-key="com.pyxis.greenhopper.jira:basic-software-development-template"]',
        // Target by name and label text
        'input[name="project-template"][aria-label*="Basic software development"]'
      ];

      let templateFound = false;
      for (const selector of templateSelectors) {
        console.log(`Trying selector: ${selector}`);
        const template = page.locator(selector);
        if (await template.count() > 0) {
          console.log(`Found template with selector: ${selector}`);
          await template.click({ force: true }); // Use force: true since radio might be hidden
          templateFound = true;
          break;
        }
      }

      if (!templateFound) {
        console.log('Taking screenshot of template selection failure...');
        await page.screenshot({ path: 'template-selection-failed.png', fullPage: true });
        throw new Error('Could not find Basic Software Development template');
      }
      
      // Wait for and click Next button
      console.log('Waiting for Next button...');
      await page.waitForSelector('button[type="submit"], button:has-text("Next")', { timeout: 5000 });
      console.log('Clicking Next button...');
      await Promise.race([
        page.click('button[type="submit"]'),
        page.click('button:has-text("Next")')
      ]);
      
      // Wait for and click Select button
      console.log('Waiting for Select button...');
      await page.waitForSelector('button:has-text("Select")', { timeout: 5000 });
      console.log('Clicking Select button...');
      await page.click('button:has-text("Select")');
      
      // Wait for project details form
      console.log('Waiting for project details form...');
      await page.waitForSelector('input#name, input[name="name"]', { timeout: 5000 });
      
      // Fill in project details
      console.log('Filling in project details...');
      await page.fill('input#name, input[name="name"]', 'test');
      await page.fill('input#key, input[name="key"]', 'TEST');
      
      // Submit form and wait for navigation
      console.log('Submitting project form...');
      await page.click('button:has-text("Submit")');

      // Wait for navigation to project page
      await page.waitForURL(/.*\/projects\/TEST\/.*$/, { timeout: 10000 }).catch(async () => {
        await page.screenshot({ path: 'project-creation-failed.png', fullPage: true });
        throw new Error('Project creation failed - did not navigate to project page');
      });

      // Verify project creation by checking for "Open issues" search
      console.log('Verifying project creation...');
      const openIssuesHeading = page.locator('h1:has-text("Open issues")');
      const switchFilter = page.locator('button:has-text("Switch filter")');
      
      await expect(openIssuesHeading).toBeVisible({ timeout: 5000 });
      await expect(switchFilter).toBeVisible({ timeout: 5000 });
      
      console.log('Project creation verified successfully');
    });
  } catch (error) {
    // Take a final screenshot on any unhandled error
    await page.screenshot({ path: `error-${Date.now()}.png`, fullPage: true });
    throw error;
  }
}); 