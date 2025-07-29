const { test, expect } = require('@playwright/test');
const { TEST_CREDENTIALS, SELECTORS, login, logout, waitForPageLoad } = require('../helpers');

test.describe('Authentication - Login', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await waitForPageLoad(page);
	});

	test('should successfully login with valid credentials', async ({ page }) => {
		// Fill login form
		await page.fill(SELECTORS.emailInput, TEST_CREDENTIALS.email);
		await page.fill(SELECTORS.passwordInput, TEST_CREDENTIALS.password);

		// Submit login
		await page.click(SELECTORS.loginButton);

		// Verify successful login
		await expect(page.locator(SELECTORS.welcomeUser)).toBeVisible();
		await expect(page.locator(SELECTORS.welcomeUser)).toContainText(TEST_CREDENTIALS.email);
		await expect(page.locator(SELECTORS.logoutButton)).toBeVisible();

		// Verify we're on dashboard
		await expect(page.locator('text=Add New Book')).toBeVisible();
	});

	test('should show error for invalid email', async ({ page }) => {
		await page.fill(SELECTORS.emailInput, 'invalid@email.com');
		await page.fill(SELECTORS.passwordInput, TEST_CREDENTIALS.password);
		await page.click(SELECTORS.loginButton);

		// Should show error message
		await expect(page.locator(SELECTORS.errorMessage)).toBeVisible();

		// Should still be on login page
		await expect(page.locator(SELECTORS.emailInput)).toBeVisible();
	});

	test('should show error for invalid password', async ({ page }) => {
		await page.fill(SELECTORS.emailInput, TEST_CREDENTIALS.email);
		await page.fill(SELECTORS.passwordInput, 'wrongpassword');
		await page.click(SELECTORS.loginButton);

		// Should show error message
		await expect(page.locator(SELECTORS.errorMessage)).toBeVisible();

		// Should still be on login page
		await expect(page.locator(SELECTORS.emailInput)).toBeVisible();
	});

	test('should validate email format', async ({ page }) => {
		await page.fill(SELECTORS.emailInput, 'invalid-email');
		await page.fill(SELECTORS.passwordInput, TEST_CREDENTIALS.password);
		await page.click(SELECTORS.loginButton);

		// Should show email validation error
		await expect(page.locator('text=Please enter a valid email address')).toBeVisible();
	});

	test('should validate password minimum length', async ({ page }) => {
		await page.fill(SELECTORS.emailInput, TEST_CREDENTIALS.email);
		await page.fill(SELECTORS.passwordInput, '123');
		await page.click(SELECTORS.loginButton);

		// Should show password validation error
		await expect(page.locator('text=Password must be at least 6 characters')).toBeVisible();
	});

	test('should show error for empty fields', async ({ page }) => {
		// Try to submit empty form
		await page.click(SELECTORS.loginButton);

		// Should show validation errors
		await expect(page.locator('text=Email is required')).toBeVisible();
		await expect(page.locator('text=Password is required')).toBeVisible();
	});

	test('should show loading state during login', async ({ page }) => {
		await page.fill(SELECTORS.emailInput, TEST_CREDENTIALS.email);
		await page.fill(SELECTORS.passwordInput, TEST_CREDENTIALS.password);

		// Click login and immediately check for loading state
		await page.click(SELECTORS.loginButton);

		// Should show loading text
		await expect(page.locator('text=Signing in...')).toBeVisible();
	});

	test('should disable login button when loading', async ({ page }) => {
		await page.fill(SELECTORS.emailInput, TEST_CREDENTIALS.email);
		await page.fill(SELECTORS.passwordInput, TEST_CREDENTIALS.password);

		await page.click(SELECTORS.loginButton);

		// Button should be disabled during loading
		await expect(page.locator(SELECTORS.loginButton)).toBeDisabled();
	});
});
