const { test, expect } = require('@playwright/test');
const { TEST_CREDENTIALS, SELECTORS, login, logout, waitForPageLoad } = require('../helpers');

test.describe('Authentication Flow', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await waitForPageLoad(page);
	});

	test('should display login form by default', async ({ page }) => {
		// Should show login form elements
		await expect(page.locator(SELECTORS.emailInput)).toBeVisible();
		await expect(page.locator(SELECTORS.passwordInput)).toBeVisible();
		await expect(page.locator(SELECTORS.loginButton)).toBeVisible();

		// Should show correct title
		await expect(page.locator('text=Welcome Back')).toBeVisible();
		await expect(page.locator('text=Sign in to access your book catalog')).toBeVisible();
	});

	test('should show protected content after login', async ({ page }) => {
		await login(page);

		// Should show dashboard content
		await expect(page.locator('text=Add New Book')).toBeVisible();
		await expect(page.locator('text=Your Book Collection')).toBeVisible();

		// Should show user info in header
		await expect(page.locator(SELECTORS.welcomeUser)).toContainText(TEST_CREDENTIALS.email);
		await expect(page.locator(SELECTORS.logoutButton)).toBeVisible();
	});

	test('should logout successfully', async ({ page }) => {
		// Login first
		await login(page);

		// Verify we're logged in
		await expect(page.locator(SELECTORS.welcomeUser)).toBeVisible();

		// Logout
		await logout(page);

		// Should be back to login form
		await expect(page.locator(SELECTORS.emailInput)).toBeVisible();
		await expect(page.locator('text=Welcome Back')).toBeVisible();

		// User info should be gone
		await expect(page.locator(SELECTORS.welcomeUser)).not.toBeVisible();
		await expect(page.locator(SELECTORS.logoutButton)).not.toBeVisible();
	});

	test('should maintain login state on page refresh', async ({ page }) => {
		await login(page);

		// Verify we're logged in
		await expect(page.locator(SELECTORS.welcomeUser)).toBeVisible();

		// Refresh page
		await page.reload();
		await waitForPageLoad(page);

		// Should still be logged in
		await expect(page.locator(SELECTORS.welcomeUser)).toBeVisible();
		await expect(page.locator('text=Add New Book')).toBeVisible();
	});

	test('should redirect to login when accessing protected route without authentication', async ({ page }) => {
		// Make sure we're not logged in
		await page.goto('/');

		// Should show login form (not dashboard)
		await expect(page.locator(SELECTORS.emailInput)).toBeVisible();
		await expect(page.locator('text=Welcome Back')).toBeVisible();

		// Should not show dashboard content
		await expect(page.locator('text=Add New Book')).not.toBeVisible();
	});

	test('should clear form after logout', async ({ page }) => {
		await login(page);
		await logout(page);

		// Form fields should be empty
		await expect(page.locator(SELECTORS.emailInput)).toHaveValue('');
		await expect(page.locator(SELECTORS.passwordInput)).toHaveValue('');
	});

	test('should show correct welcome message with user email', async ({ page }) => {
		await login(page);

		const welcomeText = await page.locator(SELECTORS.welcomeUser).textContent();
		expect(welcomeText).toContain('Hello');
		expect(welcomeText).toContain(TEST_CREDENTIALS.email);
	});

	test('should show app title in header', async ({ page }) => {
		// Check title before login
		await expect(page.locator('text=📚 Book Catalog')).toBeVisible();

		// Check title after login
		await login(page);
		await expect(page.locator('text=📚 Book Catalog')).toBeVisible();
	});
});
