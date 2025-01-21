/**
 * Copyright 2025 Defense Unicorns
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial
 */

import { test, expect, Page } from "@playwright/test";

test("setup jira", async ({ page }: { page: Page }) => {

  await test.step('navigate to dashboard', async () => {
    await page.goto('/secure/Dashboard.jspa');
    console.log('Navigated to dashboard');
  })

  await test.step('click login button', async () => {
    await page.locator('a.aui-nav-link.login-link').click();
    console.log('Clicked login button');
  })

  await test.step('fill in username', async () => {
    await page.locator('//input[@id="username-field"]').fill('admin');
    console.log('Filled in username');
  })

  await test.step('fill in password', async () => {
    await page.locator('//input[@id="password-field"]').fill('admin');
    console.log('Filled in password');
  })

  await test.step('click login button', async () => {
    await page.locator('//span[@class="css-1nqby2s"]').click();
    console.log('Clicked login button');
  })
  
  await test.step('search for continue button', async () => {
    await page.locator('//input[@id="next"]').click();
    console.log('Clicked continue button');
  })

  await test.step('click avatar next button', async () => {
    await page.locator('//input[@value="Next"]').click();
    console.log('Clicked next button');
  })

  await test.step('create project', async () => {
    await page.locator('//button[@id="emptyProject"]').click();
    console.log('Clicked create button');
  })

  await test.step('basic project development button', async () => {
    await page.locator('//div[@title="Track development tasks and bugs. Connects with source and build tools."]').click();
    console.log('Clicked basic project development button');
  })

  await test.step('click select button', async () => {
    await page.locator('//button[@class="template-info-dialog-create-button pt-submit-button aui-button aui-button-primary"]').click();
    console.log('Clicked select button');
  })
  
  await test.step('Enter project name and key, and submit', async () => {
    await page.locator('//input[@id="name"]').fill('test');
    await page.locator('//input[@id="key"]').fill('test');
    await page.locator('//button[@class="add-project-dialog-create-button pt-submit-button aui-button aui-button-primary"]').click();
    console.log('Filled in project name and key');
    console.log('Clicked submit button');
  })
    
}); 
