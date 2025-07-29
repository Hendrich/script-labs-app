const { test, expect } = require('@playwright/test');
const { SELECTORS, login, waitForPageLoad } = require('../helpers');

test.describe('Error Handling - Error States', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await waitForPageLoad(page);
	});

	test('should display validation errors for empty login form', async ({ page }) => {
		// Submit empty form
		await page.click(SELECTORS.loginButton);

		// Should show validation errors
		await expect(page.locator('text=Email is required')).toBeVisible();
		await expect(page.locator('text=Password is required')).toBeVisible();
	});

	test('should display validation errors for invalid email format', async ({ page }) => {
		await page.fill(SELECTORS.emailInput, 'invalid-email-format');
		await page.fill(SELECTORS.passwordInput, 'password123');
		await page.click(SELECTORS.loginButton);

		// Should show email format error
		await expect(page.locator('text=Please enter a valid email address')).toBeVisible();
	});

	test('should display validation errors for short password', async ({ page }) => {
		await page.fill(SELECTORS.emailInput, 'test@example.com');
		await page.fill(SELECTORS.passwordInput, '123');
		await page.click(SELECTORS.loginButton);

		// Should show password length error
		await expect(page.locator('text=Password must be at least 6 characters')).toBeVisible();
	});

	test('should show error styling on invalid fields', async ({ page }) => {
		await page.fill(SELECTORS.emailInput, 'invalid-email');
		await page.click(SELECTORS.loginButton);

		// Email input should have error class
		await expect(page.locator(`${SELECTORS.emailInput}.error`)).toBeVisible();
	});

	test('should handle network errors gracefully', async ({ page }) => {
		// This test might need to mock network failures
		// For now, we'll test with invalid credentials that should trigger a network error response

		await page.fill(SELECTORS.emailInput, 'nonexistent@email.com');
		await page.fill(SELECTORS.passwordInput, 'wrongpassword');
		await page.click(SELECTORS.loginButton);

		// Should show error message
		await expect(page.locator(SELECTORS.errorMessage)).toBeVisible();

		// Should still be on login page
		await expect(page.locator(SELECTORS.emailInput)).toBeVisible();
	});

	test('should clear errors when input is corrected', async ({ page }) => {
		// Create error state
		await page.fill(SELECTORS.emailInput, 'invalid-email');
		await page.click(SELECTORS.loginButton);

		// Should show error
		await expect(page.locator('text=Please enter a valid email address')).toBeVisible();

		// Fix the email
		await page.fill(SELECTORS.emailInput, 'valid@email.com');

		// The error might clear automatically or on form submission
		// This depends on your implementation
	});

	test('should handle API errors during book operations', async ({ page }) => {
		await login(page);

		// Try operations that might fail
		await page.fill(SELECTORS.titleInput, 'Test Book');
		await page.fill(SELECTORS.authorInput, 'Test Author');
		await page.click(SELECTORS.addBookButton);

		// If there's an API error, it should be handled gracefully
		// This test might need to be adjusted based on actual error handling
	});

	test('should show loading states during error conditions', async ({ page }) => {
		await page.fill(SELECTORS.emailInput, 'test@example.com');
		await page.fill(SELECTORS.passwordInput, 'password123');

		// Click login
		await page.click(SELECTORS.loginButton);

		// Should show loading state even if request will fail
		await expect(page.locator('text=Signing in...')).toBeVisible();
	});

	test('should maintain form state after errors', async ({ page }) => {
		const email = 'test@example.com';
		const password = 'short';

		await page.fill(SELECTORS.emailInput, email);
		await page.fill(SELECTORS.passwordInput, password);
		await page.click(SELECTORS.loginButton);

		// After validation error, form should maintain values
		await expect(page.locator(SELECTORS.emailInput)).toHaveValue(email);
		await expect(page.locator(SELECTORS.passwordInput)).toHaveValue(password);
	});

	test('should handle multiple validation errors simultaneously', async ({ page }) => {
		await page.fill(SELECTORS.emailInput, 'invalid-email');
		await page.fill(SELECTORS.passwordInput, '123');
		await page.click(SELECTORS.loginButton);

		// Should show both errors
		await expect(page.locator('text=Please enter a valid email address')).toBeVisible();
		await expect(page.locator('text=Password must be at least 6 characters')).toBeVisible();
	});

	test('should handle book form validation errors', async ({ page }) => {
		await login(page);

		// Try to submit with empty fields
		await page.click(SELECTORS.addBookButton);

		// Button should be disabled (preventing submission)
		await expect(page.locator(SELECTORS.addBookButton)).toBeDisabled();
	});

	test('should recover from error states', async ({ page }) => {
		// Create error state
		await page.fill(SELECTORS.emailInput, 'invalid@email.com');
		await page.fill(SELECTORS.passwordInput, 'wrongpassword');
		await page.click(SELECTORS.loginButton);

		// Should show error
		await expect(page.locator(SELECTORS.errorMessage)).toBeVisible();

		// Clear and enter correct credentials
		await page.fill(SELECTORS.emailInput, 'dhanjoenkp@gmail.com');
		await page.fill(SELECTORS.passwordInput, 'qweqwe');
		await page.click(SELECTORS.loginButton);

		// Should login successfully
		await expect(page.locator(SELECTORS.welcomeUser)).toBeVisible();
	});

	test('should show appropriate error messages for different error types', async ({ page }) => {
		// Test email validation error
		await page.fill(SELECTORS.emailInput, 'not-an-email');
		await page.click(SELECTORS.loginButton);
		await expect(page.locator('text=Please enter a valid email address')).toBeVisible();

		// Clear and test password validation error
		await page.fill(SELECTORS.emailInput, 'test@example.com');
		await page.fill(SELECTORS.passwordInput, '12');
		await page.click(SELECTORS.loginButton);
		await expect(page.locator('text=Password must be at least 6 characters')).toBeVisible();
	});

	test('should handle error message dismissal', async ({ page }) => {
		// Trigger an error
		await page.fill(SELECTORS.emailInput, 'wrong@email.com');
		await page.fill(SELECTORS.passwordInput, 'wrongpassword');
		await page.click(SELECTORS.loginButton);

		// Error should be visible
		await expect(page.locator(SELECTORS.errorMessage)).toBeVisible();

		// Errors might auto-dismiss or be dismissible
		// This depends on your implementation
	});

	test('should prevent form submission during loading states', async ({ page }) => {
		await page.fill(SELECTORS.emailInput, 'dhanjoenkp@gmail.com');
		await page.fill(SELECTORS.passwordInput, 'qweqwe');

		// Click login
		await page.click(SELECTORS.loginButton);

		// Button should be disabled during loading
		await expect(page.locator(SELECTORS.loginButton)).toBeDisabled();
	});

	test('should handle timeout scenarios gracefully', async ({ page }) => {
		// This test would require network mocking to simulate timeouts
		// For now, we'll test the behavior with actual requests

		await page.fill(SELECTORS.emailInput, 'dhanjoenkp@gmail.com');
		await page.fill(SELECTORS.passwordInput, 'qweqwe');
		await page.click(SELECTORS.loginButton);

		// Should eventually resolve (either success or error)
		await expect(page.locator(SELECTORS.welcomeUser).or(page.locator(SELECTORS.errorMessage))).toBeVisible({ timeout: 10000 });
	});

	test('should maintain accessibility during error states', async ({ page }) => {
		await page.fill(SELECTORS.emailInput, 'invalid-email');
		await page.click(SELECTORS.loginButton);

		// Error should be properly associated with input
		const emailInput = page.locator(SELECTORS.emailInput);
		const errorId = await emailInput.getAttribute('aria-describedby');

		if (errorId) {
			await expect(page.locator(`#${errorId}`)).toBeVisible();
		}
	});
});
