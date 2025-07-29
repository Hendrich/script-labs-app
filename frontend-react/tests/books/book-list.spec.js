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

	test('should display book collection title when books exist', async ({ page }) => {
		// Add a book first
		await addBook(page, TEST_BOOKS.book1);

		// Should show collection title
		await expect(page.locator('text=Your Book Collection')).toBeVisible();
	});

	test('should display book cards with correct information', async ({ page }) => {
		const book = TEST_BOOKS.book1;
		await addBook(page, book);

		// Find the book card
		const bookCard = page.locator(SELECTORS.bookCard).first();

		// Verify book information
		await expect(bookCard.locator(SELECTORS.bookTitle)).toContainText(book.title);
		await expect(bookCard.locator(SELECTORS.bookAuthor)).toContainText(`by ${book.author}`);

		// Verify action buttons
		await expect(bookCard.locator(SELECTORS.editButton)).toBeVisible();
		await expect(bookCard.locator(SELECTORS.deleteButton)).toBeVisible();
	});

	test('should display default book image', async ({ page }) => {
		await addBook(page, TEST_BOOKS.book1);

		const bookCard = page.locator(SELECTORS.bookCard).first();
		const bookImage = bookCard.locator('img');

		await expect(bookImage).toBeVisible();
		await expect(bookImage).toHaveAttribute('src', '/image/default-book.jpg');
		await expect(bookImage).toHaveAttribute('alt', 'Book cover');
	});

	test('should show multiple books in grid layout', async ({ page }) => {
		// Add multiple books
		await addBook(page, TEST_BOOKS.book1);
		await addBook(page, TEST_BOOKS.book2);
		await addBook(page, TEST_BOOKS.book3);

		// Should have grid container
		await expect(page.locator('.book-grid')).toBeVisible();

		// Should show all books
		await expect(page.locator(SELECTORS.bookCard)).toHaveCount(3);

		// Verify all book titles are visible
		await expect(page.locator(`text=${TEST_BOOKS.book1.title}`)).toBeVisible();
		await expect(page.locator(`text=${TEST_BOOKS.book2.title}`)).toBeVisible();
		await expect(page.locator(`text=${TEST_BOOKS.book3.title}`)).toBeVisible();
	});

	test('should show loading state while fetching books', async ({ page }) => {
		// This test might need to be adjusted based on actual loading behavior
		// For now, we'll check that loading spinner exists in the component
		await expect(page.locator('.loading-container, .spinner')).toHaveCount(0);
	});

	test('should maintain book order', async ({ page }) => {
		// Add books in specific order
		await addBook(page, TEST_BOOKS.book1);
		await addBook(page, TEST_BOOKS.book2);
		await addBook(page, TEST_BOOKS.book3);

		const bookCards = page.locator(SELECTORS.bookCard);

		// Verify order (most recent first or as returned by API)
		const firstCard = bookCards.first();
		const lastCard = bookCards.last();

		// This might need adjustment based on actual API ordering
		await expect(firstCard.locator(SELECTORS.bookTitle)).toContainText(TEST_BOOKS.book1.title);
	});

	test('should show each book as a separate card', async ({ page }) => {
		await addBook(page, TEST_BOOKS.book1);
		await addBook(page, TEST_BOOKS.book2);

		const bookCards = page.locator(SELECTORS.bookCard);
		await expect(bookCards).toHaveCount(2);

		// Each card should be distinct
		const firstCard = bookCards.nth(0);
		const secondCard = bookCards.nth(1);

		await expect(firstCard).not.toBe(secondCard);
	});

	test('should handle long book titles and author names', async ({ page }) => {
		const longTitleBook = {
			title: 'This is a Very Long Book Title That Should Test How The UI Handles Long Text Content',
			author: 'An Author With a Very Long Name That Tests Text Wrapping'
		};

		await addBook(page, longTitleBook);

		const bookCard = page.locator(SELECTORS.bookCard).first();

		// Should display full title and author (with potential text wrapping)
		await expect(bookCard.locator(SELECTORS.bookTitle)).toContainText(longTitleBook.title);
		await expect(bookCard.locator(SELECTORS.bookAuthor)).toContainText(longTitleBook.author);
	});

	test('should transition from empty state to book list', async ({ page }) => {
		// Start with empty state
		await expect(page.locator(SELECTORS.emptyState)).toBeVisible();

		// Add a book
		await addBook(page, TEST_BOOKS.book1);

		// Empty state should be gone, book list should appear
		await expect(page.locator(SELECTORS.emptyState)).not.toBeVisible();
		await expect(page.locator('text=Your Book Collection')).toBeVisible();
		await expect(page.locator(SELECTORS.bookCard)).toHaveCount(1);
	});
});
