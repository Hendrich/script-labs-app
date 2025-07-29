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

	test('should populate edit inputs with current book data', async ({ page }) => {
		const bookCard = page.locator(SELECTORS.bookCard).first();
		await bookCard.locator(SELECTORS.editButton).click();

		// Inputs should contain current book data
		await expect(bookCard.locator('.editable-title')).toHaveValue(TEST_BOOKS.book1.title);
		await expect(bookCard.locator('.editable-author')).toHaveValue(TEST_BOOKS.book1.author);
	});

	test('should successfully update book with new data', async ({ page }) => {
		const bookCard = page.locator(SELECTORS.bookCard).first();
		const updatedBook = {
			title: 'Updated Book Title',
			author: 'Updated Author Name'
		};

		// Enter edit mode
		await bookCard.locator(SELECTORS.editButton).click();

		// Update the book data
		await bookCard.locator('.editable-title').fill(updatedBook.title);
		await bookCard.locator('.editable-author').fill(updatedBook.author);

		// Save changes
		await bookCard.locator(SELECTORS.saveButton).click();

		// Should exit edit mode and show updated data
		await expect(bookCard.locator(SELECTORS.bookTitle)).toContainText(updatedBook.title);
		await expect(bookCard.locator(SELECTORS.bookAuthor)).toContainText(`by ${updatedBook.author}`);

		// Should show normal buttons again
		await expect(bookCard.locator(SELECTORS.editButton)).toBeVisible();
		await expect(bookCard.locator(SELECTORS.deleteButton)).toBeVisible();
	});

	test('should cancel edit and restore original data', async ({ page }) => {
		const bookCard = page.locator(SELECTORS.bookCard).first();
		const originalTitle = TEST_BOOKS.book1.title;
		const originalAuthor = TEST_BOOKS.book1.author;

		// Enter edit mode
		await bookCard.locator(SELECTORS.editButton).click();

		// Change the data
		await bookCard.locator('.editable-title').fill('Changed Title');
		await bookCard.locator('.editable-author').fill('Changed Author');

		// Cancel changes
		await bookCard.locator(SELECTORS.cancelButton).click();

		// Should show original data
		await expect(bookCard.locator(SELECTORS.bookTitle)).toContainText(originalTitle);
		await expect(bookCard.locator(SELECTORS.bookAuthor)).toContainText(`by ${originalAuthor}`);

		// Should exit edit mode
		await expect(bookCard.locator(SELECTORS.editButton)).toBeVisible();
		await expect(bookCard.locator('.editable-title')).not.toBeVisible();
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

	test('should show loading state during save', async ({ page }) => {
		const bookCard = page.locator(SELECTORS.bookCard).first();

		// Enter edit mode
		await bookCard.locator(SELECTORS.editButton).click();

		// Make changes
		await bookCard.locator('.editable-title').fill('New Title');

		// Click save
		await bookCard.locator(SELECTORS.saveButton).click();

		// Should show loading text
		await expect(page.locator('text=💾 Saving...')).toBeVisible();
	});

	test('should disable buttons during save operation', async ({ page }) => {
		const bookCard = page.locator(SELECTORS.bookCard).first();

		// Enter edit mode
		await bookCard.locator(SELECTORS.editButton).click();

		// Make changes
		await bookCard.locator('.editable-title').fill('New Title');

		// Click save
		await bookCard.locator(SELECTORS.saveButton).click();

		// Buttons should be disabled during loading
		await expect(bookCard.locator(SELECTORS.saveButton)).toBeDisabled();
		await expect(bookCard.locator(SELECTORS.cancelButton)).toBeDisabled();
	});

	test('should apply edit mode styling', async ({ page }) => {
		const bookCard = page.locator(SELECTORS.bookCard).first();

		// Enter edit mode
		await bookCard.locator(SELECTORS.editButton).click();

		// Card should have editing class
		await expect(bookCard).toHaveClass(/editing/);
	});

	test('should focus on title input when entering edit mode', async ({ page }) => {
		const bookCard = page.locator(SELECTORS.bookCard).first();

		// Enter edit mode
		await bookCard.locator(SELECTORS.editButton).click();

		// Title input should be focused
		const focusedElement = await page.evaluate(() => document.activeElement.className);
		expect(focusedElement).toContain('editable-title');
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
