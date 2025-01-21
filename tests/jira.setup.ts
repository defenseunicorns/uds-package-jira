import { test, expect, Page } from "@playwright/test";

test("setup jira", async ({ page }: { page: Page }) => {
  // Enable verbose logging
  page.on('console', msg => console.log(msg.text()));
  page.on('response', response => console.log(`${response.status()} ${response.url()}`));

  // Go to Jira setup page and wait for database initialization
  await test.step("wait for database initialization", async () => {
    console.log('Navigating to setup page...');
    await page.goto("/", {
      waitUntil: 'networkidle'
    });
    console.log('Page loaded');
    
    // Wait for form without timeout
    await page.waitForSelector('#jira-setupwizard');
    console.log('Setup form found');
  });

  // Set up application properties
  await test.step("setup application properties", async () => {
    console.log('Setting up application properties...');
    await page.locator('input[name="title"]').fill("Jira");
    await page.locator('#jira-setupwizard-mode-private').check();
    await page.locator('input[name="baseURL"]').fill("https://jira.uds.dev");
    await page.locator('#jira-setupwizard-submit').click();
    console.log('Application properties submitted');
  });

  // Set up license
  await test.step("setup license", async () => {
    console.log('Setting up license...');
    // Debug: Log the page content
    console.log('License page content:');
    console.log(await page.content());
    
    // Wait for the license form to be visible
    await page.waitForSelector('#jira-setupwizard', { state: 'visible' });
    
    const licenseKey = process.env.JIRA_LICENSE ?? "";
    await page.locator('#license').fill(licenseKey);  // Try using ID instead
    await page.locator('button[type="submit"]').click();  // More generic button selector
    console.log('License submitted');
  });

  // Set up admin account
  await test.step("setup admin account", async () => {
    console.log('Setting up admin account...');
    await page.locator('input[name="fullname"]').fill("UDS Admin");
    await page.locator('input[name="email"]').fill("admin@uds.dev");
    await page.locator('input[name="username"]').fill("admin");
    await page.locator('input[name="password"]').fill("admin123");
    await page.locator('input[name="confirm"]').fill("admin123");
    await page.locator('button[name="next"]').click();
    console.log('Admin account submitted');
  });

  // Skip mail setup
  await test.step("skip mail setup", async () => {
    console.log('Configuring mail setup...');
    await page.locator('input[name="noemail"]').check();
    await page.locator('button[name="finish"]').click();
    console.log('Mail setup completed');
  });

  // Verify setup completed
  await test.step("verify setup completed", async () => {
    console.log('Verifying setup completion...');
    await expect(page).toHaveURL("/secure/Dashboard.jspa");
    console.log('Setup verified');
  });
}); 