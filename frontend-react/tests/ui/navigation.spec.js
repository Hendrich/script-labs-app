const { test, expect } = require('@playwright/test');
const { TEST_CREDENTIALS, SELECTORS, login, waitForPageLoad } = require('../helpers');

test.describe('UI - Navigation and Interaction', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await waitForPageLoad(page);
	});

	test('should display app title correctly', async ({ page }) => {
		// Check app title in header
		await expect(page.locator('h1')).toContainText('📚 Book Catalog');

		// Check page title
		await expect(page).toHaveTitle(/Book Catalog/);
	});

	test('should show correct header content before login', async ({ page }) => {
		// Should show app title
		await expect(page.locator('text=📚 Book Catalog')).toBeVisible();

		// Should not show navigation for unauthenticated user
		await expect(page.locator('nav')).not.toBeVisible();
		await expect(page.locator(SELECTORS.logoutButton)).not.toBeVisible();
	});

	test('should show correct header content after login', async ({ page }) => {
		await login(page);

		// Should still show app title
		await expect(page.locator('text=📚 Book Catalog')).toBeVisible();

		// Should show user navigation
		await expect(page.locator('nav')).toBeVisible();
		await expect(page.locator(SELECTORS.welcomeUser)).toBeVisible();
		await expect(page.locator(SELECTORS.logoutButton)).toBeVisible();
	});

	test('should handle form focus states', async ({ page }) => {
		// Test email input focus
		await page.focus(SELECTORS.emailInput);

		// Check if input is focused
		const focusedElement = await page.evaluate(() => document.activeElement.id);
		expect(focusedElement).toBe('email');

		// Tab to password field
		await page.keyboard.press('Tab');

		const passwordFocused = await page.evaluate(() => document.activeElement.id);
		expect(passwordFocused).toBe('password');
	});

	test('should handle keyboard navigation', async ({ page }) => {
		// Start at email field
		await page.focus(SELECTORS.emailInput);

		// Tab through form elements
		await page.keyboard.press('Tab'); // Password field
		await page.keyboard.press('Tab'); // Login button

		// Should be able to submit with Enter
		await page.fill(SELECTORS.emailInput, TEST_CREDENTIALS.email);
		await page.fill(SELECTORS.passwordInput, TEST_CREDENTIALS.password);
		await page.focus(SELECTORS.loginButton);
		await page.keyboard.press('Enter');

		// Should login successfully
		await expect(page.locator(SELECTORS.welcomeUser)).toBeVisible();
	});

	test('should handle button states correctly', async ({ page }) => {
		await login(page);

		// Add book button should be disabled initially
		await expect(page.locator(SELECTORS.addBookButton)).toBeDisabled();

		// Should enable when both fields have content
		await page.fill(SELECTORS.titleInput, 'Test Book');
		await page.fill(SELECTORS.authorInput, 'Test Author');

		await expect(page.locator(SELECTORS.addBookButton)).toBeEnabled();

		// Should disable again when field is cleared
		await page.fill(SELECTORS.titleInput, '');

		await expect(page.locator(SELECTORS.addBookButton)).toBeDisabled();
	});

	test('should provide visual feedback for interactions', async ({ page }) => {
		// Test button hover states (if CSS supports it)
		await page.hover(SELECTORS.loginButton);

		// Test input validation states
		await page.fill(SELECTORS.emailInput, 'invalid-email');
		await page.click(SELECTORS.loginButton);

		// Should show error styling
		await expect(page.locator(`${SELECTORS.emailInput}.error`)).toBeVisible();
	});

	test('should handle form submission with Enter key', async ({ page }) => {
		await page.fill(SELECTORS.emailInput, TEST_CREDENTIALS.email);
		await page.fill(SELECTORS.passwordInput, TEST_CREDENTIALS.password);

		// Submit form with Enter key
		await page.keyboard.press('Enter');

		// Should login successfully
		await expect(page.locator(SELECTORS.welcomeUser)).toBeVisible();
	});

	test('should maintain proper tab order', async ({ page }) => {
		await login(page);

		// Start from title input
		await page.focus(SELECTORS.titleInput);

		let focusedElement = await page.evaluate(() => document.activeElement.id);
		expect(focusedElement).toBe('title');

		// Tab to author input
		await page.keyboard.press('Tab');
		focusedElement = await page.evaluate(() => document.activeElement.id);
		expect(focusedElement).toBe('author');

		// Tab to add book button
		await page.keyboard.press('Tab');
		const buttonFocused = await page.evaluate(() =>
			document.activeElement.textContent.includes('Add Book')
		);
		expect(buttonFocused).toBe(true);
	});

	test('should show loading indicators appropriately', async ({ page }) => {
		await page.fill(SELECTORS.emailInput, TEST_CREDENTIALS.email);
		await page.fill(SELECTORS.passwordInput, TEST_CREDENTIALS.password);

		// Click login
		await page.click(SELECTORS.loginButton);

		// Should show loading text briefly
		await expect(page.locator('text=Signing in...')).toBeVisible();

		// After login, test book addition loading
		await page.waitForSelector(SELECTORS.titleInput);
		await page.fill(SELECTORS.titleInput, 'Test Book');
		await page.fill(SELECTORS.authorInput, 'Test Author');
		await page.click(SELECTORS.addBookButton);

		// Should show adding book loading
		await expect(page.locator('text=Adding Book...')).toBeVisible();
	});

	test('should handle accessibility features', async ({ page }) => {
		// Check for proper labels
		await expect(page.locator('label[for="email"]')).toBeVisible();
		await expect(page.locator('label[for="password"]')).toBeVisible();

		// Check required attributes
		const emailInput = page.locator(SELECTORS.emailInput);
		await expect(emailInput).toHaveAttribute('required');
		await expect(page.locator(SELECTORS.passwordInput)).toHaveAttribute('required');

		// Trigger error to check aria-describedby
		await page.fill(SELECTORS.emailInput, 'invalid-email');
		await page.click(SELECTORS.loginButton);

		// Check ARIA attributes after error
		await expect(emailInput).toHaveAttribute('aria-describedby', 'email-error');
	});

	test('should handle error message display', async ({ page }) => {
		// Trigger validation error
		await page.fill(SELECTORS.emailInput, 'invalid-email');
		await page.click(SELECTORS.loginButton);

		// Error should be visible and properly associated
		const errorMessage = page.locator('#email-error');
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toContainText('Please enter a valid email address');
	});

	test('should clear error states on input change', async ({ page }) => {
		// Create error state
		await page.fill(SELECTORS.emailInput, 'invalid-email');
		await page.click(SELECTORS.loginButton);

		// Should show error
		await expect(page.locator('#email-error')).toBeVisible();

		// Fix the input
		await page.fill(SELECTORS.emailInput, TEST_CREDENTIALS.email);

		// Error should clear when valid input is entered
		await expect(page.locator('#email-error')).not.toBeVisible();
	});

	test('should handle navigation consistency', async ({ page }) => {
		await login(page);

		// User info should always be visible in header
		await expect(page.locator(SELECTORS.welcomeUser)).toBeVisible();

		// Logout should always be accessible
		await expect(page.locator(SELECTORS.logoutButton)).toBeVisible();

		// App title should always be clickable/visible
		await expect(page.locator('text=📚 Book Catalog')).toBeVisible();
	});
});
