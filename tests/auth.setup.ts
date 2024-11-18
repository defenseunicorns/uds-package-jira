/**
 * Copyright 2024 Defense Unicorns
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial
 */

import { test as setup, expect } from "@playwright/test";
import { authFile } from "./playwright.config";

setup("authenticate", async ({ page, context }) => {
  await page.goto("/");

  await page.getByLabel("Username or email").fill("doug");
  await page.getByLabel("Password").fill("unicorn123!@#UN");
  await page.getByRole("button", { name: "Log In" }).click();

  await page.waitForURL(/\/(projects|dashboard)/); // successful redirect

  // ensure auth cookies were set
  const cookies = await context.cookies();
  const keycloakCookie = cookies.find(
    (cookie) => cookie.name === "KEYCLOAK_SESSION"
  );

  expect(keycloakCookie).toBeDefined();
  expect(keycloakCookie?.value).not.toBe("");
  expect(keycloakCookie?.domain).toContain("sso.");

  await page.context().storageState({ path: authFile });

  await expect(page).toHaveURL(/\/(projects|dashboard)/);
});