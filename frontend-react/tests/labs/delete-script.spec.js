const { test, expect } = require("@playwright/test");
const {
  TEST_SCRIPTS,
  SELECTORS,
  login,
  addScript,
  waitForPageLoad,
  clearAllScripts,
} = require("../helpers");

test.describe("Scripts - Delete Script", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await login(page);
    await waitForPageLoad(page);
    await clearAllScripts(page);

    // Add a script to delete
    await addScript(page, TEST_SCRIPTS.script1);
  });

  test("should cancel deletion and keep script", async ({ page }) => {
    const scriptCard = page.locator(SELECTORS.scriptCard).first();
    // Pastikan scriptCard sudah muncul
    await expect(scriptCard).toBeVisible({ timeout: 5000 });
    // Click delete button
    await scriptCard.locator(SELECTORS.deleteButton).click();

    // Cancel deletion
    await page.locator(SELECTORS.cancelDeleteButton).click();

    // Wait for modal to close before checking script visibility
    await expect(page.locator(SELECTORS.deleteModal)).not.toBeVisible();

    // Script should still be visible
    await expect(
      page.locator(`text=${TEST_SCRIPTS.script1.title}`)
    ).toBeVisible();
  });

  test("should show correct confirmation message", async ({ page }) => {
    const scriptCard = page.locator(SELECTORS.scriptCard).first();

    // Click delete button
    await scriptCard.locator(SELECTORS.deleteButton).click();

    // Should show confirmation text with script title
    await expect(
      page.locator("text=Are you sure you want to delete")
    ).toBeVisible();
    await expect(
      page.locator(`text="${TEST_SCRIPTS.script1.title}"`)
    ).toBeVisible();
  });
});
