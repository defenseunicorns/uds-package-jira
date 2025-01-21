/**
 * Copyright 2025 Defense Unicorns
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial
 */

import { test, expect, Page } from "@playwright/test";

test("setup jira", async ({ page }: { page: Page }) => {
  // Enable verbose logging
  page.on('console', msg => console.log(`Browser console: ${msg.text()}`));
  page.on('response', response => console.log(`${response.status()} ${response.url()}`));

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

    await test.step('create project', async () => {
      console.log('Creating new project...');
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Click Projects menu with retry
      console.log('Clicking Projects menu...');
      await Promise.race([
        page.click('a#browse_link'),
        page.click('[data-testid="browse-projects-button"]')
      ]).catch(e => console.log('Initial project menu click failed:', e));

      // Wait for and click Create project with retry
      console.log('Waiting for Create project button...');
      await page.waitForSelector('li#project_template_create_link a, [data-testid="create-project-button"]', 
        { timeout: 15000 }).catch(async (e) => {
          console.log('Create project button not found:', e);
          await page.screenshot({ path: 'create-project-not-found.png', fullPage: true });
          throw e;
      });
      
      console.log('Clicking Create project...');
      await Promise.race([
        page.click('li#project_template_create_link a'),
        page.click('[data-testid="create-project-button"]')
      ]);

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
      const projectTitle = await page.locator('h1');
      expect(await projectTitle.textContent()).toContain('test');
    });
  } catch (error) {
    // Take a final screenshot on any unhandled error
    await page.screenshot({ path: `error-${Date.now()}.png`, fullPage: true });
    throw error;
  }
});