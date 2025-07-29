const { test, expect } = require('@playwright/test');
const { TEST_BOOKS, SELECTORS, login, addBook, logout, waitForPageLoad, clearAllBooks } = require('../helpers');

test.describe('Integration - Full User Journey', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await waitForPageLoad(page);
	});

	test('should complete full user journey: login → add books → edit → delete → logout', async ({ page }) => {
		// Step 1: Login
		await login(page);
		await expect(page.locator(SELECTORS.welcomeUser)).toBeVisible();

		// Clear any existing books to ensure clean state
		await clearAllBooks(page);

		// Step 2: Verify empty state
		await expect(page.locator(SELECTORS.emptyState)).toBeVisible();
		await expect(page.locator('text=📚 Your Library is Empty')).toBeVisible();

		// Step 3: Add first book
		await addBook(page, TEST_BOOKS.book1);

		// Verify book appears and empty state disappears
		await expect(page.locator(SELECTORS.emptyState)).not.toBeVisible();
		await expect(page.locator('text=Your Book Collection')).toBeVisible();
		await expect(page.locator(`text=${TEST_BOOKS.book1.title}`)).toBeVisible();

		// Step 4: Add second book
		await addBook(page, TEST_BOOKS.book2);

		// Verify both books are visible
		await expect(page.locator(SELECTORS.bookCard)).toHaveCount(2);

		// Step 5: Edit first book
		const firstCard = page.locator(SELECTORS.bookCard).first();
		await firstCard.locator(SELECTORS.editButton).click();

		const updatedTitle = 'Updated Title';
		await firstCard.locator('.editable-title').fill(updatedTitle);
		await firstCard.locator(SELECTORS.saveButton).click();

		// Verify edit was successful
		await expect(page.locator(`text=${updatedTitle}`)).toBeVisible();

		// Step 6: Delete second book
		const secondCard = page.locator(SELECTORS.bookCard).last();
		await secondCard.locator(SELECTORS.deleteButton).click();
		await page.locator(SELECTORS.confirmDeleteButton).click();

		// Verify deletion
		await expect(page.locator(SELECTORS.bookCard)).toHaveCount(1);
		await expect(page.locator(`text=${TEST_BOOKS.book2.title}`)).not.toBeVisible();

		// Step 7: Delete last book
		await firstCard.locator(SELECTORS.deleteButton).click();
		await page.locator(SELECTORS.confirmDeleteButton).click();

		// Verify back to empty state
		await expect(page.locator(SELECTORS.emptyState)).toBeVisible();

		// Step 8: Logout
		await logout(page);

		// Verify back to login screen
		await expect(page.locator(SELECTORS.emailInput)).toBeVisible();
		await expect(page.locator('text=Welcome Back')).toBeVisible();
	});

	test('should maintain data consistency across operations', async ({ page }) => {
		await login(page);

		// Add multiple books
		const books = [TEST_BOOKS.book1, TEST_BOOKS.book2, TEST_BOOKS.book3];

		for (const book of books) {
			await addBook(page, book);
		}

		// Verify all books are present
		await expect(page.locator(SELECTORS.bookCard)).toHaveCount(3);

		// Edit middle book
		const middleCard = page.locator(SELECTORS.bookCard).nth(1);
		await middleCard.locator(SELECTORS.editButton).click();

		const editedTitle = 'Edited Middle Book';
		await middleCard.locator('.editable-title').fill(editedTitle);
		await middleCard.locator(SELECTORS.saveButton).click();

		// Verify edit doesn't affect other books
		await expect(page.locator(`text=${books[0].title}`)).toBeVisible();
		await expect(page.locator(`text=${editedTitle}`)).toBeVisible();
		await expect(page.locator(`text=${books[2].title}`)).toBeVisible();

		// Delete first book
		const firstCard = page.locator(SELECTORS.bookCard).first();
		await firstCard.locator(SELECTORS.deleteButton).click();
		await page.locator(SELECTORS.confirmDeleteButton).click();

		// Verify correct book was deleted
		await expect(page.locator(SELECTORS.bookCard)).toHaveCount(2);
		await expect(page.locator(`text=${books[0].title}`)).not.toBeVisible();
		await expect(page.locator(`text=${editedTitle}`)).toBeVisible();
		await expect(page.locator(`text=${books[2].title}`)).toBeVisible();
	});

	test('should handle session persistence correctly', async ({ page }) => {
		await login(page);

		// Add a book
		await addBook(page, TEST_BOOKS.book1);

		// Refresh page
		await page.reload();
		await waitForPageLoad(page);

		// Should still be logged in
		await expect(page.locator(SELECTORS.welcomeUser)).toBeVisible();

		// Book should still be there
		await expect(page.locator(`text=${TEST_BOOKS.book1.title}`)).toBeVisible();
	});

	test('should handle rapid consecutive operations', async ({ page }) => {
		await login(page);

		// Rapidly add multiple books
		const books = [TEST_BOOKS.book1, TEST_BOOKS.book2, TEST_BOOKS.book3];

		for (const book of books) {
			await page.fill(SELECTORS.titleInput, book.title);
			await page.fill(SELECTORS.authorInput, book.author);
			await page.click(SELECTORS.addBookButton);

			// Wait for form to reset before next operation
			await page.waitForFunction(() => {
				const titleInput = document.querySelector('#title');
				return titleInput && titleInput.value === '';
			});
		}

		// All books should be present
		await expect(page.locator(SELECTORS.bookCard)).toHaveCount(3);
	});

	test('should handle error recovery flow', async ({ page }) => {
		await login(page);

		// Try to add book with invalid data (empty fields)
		await page.click(SELECTORS.addBookButton);

		// Button should be disabled, no book should be added
		await expect(page.locator(SELECTORS.addBookButton)).toBeDisabled();
		await expect(page.locator(SELECTORS.emptyState)).toBeVisible();

		// Fix the data and add book successfully
		await addBook(page, TEST_BOOKS.book1);

		// Should work normally
		await expect(page.locator(`text=${TEST_BOOKS.book1.title}`)).toBeVisible();
	});

	test('should handle state transitions correctly', async ({ page }) => {
		await login(page);

		// State 1: Empty
		await expect(page.locator(SELECTORS.emptyState)).toBeVisible();
		await expect(page.locator('text=Your Book Collection')).not.toBeVisible();

		// State 2: Has books
		await addBook(page, TEST_BOOKS.book1);
		await expect(page.locator(SELECTORS.emptyState)).not.toBeVisible();
		await expect(page.locator('text=Your Book Collection')).toBeVisible();

		// State 3: Back to empty
		const bookCard = page.locator(SELECTORS.bookCard).first();
		await bookCard.locator(SELECTORS.deleteButton).click();
		await page.locator(SELECTORS.confirmDeleteButton).click();

		await expect(page.locator(SELECTORS.emptyState)).toBeVisible();
		await expect(page.locator('text=Your Book Collection')).not.toBeVisible();
	});

	test('should maintain UI consistency throughout journey', async ({ page }) => {
		await login(page);

		// Header should always be consistent
		await expect(page.locator('text=📚 Book Catalog')).toBeVisible();
		await expect(page.locator(SELECTORS.welcomeUser)).toBeVisible();
		await expect(page.locator(SELECTORS.logoutButton)).toBeVisible();

		// Add book
		await addBook(page, TEST_BOOKS.book1);

		// Header should still be consistent
		await expect(page.locator('text=📚 Book Catalog')).toBeVisible();
		await expect(page.locator(SELECTORS.welcomeUser)).toBeVisible();
		await expect(page.locator(SELECTORS.logoutButton)).toBeVisible();

		// During edit mode
		const bookCard = page.locator(SELECTORS.bookCard).first();
		await bookCard.locator(SELECTORS.editButton).click();

		// Header should still be consistent
		await expect(page.locator('text=📚 Book Catalog')).toBeVisible();
		await expect(page.locator(SELECTORS.welcomeUser)).toBeVisible();
		await expect(page.locator(SELECTORS.logoutButton)).toBeVisible();
	});

	test('should handle form validation throughout journey', async ({ page }) => {
		await login(page);

		// Test initial form validation
		await expect(page.locator(SELECTORS.addBookButton)).toBeDisabled();

		// Add valid book
		await addBook(page, TEST_BOOKS.book1);

		// Test edit validation
		const bookCard = page.locator(SELECTORS.bookCard).first();
		await bookCard.locator(SELECTORS.editButton).click();

		// Clear title
		await bookCard.locator('.editable-title').fill('');

		// Save should be disabled
		await expect(bookCard.locator(SELECTORS.saveButton)).toBeDisabled();

		// Fix and save
		await bookCard.locator('.editable-title').fill('Fixed Title');
		await expect(bookCard.locator(SELECTORS.saveButton)).toBeEnabled();
	});

	test('should handle complete workflow with multiple users simulation', async ({ page }) => {
		// Simulate User 1 session
		await login(page);
		await addBook(page, TEST_BOOKS.book1);
		await logout(page);

		// Simulate User 2 session (same user, new session)
		await login(page);

		// Should see previous book
		await expect(page.locator(`text=${TEST_BOOKS.book1.title}`)).toBeVisible();

		// Add another book
		await addBook(page, TEST_BOOKS.book2);

		// Should see both books
		await expect(page.locator(SELECTORS.bookCard)).toHaveCount(2);
	});
});
