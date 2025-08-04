const { test, expect } = require("@playwright/test");
const {
  TEST_SCRIPTS,
  SELECTORS,
  login,
  addScript,
  waitForPageLoad,
  clearAllScripts,
} = require("../helpers");

test.describe("Scripts - Script List", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await login(page);
    await waitForPageLoad(page);
    // Clear all existing scripts to ensure test isolation
    await clearAllScripts(page);
  });

  test("should show empty state when no scripts exist", async ({ page }) => {
    await clearAllScripts(page);
    // Pastikan benar-benar tidak ada script card sebelum reload
    await expect(page.locator(SELECTORS.scriptCard)).toHaveCount(0, {
      timeout: 5000,
    });
    await page.reload();
    // Tunggu sebentar agar UI sempat render
    await page.waitForTimeout(500);
    // Should show empty state message
    await expect(page.locator(SELECTORS.emptyState)).toBeVisible();
    await expect(page.locator("text=🧪 No Script Labs Found")).toBeVisible();
    await expect(
      page.locator(
        "text=Start creating your testing scripts by adding your first lab above!"
      )
    ).toBeVisible();
  });
});
