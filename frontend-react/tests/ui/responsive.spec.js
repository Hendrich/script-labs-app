const { test, expect } = require('@playwright/test');
const { SELECTORS, login, waitForPageLoad } = require('../helpers');

test.describe('UI - Responsive Design', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await waitForPageLoad(page);
	});

	test('should display correctly on desktop', async ({ page }) => {
		// Set desktop viewport
		await page.setViewportSize({ width: 1920, height: 1080 });

		// Check header layout
		await expect(page.locator('header')).toBeVisible();
		await expect(page.locator('text=📚 Book Catalog')).toBeVisible();

		// Check main content area
		await expect(page.locator('main')).toBeVisible();

		// Login to check dashboard
		await login(page);

		// Check form layout
		await expect(page.locator('.book-form')).toBeVisible();
		await expect(page.locator('.form-row')).toBeVisible();
	});

	test('should display correctly on tablet', async ({ page }) => {
		// Set tablet viewport (iPad)
		await page.setViewportSize({ width: 768, height: 1024 });

		// Check header is still visible
		await expect(page.locator('header')).toBeVisible();
		await expect(page.locator('text=📚 Book Catalog')).toBeVisible();

		// Login to check dashboard
		await login(page);

		// Form should be responsive
		await expect(page.locator('.book-form')).toBeVisible();

		// Check if form adapts to smaller screen
		const formWidth = await page.locator('.book-form').boundingBox();
		expect(formWidth.width).toBeLessThanOrEqual(768);
	});

	test('should display correctly on mobile', async ({ page }) => {
		// Set mobile viewport (iPhone)
		await page.setViewportSize({ width: 375, height: 667 });

		// Check header is still visible
		await expect(page.locator('header')).toBeVisible();
		await expect(page.locator('text=📚 Book Catalog')).toBeVisible();

		// Login form should be responsive
		await expect(page.locator('.auth-form')).toBeVisible();

		// Login to check dashboard
		await login(page);

		// Form should stack on mobile
		await expect(page.locator('.book-form')).toBeVisible();

		const formWidth = await page.locator('.book-form').boundingBox();
		expect(formWidth.width).toBeLessThanOrEqual(375);
	});

	test('should have responsive book grid', async ({ page }) => {
		await login(page);

		// Add some books first (you might need to implement this based on your helper functions)
		await page.fill(SELECTORS.titleInput, 'Test Book 1');
		await page.fill(SELECTORS.authorInput, 'Test Author 1');
		await page.click(SELECTORS.addBookButton);

		await page.waitForTimeout(1000); // Wait for book to be added

		// Test desktop layout
		await page.setViewportSize({ width: 1920, height: 1080 });
		await expect(page.locator('.book-grid')).toBeVisible();

		// Test tablet layout
		await page.setViewportSize({ width: 768, height: 1024 });
		await expect(page.locator('.book-grid')).toBeVisible();

		// Test mobile layout
		await page.setViewportSize({ width: 375, height: 667 });
		await expect(page.locator('.book-grid')).toBeVisible();
	});

	test('should handle responsive navigation', async ({ page }) => {
		await login(page);

		// Test on different screen sizes
		const viewports = [
			{ width: 1920, height: 1080 }, // Desktop
			{ width: 768, height: 1024 },  // Tablet
			{ width: 375, height: 667 }    // Mobile
		];

		for (const viewport of viewports) {
			await page.setViewportSize(viewport);

			// Navigation should always be visible
			await expect(page.locator('nav')).toBeVisible();
			await expect(page.locator(SELECTORS.welcomeUser)).toBeVisible();
			await expect(page.locator(SELECTORS.logoutButton)).toBeVisible();
		}
	});

	test('should maintain usability on small screens', async ({ page }) => {
		// Set very small mobile viewport
		await page.setViewportSize({ width: 320, height: 568 });

		// Should still be able to use login form
		await expect(page.locator(SELECTORS.emailInput)).toBeVisible();
		await expect(page.locator(SELECTORS.passwordInput)).toBeVisible();
		await expect(page.locator(SELECTORS.loginButton)).toBeVisible();

		// Buttons should be touchable (minimum 44px touch target)
		const buttonHeight = await page.locator(SELECTORS.loginButton).boundingBox();
		expect(buttonHeight.height).toBeGreaterThanOrEqual(40);
	});

	test('should handle text overflow properly', async ({ page }) => {
		await page.setViewportSize({ width: 320, height: 568 });
		await login(page);

		// Add book with very long title
		const longTitle = 'This is a Very Long Book Title That Should Test Text Overflow Behavior';
		const longAuthor = 'An Author With a Very Long Name';

		await page.fill(SELECTORS.titleInput, longTitle);
		await page.fill(SELECTORS.authorInput, longAuthor);
		await page.click(SELECTORS.addBookButton);

		await page.waitForTimeout(1000);

		// Text should not overflow container
		const bookCard = page.locator(SELECTORS.bookCard).first();
		const cardBox = await bookCard.boundingBox();
		const titleBox = await bookCard.locator(SELECTORS.bookTitle).boundingBox();

		expect(titleBox.width).toBeLessThanOrEqual(cardBox.width);
	});

	test('should maintain proper spacing on all screen sizes', async ({ page }) => {
		await login(page);

		const viewports = [
			{ width: 1920, height: 1080 },
			{ width: 768, height: 1024 },
			{ width: 375, height: 667 }
		];

		for (const viewport of viewports) {
			await page.setViewportSize(viewport);

			// Header should have proper spacing
			const header = page.locator('header');
			await expect(header).toBeVisible();

			// Main content should be visible and have some width
			const main = page.locator('main');
			const mainBox = await main.boundingBox();
			expect(mainBox.width).toBeGreaterThan(200); // Content should have reasonable width
			expect(mainBox.height).toBeGreaterThan(100); // Content should have reasonable height
		}
	});
});
