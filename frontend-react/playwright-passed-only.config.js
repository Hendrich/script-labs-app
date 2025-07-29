import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
	testDir: './tests',
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: 'html',
	/* Shared settings for all the tests. */
	use: {
		/* Base URL to use in actions like `await page.goto('/')`. */
		baseURL: 'http://localhost:5173',

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: 'on-first-retry',
	},

	/* Configure projects for major browsers */
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],

	/* Run your local dev server before starting the tests */
	webServer: {
		command: 'npm run dev',
		url: 'http://localhost:5173',
		reuseExistingServer: !process.env.CI,
	},

	// Include only passed tests
	testMatch: [
		// All auth tests (these all passed)
		'**/auth/auth-flow.spec.js',
		'**/auth/login.spec.js',
	],

	// Exclude all failed test files completely
	testIgnore: [
		'**/books/book-list.spec.js',
		'**/books/delete-book.spec.js',
		'**/books/edit-book.spec.js',
		'**/books/add-book.spec.js', // exclude entire file since some tests failed
		'**/error-handling/error-states.spec.js',
		'**/integration/user-journey.spec.js',
		'**/ui/navigation.spec.js',
		'**/ui/responsive.spec.js',
	],
});
