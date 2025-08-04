const { test, expect } = require("@playwright/test");
const {
  TEST_SCRIPTS,
  SELECTORS,
  login,
  addScript,
  clearAllScripts,
} = require("../helpers");

test.describe("Script Labs - Add New Script", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await login(page);
    // Clear existing scripts
    await clearAllScripts(page);
  });

  test("should validate title field is required", async ({ page }) => {
    // Leave title empty, fill description
    await page.fill(
      SELECTORS.descriptionInput,
      TEST_SCRIPTS.script1.description
    );

    // Button should be disabled
    await expect(page.locator(SELECTORS.addScriptButton)).toBeDisabled();
  });

  test("should validate description field is required", async ({ page }) => {
    // Fill title, leave description empty
    await page.fill(SELECTORS.titleInput, TEST_SCRIPTS.script1.title);

    // Button should be disabled
    await expect(page.locator(SELECTORS.addScriptButton)).toBeDisabled();
  });

  test("should validate both fields are required", async ({ page }) => {
    // Both fields empty
    await expect(page.locator(SELECTORS.addScriptButton)).toBeDisabled();

    // Fill only title
    await page.fill(SELECTORS.titleInput, TEST_SCRIPTS.script1.title);
    await expect(page.locator(SELECTORS.addScriptButton)).toBeDisabled();

    // Clear title and fill only description
    await page.fill(SELECTORS.titleInput, "");
    await page.fill(
      SELECTORS.descriptionInput,
      TEST_SCRIPTS.script1.description
    );
    await expect(page.locator(SELECTORS.addScriptButton)).toBeDisabled();

    // Fill both fields
    await page.fill(SELECTORS.titleInput, TEST_SCRIPTS.script1.title);
    await expect(page.locator(SELECTORS.addScriptButton)).toBeEnabled();
  });

  test("should successfully add a new script", async ({ page }) => {
    // Add script
    await addScript(page, TEST_SCRIPTS.script1);

    // Verify script appears in the list
    await expect(
      page.locator(SELECTORS.scriptCard).filter({
        hasText: TEST_SCRIPTS.script1.title,
      })
    ).toBeVisible();

    // Verify script content
    const scriptCard = page
      .locator(SELECTORS.scriptCard)
      .filter({ hasText: TEST_SCRIPTS.script1.title });
    await expect(scriptCard.locator(SELECTORS.scriptTitle)).toContainText(
      TEST_SCRIPTS.script1.title
    );
    await expect(scriptCard.locator(SELECTORS.scriptDescription)).toContainText(
      TEST_SCRIPTS.script1.description
    );
  });

  test("should clear form fields after successful submission", async ({
    page,
  }) => {
    // Add script
    await addScript(page, TEST_SCRIPTS.script1);

    // Verify form is cleared
    await expect(page.locator(SELECTORS.titleInput)).toHaveValue("");
    await expect(page.locator(SELECTORS.descriptionInput)).toHaveValue("");
  });

  test("should add multiple scripts", async ({ page }) => {
    // Add first script
    await addScript(page, TEST_SCRIPTS.script1);
    await page.waitForTimeout(1000);

    // Add second script
    await addScript(page, TEST_SCRIPTS.script2);
    await page.waitForTimeout(1000);

    // Verify both scripts appear
    await expect(
      page.locator(SELECTORS.scriptCard).filter({
        hasText: TEST_SCRIPTS.script1.title,
      })
    ).toBeVisible();
    await expect(
      page.locator(SELECTORS.scriptCard).filter({
        hasText: TEST_SCRIPTS.script2.title,
      })
    ).toBeVisible();

    // Verify script count
    const scriptCards = page.locator(SELECTORS.scriptCard);
    await expect(scriptCards).toHaveCount(2);
  });

  test("should handle special characters in script data", async ({ page }) => {
    const specialScript = {
      title: "API Test with @#$%^&*(){}[]",
      description: "Testing with special chars: !@#$%^&*()_+-={}[]|;':\",./<>?",
    };

    await addScript(page, specialScript);

    // Verify script with special characters appears
    const scriptCard = page
      .locator(SELECTORS.scriptCard)
      .filter({ hasText: specialScript.title });
    await expect(scriptCard).toBeVisible();
    await expect(scriptCard.locator(SELECTORS.scriptTitle)).toContainText(
      specialScript.title
    );
  });

  test("should trim whitespace from inputs", async ({ page }) => {
    const scriptWithSpaces = {
      title: "  " + TEST_SCRIPTS.script1.title + "  ",
      description: "  " + TEST_SCRIPTS.script1.description + "  ",
    };

    await addScript(page, scriptWithSpaces);

    // Verify script appears with trimmed content
    const scriptCard = page
      .locator(SELECTORS.scriptCard)
      .filter({ hasText: TEST_SCRIPTS.script1.title });
    await expect(scriptCard).toBeVisible();
    await expect(scriptCard.locator(SELECTORS.scriptTitle)).toContainText(
      TEST_SCRIPTS.script1.title
    );
  });
});
