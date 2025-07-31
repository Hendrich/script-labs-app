const { test, expect } = require("@playwright/test");
const {
  TEST_BOOKS,
  SELECTORS,
  login,
  addBook,
  waitForPageLoad,
  clearAllBooks,
} = require("../helpers");

test.describe("Books - Add New Book", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await login(page);
    await waitForPageLoad(page);
  });

  test("should validate title field is required", async ({ page }) => {
    // Leave title empty, fill author
    await page.fill(SELECTORS.authorInput, TEST_BOOKS.book1.author);

    // Button should be disabled
    await expect(page.locator(SELECTORS.addBookButton)).toBeDisabled();
  });

  test("should validate author field is required", async ({ page }) => {
    // Fill title, leave author empty
    await page.fill(SELECTORS.titleInput, TEST_BOOKS.book1.title);

    // Button should be disabled
    await expect(page.locator(SELECTORS.addBookButton)).toBeDisabled();
  });

  test("should disable button when both fields are empty", async ({ page }) => {
    // Ensure fields are empty
    await page.fill(SELECTORS.titleInput, "");
    await page.fill(SELECTORS.authorInput, "");

    // Button should be disabled
    await expect(page.locator(SELECTORS.addBookButton)).toBeDisabled();
  });

  test("should enable button when both fields have content", async ({
    page,
  }) => {
    const book = TEST_BOOKS.book1;

    // Fill both fields
    await page.fill(SELECTORS.titleInput, book.title);
    await page.fill(SELECTORS.authorInput, book.author);

    // Button should be enabled
    await expect(page.locator(SELECTORS.addBookButton)).toBeEnabled();
  });

  test("should show loading state when adding book", async ({ page }) => {
    const book = TEST_BOOKS.book1;

    await page.fill(SELECTORS.titleInput, book.title);
    await page.fill(SELECTORS.authorInput, book.author);

    // Click add book
    await page.click(SELECTORS.addBookButton);

    // Should show loading text (toleransi loading sangat cepat)
    const loading = page.locator("text=Adding Book...");
    await expect(loading).toBeVisible({ timeout: 1000 });
    await expect(loading).not.toBeVisible({ timeout: 2000 });
  });

  test("should not submit form with only whitespace", async ({ page }) => {
    // Fill with only spaces
    await page.fill(SELECTORS.titleInput, "   ");
    await page.fill(SELECTORS.authorInput, "   ");

    // Button should still be disabled
    await expect(page.locator(SELECTORS.addBookButton)).toBeDisabled();
  });

  test("should add multiple books successfully", async ({ page }) => {
    await clearAllBooks(page);
    // Add first book
    await addBook(page, TEST_BOOKS.book1);

    // Add second book
    await addBook(page, TEST_BOOKS.book2);

    // Verify both books are visible
    await expect(page.locator(`text=${TEST_BOOKS.book1.title}`)).toBeVisible();
    await expect(page.locator(`text=${TEST_BOOKS.book2.title}`)).toBeVisible();
  });

  test("should show form title correctly", async ({ page }) => {
    await expect(page.locator("text=Add New Book")).toBeVisible();
  });

  test("should have correct input placeholders", async ({ page }) => {
    await expect(page.locator(SELECTORS.titleInput)).toHaveAttribute(
      "placeholder",
      "Enter book title..."
    );
    await expect(page.locator(SELECTORS.authorInput)).toHaveAttribute(
      "placeholder",
      "Enter author name..."
    );
  });

  test("should focus on title input after form submission", async ({
    page,
  }) => {
    await clearAllBooks(page);
    await addBook(page, TEST_BOOKS.book1);

    // Wait a bit for focus to be applied
    await page.waitForTimeout(200);

    // Title input should be focused for next entry
    const focusedElement = await page.evaluate(() => document.activeElement.id);
    expect(focusedElement).toBe("title");
  });
});
