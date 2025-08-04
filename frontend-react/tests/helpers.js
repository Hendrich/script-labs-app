// Test constants and helper functions
import { expect } from "@playwright/test";

export const TEST_CREDENTIALS = {
  email: "dhanjoenkp@gmail.com",
  password: "qweqwe",
};

export const TEST_SCRIPTS = {
  script1: {
    title: "Login Test Automation",
    description: "Automated test script for user login functionality",
  },
  script2: {
    title: "API Endpoint Testing",
    description: "Script to test REST API endpoints and responses",
  },
  script3: {
    title: "Database Connection Test",
    description: "Test script for database connectivity and queries",
  },
};

export const SELECTORS = {
  // Auth selectors
  emailInput: "#email",
  passwordInput: "#password",
  loginButton: 'button[type="submit"]',
  registerTab: 'button[aria-selected="false"]',
  loginTab: 'button[aria-selected="true"]',
  welcomeUser: "#welcome-user",
  logoutButton: "text=Logout",

  // Script form selectors
  titleInput: "#title",
  descriptionInput: "#description",
  addScriptButton: "text=🧪 Add Script",

  // Script card selectors
  scriptCard: ".script-card",
  scriptTitle: ".script-title",
  scriptDescription: ".script-description",
  editButton: "text=✏️ Edit",
  deleteButton: "text=🗑️ Delete",
  saveButton: "text=💾 Save",
  cancelButton: "text=❌ Cancel",

  // Modal selectors
  deleteModal: ".modal-overlay",
  confirmDeleteButton: "text=🗑️ Delete",
  cancelDeleteButton: "text=❌ Cancel",

  // List selectors
  searchBar: ".search-bar",
  emptyState: ".scripts-empty",

  // Navigation
  header: "header",
  headerTitle: "h1",

  // Loading states
  loadingSpinner: ".spinner",
  loadingContainer: ".loading-container",
};

export const URLS = {
  // Add your URLs here if needed
  LOCAL_DEV: "http://localhost:5173",
};

export const WAIT_TIMES = {
  SHORT: 2000,
  MEDIUM: 5000,
  LONG: 10000,
  VERY_LONG: 30000,
};

// Helper function to log in
export async function login(page, credentials = TEST_CREDENTIALS) {
  await page.goto("/");
  await page.fill(SELECTORS.emailInput, credentials.email);
  await page.fill(SELECTORS.passwordInput, credentials.password);
  await page.click(SELECTORS.loginButton);

  // Wait for welcome message to appear
  await expect(page.locator(SELECTORS.welcomeUser)).toBeVisible({
    timeout: WAIT_TIMES.MEDIUM,
  });
}

// Helper function to add a script
export async function addScript(page, script) {
  await page.fill(SELECTORS.titleInput, script.title);
  await page.fill(SELECTORS.descriptionInput, script.description);
  await page.click(SELECTORS.addScriptButton);

  // Wait for the script to appear in the list
  await page.waitForTimeout(1000);
}

// Helper function to wait for script to appear
export async function waitForScriptToAppear(page, title) {
  await expect(
    page.locator(SELECTORS.scriptCard).filter({ hasText: title }).first()
  ).toBeVisible({ timeout: WAIT_TIMES.MEDIUM });
}

// Helper function to get script card by title
export function getScriptCardByTitle(page, title) {
  return page.locator(SELECTORS.scriptCard).filter({ hasText: title }).first();
}

// Helper function to verify script card content
export async function verifyScriptCard(page, script) {
  const scriptCard = getScriptCardByTitle(page, script.title);
  await expect(scriptCard.locator(SELECTORS.scriptTitle)).toContainText(
    script.title
  );
  await expect(scriptCard.locator(SELECTORS.scriptDescription)).toContainText(
    script.description
  );
}

// Helper function to clear all scripts
export async function clearAllScripts(page) {
  // Check if there are any scripts to delete
  const scriptCards = page.locator(SELECTORS.scriptCard);
  let count = await scriptCards.count();

  // Delete all scripts one by one, with max 20 attempts to avoid infinite loop
  while (count > 0 && count < 20) {
    const firstCard = scriptCards.first();

    try {
      // Click delete button on the first script
      await firstCard.locator(SELECTORS.deleteButton).click();

      // Click confirm in the modal
      await page.locator(SELECTORS.confirmDeleteButton).click();

      // Wait for the script to be removed (shorter wait)
      await page.waitForTimeout(1000);
      count = await scriptCards.count();
    } catch (error) {
      console.log("Error deleting script, breaking loop:", error);
      break;
    }
  }
}

// Helper function to search for scripts
export async function searchScripts(page, query) {
  await page.fill(SELECTORS.searchBar, query);
  await page.waitForTimeout(500); // Wait for search to filter results
}
