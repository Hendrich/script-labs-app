const { test, expect } = require('@playwright/test');
const { TEST_BOOKS, SELECTORS, login, addBook, waitForPageLoad } = require('../helpers');

test.describe('Books - Delete Book', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await login(page);
		await waitForPageLoad(page);

		// Add a book to delete
		await addBook(page, TEST_BOOKS.book1);
	});

	test('should cancel deletion and keep book', async ({ page }) => {
		const bookCard = page.locator(SELECTORS.bookCard).first();

		// Click delete button
		await bookCard.locator(SELECTORS.deleteButton).click();

		// Cancel deletion
		await page.locator(SELECTORS.cancelDeleteButton).click();

		// Book should still be visible
		await expect(page.locator(`text=${TEST_BOOKS.book1.title}`)).toBeVisible();

		// Modal should be closed
		await expect(page.locator(SELECTORS.deleteModal)).not.toBeVisible();
	});

	test('should show correct confirmation message', async ({ page }) => {
		const bookCard = page.locator(SELECTORS.bookCard).first();

		// Click delete button
		await bookCard.locator(SELECTORS.deleteButton).click();

		// Should show confirmation text with book title
		await expect(page.locator('text=Are you sure you want to delete')).toBeVisible();
		await expect(page.locator(`text="${TEST_BOOKS.book1.title}"`)).toBeVisible();
	});
});
