const { test, expect } = require('@playwright/test');
const { TEST_BOOKS, SELECTORS, login, addBook, waitForPageLoad } = require('../helpers');

test.describe('Books - Edit Book', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await login(page);
		await waitForPageLoad(page);

		// Add a book to edit
		await addBook(page, TEST_BOOKS.book1);
	});

	test('should enter edit mode when clicking edit button', async ({ page }) => {
		const bookCard = page.locator(SELECTORS.bookCard).first();

		// Click edit button
		await bookCard.locator(SELECTORS.editButton).click();

		// Should show editable inputs
		await expect(bookCard.locator('.editable-title')).toBeVisible();
		await expect(bookCard.locator('.editable-author')).toBeVisible();

		// Should show save and cancel buttons
		await expect(bookCard.locator(SELECTORS.saveButton)).toBeVisible();
		await expect(bookCard.locator(SELECTORS.cancelButton)).toBeVisible();

		// Should hide edit and delete buttons
		await expect(bookCard.locator(SELECTORS.editButton)).not.toBeVisible();
		await expect(bookCard.locator(SELECTORS.deleteButton)).not.toBeVisible();
	});

	test('should validate required fields during edit', async ({ page }) => {
		const bookCard = page.locator(SELECTORS.bookCard).first();

		// Enter edit mode
		await bookCard.locator(SELECTORS.editButton).click();

		// Clear title field
		await bookCard.locator('.editable-title').fill('');

		// Save button should be disabled
		await expect(bookCard.locator(SELECTORS.saveButton)).toBeDisabled();

		// Clear author field too
		await bookCard.locator('.editable-author').fill('');

		// Save button should still be disabled
		await expect(bookCard.locator(SELECTORS.saveButton)).toBeDisabled();
	});

	test('should handle whitespace in edit fields', async ({ page }) => {
		const bookCard = page.locator(SELECTORS.bookCard).first();

		// Enter edit mode
		await bookCard.locator(SELECTORS.editButton).click();

		// Fill with whitespace only
		await bookCard.locator('.editable-title').fill('   ');
		await bookCard.locator('.editable-author').fill('   ');

		// Save button should be disabled
		await expect(bookCard.locator(SELECTORS.saveButton)).toBeDisabled();
	});

	test('should apply edit mode styling', async ({ page }) => {
		const bookCard = page.locator(SELECTORS.bookCard).first();

		// Enter edit mode
		await bookCard.locator(SELECTORS.editButton).click();

		// Card should have editing class
		await expect(bookCard).toHaveClass(/editing/);
	});

	test('should handle multiple books in edit mode', async ({ page }) => {
		// Add another book
		await addBook(page, TEST_BOOKS.book2);

		const firstCard = page.locator(SELECTORS.bookCard).first();
		const secondCard = page.locator(SELECTORS.bookCard).last();

		// Enter edit mode for first book
		await firstCard.locator(SELECTORS.editButton).click();

		// First card should be in edit mode
		await expect(firstCard.locator('.editable-title')).toBeVisible();

		// Second card should still be in normal mode
		await expect(secondCard.locator(SELECTORS.editButton)).toBeVisible();
		await expect(secondCard.locator('.editable-title')).not.toBeVisible();
	});
});
