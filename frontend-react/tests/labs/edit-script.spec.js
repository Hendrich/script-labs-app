const { test, expect } = require("@playwright/test");
const {
  TEST_SCRIPTS,
  SELECTORS,
  login,
  addScript,
  waitForPageLoad,
  clearAllScripts,
} = require("../helpers");

test.describe("Scripts - Edit Script", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await login(page);
    await waitForPageLoad(page);
    await clearAllScripts(page);
    // Pastikan form kosong sebelum menambah script
    await page.fill(SELECTORS.titleInput, "");
    await page.fill(SELECTORS.descriptionInput, "");
    // Add a script to edit
    await addScript(page, TEST_SCRIPTS.script1);
  });

  test("should enter edit mode when clicking edit button", async ({ page }) => {
    const scriptCard = page.locator(SELECTORS.scriptCard).first();

    // Click edit button
    await scriptCard.locator(SELECTORS.editButton).click();

    // Should show editable inputs
    await expect(scriptCard.locator(".editable-title")).toBeVisible();
    await expect(scriptCard.locator(".editable-description")).toBeVisible();

    // Should show save and cancel buttons
    await expect(scriptCard.locator(SELECTORS.saveButton)).toBeVisible();
    await expect(scriptCard.locator(SELECTORS.cancelButton)).toBeVisible();

    // Should hide edit and delete buttons
    await expect(scriptCard.locator(SELECTORS.editButton)).not.toBeVisible();
    await expect(scriptCard.locator(SELECTORS.deleteButton)).not.toBeVisible();
  });

  test("should validate required fields during edit", async ({ page }) => {
    const scriptCard = page.locator(SELECTORS.scriptCard).first();

    // Enter edit mode
    await scriptCard.locator(SELECTORS.editButton).click();

    // Clear title field
    await scriptCard.locator(".editable-title").fill("");

    // Save button should be disabled
    await expect(scriptCard.locator(SELECTORS.saveButton)).toBeDisabled();

    // Clear description field too
    await scriptCard.locator(".editable-description").fill("");

    // Save button should still be disabled
    await expect(scriptCard.locator(SELECTORS.saveButton)).toBeDisabled();
  });

  test("should handle whitespace in edit fields", async ({ page }) => {
    const scriptCard = page.locator(SELECTORS.scriptCard).first();
    // Pastikan scriptCard sudah muncul
    await expect(scriptCard).toBeVisible({ timeout: 5000 });
    // Enter edit mode
    await scriptCard.locator(SELECTORS.editButton).click();

    // Fill with whitespace only
    await scriptCard.locator(".editable-title").fill("   ");
    await scriptCard.locator(".editable-description").fill("   ");

    // Save button should be disabled
    await expect(scriptCard.locator(SELECTORS.saveButton)).toBeDisabled();
  });

  test("should apply edit mode styling", async ({ page }) => {
    const scriptCard = page.locator(SELECTORS.scriptCard).first();
    // Pastikan ada script sebelum klik edit
    await expect(scriptCard).toBeVisible({ timeout: 5000 });
    // Enter edit mode
    await scriptCard.locator(SELECTORS.editButton).click();
    // Card should have editing class
    await expect(scriptCard).toHaveClass(/editing/);
  });

  test("should handle multiple scripts in edit mode", async ({ page }) => {
    // Add another script
    await addScript(page, TEST_SCRIPTS.script2);

    // Pastikan ada dua script card
    const scriptCards = page.locator(SELECTORS.scriptCard);
    await expect(scriptCards).toHaveCount(2, { timeout: 5000 });
    const firstCard = scriptCards.first();
    const secondCard = scriptCards.last();

    // Enter edit mode for first script
    await firstCard.locator(SELECTORS.editButton).click();

    // First card should be in edit mode
    await expect(firstCard.locator(".editable-title")).toBeVisible();

    // Second card should still be in normal mode
    await expect(secondCard.locator(SELECTORS.editButton)).toBeVisible();
    await expect(secondCard.locator(".editable-title")).not.toBeVisible();
  });
});
