import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";

test("login and perform a11y check on products list", async ({ page }, testInfo) => {
  await page.goto("https://qa-practice.netlify.app/auth_ecommerce");

  // login
  await page.locator("#email").fill("admin@admin.com");
  await page.locator("#password").fill("admin123");
  await page.getByRole("button", { name: "Submit" }).click();

  // assert login success
  await expect(page.getByRole("link", { name: "Log Out" })).toBeVisible();

  // perform accessibility check
  await test.step("check a11y", async () => {
    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      // .withRules(['color-contrast', 'select-name'])
      // .disableRules(['duplicate-id'])
      // .include('#contact')
      // .exclude('#element-with-known-issue')
      .analyze();

    // generate test results attachment
    await testInfo.attach("accessibility-scan-results", {
      body: JSON.stringify(violations, null, 2),
      contentType: "application/json",
    });

    // assert
    expect(violations).toHaveLength(0);
  });
});


