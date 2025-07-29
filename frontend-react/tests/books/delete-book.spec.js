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

	test('should show confirmation modal when clicking delete button', async ({ page }) => {
		const bookCard = page.locator(SELECTORS.bookCard).first();

		// Click delete button
		await bookCard.locator(SELECTORS.deleteButton).click();

		// Should show confirmation modal
		await expect(page.locator(SELECTORS.deleteModal)).toBeVisible();

		// Should show book title in modal
		await expect(page.locator(`text=${TEST_BOOKS.book1.title}`)).toBeVisible();

		// Should show confirmation buttons
		await expect(page.locator(SELECTORS.confirmDeleteButton)).toBeVisible();
		await expect(page.locator(SELECTORS.cancelDeleteButton)).toBeVisible();
	});

	test('should successfully delete book after confirmation', async ({ page }) => {
		const bookCard = page.locator(SELECTORS.bookCard).first();

		// Click delete button
		await bookCard.locator(SELECTORS.deleteButton).click();

		// Confirm deletion
		await page.locator(SELECTORS.confirmDeleteButton).click();

		// Book should be removed from list
		await expect(page.locator(`text=${TEST_BOOKS.book1.title}`)).not.toBeVisible();

		// Should show empty state
		await expect(page.locator(SELECTORS.emptyState)).toBeVisible();

		// Modal should be closed
		await expect(page.locator(SELECTORS.deleteModal)).not.toBeVisible();
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

	test('should close modal when clicking outside', async ({ page }) => {
		const bookCard = page.locator(SELECTORS.bookCard).first();

		// Click delete button
		await bookCard.locator(SELECTORS.deleteButton).click();

		// Should show modal
		await expect(page.locator(SELECTORS.deleteModal)).toBeVisible();

		// Click outside modal (on backdrop)
		await page.click('body', { position: { x: 10, y: 10 } });

		// Modal should close
		await expect(page.locator(SELECTORS.deleteModal)).not.toBeVisible();

		// Book should still be visible
		await expect(page.locator(`text=${TEST_BOOKS.book1.title}`)).toBeVisible();
	});

	test('should show correct confirmation message', async ({ page }) => {
		const bookCard = page.locator(SELECTORS.bookCard).first();

		// Click delete button
		await bookCard.locator(SELECTORS.deleteButton).click();

		// Should show confirmation text with book title
		await expect(page.locator('text=Are you sure you want to delete')).toBeVisible();
		await expect(page.locator(`text="${TEST_BOOKS.book1.title}"`)).toBeVisible();
	});

	test('should disable buttons during delete operation', async ({ page }) => {
		const bookCard = page.locator(SELECTORS.bookCard).first();

		// Click delete button
		await bookCard.locator(SELECTORS.deleteButton).click();

		// Click confirm delete
		await page.locator(SELECTORS.confirmDeleteButton).click();

		// Buttons should be disabled during loading
		// Note: This test might need adjustment based on actual implementation
		await expect(bookCard.locator(SELECTORS.deleteButton)).toBeDisabled();
	});

	test('should handle multiple books deletion', async ({ page }) => {
		// Add more books
		await addBook(page, TEST_BOOKS.book2);
		await addBook(page, TEST_BOOKS.book3);

		// Should have 3 books
		await expect(page.locator(SELECTORS.bookCard)).toHaveCount(3);

		// Delete first book
		const firstCard = page.locator(SELECTORS.bookCard).first();
		await firstCard.locator(SELECTORS.deleteButton).click();
		await page.locator(SELECTORS.confirmDeleteButton).click();

		// Should have 2 books left
		await expect(page.locator(SELECTORS.bookCard)).toHaveCount(2);

		// Other books should still be visible
		await expect(page.locator(`text=${TEST_BOOKS.book2.title}`)).toBeVisible();
		await expect(page.locator(`text=${TEST_BOOKS.book3.title}`)).toBeVisible();
	});

	test('should delete correct book when multiple books exist', async ({ page }) => {
		// Add another book
		await addBook(page, TEST_BOOKS.book2);

		// Delete the second book (book2)
		const secondCard = page.locator(SELECTORS.bookCard).last();
		await secondCard.locator(SELECTORS.deleteButton).click();

		// Should show correct book title in confirmation
		await expect(page.locator(`text=${TEST_BOOKS.book2.title}`)).toBeVisible();

		// Confirm deletion
		await page.locator(SELECTORS.confirmDeleteButton).click();

		// book2 should be gone, book1 should remain
		await expect(page.locator(`text=${TEST_BOOKS.book2.title}`)).not.toBeVisible();
		await expect(page.locator(`text=${TEST_BOOKS.book1.title}`)).toBeVisible();
	});

	test('should show loading state during deletion', async ({ page }) => {
		const bookCard = page.locator(SELECTORS.bookCard).first();

		// Click delete button
		await bookCard.locator(SELECTORS.deleteButton).click();

		// Confirm deletion
		await page.locator(SELECTORS.confirmDeleteButton).click();

		// Should show loading state (this might need adjustment based on implementation)
		// The loading state might be on the button or card
		await expect(page.locator('text=Deleting..., .loading')).toBeVisible();
	});

	test('should return to empty state after deleting last book', async ({ page }) => {
		// Delete the only book
		const bookCard = page.locator(SELECTORS.bookCard).first();
		await bookCard.locator(SELECTORS.deleteButton).click();
		await page.locator(SELECTORS.confirmDeleteButton).click();

		// Should show empty state
		await expect(page.locator(SELECTORS.emptyState)).toBeVisible();
		await expect(page.locator('text=📚 Your Library is Empty')).toBeVisible();

		// Collection title should not be visible
		await expect(page.locator('text=Your Book Collection')).not.toBeVisible();
	});

	test('should handle ESC key to close modal', async ({ page }) => {
		const bookCard = page.locator(SELECTORS.bookCard).first();

		// Click delete button
		await bookCard.locator(SELECTORS.deleteButton).click();

		// Should show modal
		await expect(page.locator(SELECTORS.deleteModal)).toBeVisible();

		// Press ESC key
		await page.keyboard.press('Escape');

		// Modal should close
		await expect(page.locator(SELECTORS.deleteModal)).not.toBeVisible();

		// Book should still be visible
		await expect(page.locator(`text=${TEST_BOOKS.book1.title}`)).toBeVisible();
	});
});
