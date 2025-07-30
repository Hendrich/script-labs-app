const { test, expect } = require('@playwright/test');
const { TEST_BOOKS, SELECTORS, login, addBook, waitForPageLoad, clearAllBooks } = require('../helpers');

test.describe('Books - Book List', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await login(page);
		await waitForPageLoad(page);
		// Clear all existing books to ensure test isolation
		await clearAllBooks(page);
	});

	test('should show empty state when no books exist', async ({ page }) => {
		// Should show empty state message
		await expect(page.locator(SELECTORS.emptyState)).toBeVisible();
		await expect(page.locator('text=📚 Your Library is Empty')).toBeVisible();
		await expect(page.locator('text=Start building your digital library by adding your first book above!')).toBeVisible();
	});
});
