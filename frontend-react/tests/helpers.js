// Test constants and helper functions
import { expect } from '@playwright/test';
export const TEST_CREDENTIALS = {
  email: "dhanjoenkp@gmail.com",
  password: "qweqwe",
};

export const TEST_BOOKS = {
  book1: {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
  },
  book2: {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
  },
  book3: {
    title: "Pride and Prejudice",
    author: "Jane Austen",
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

  // Book form selectors
  titleInput: "#title",
  authorInput: "#author",
  addBookButton: "text=📚 Add Book",

  // Book card selectors
  bookCard: ".book-card",
  bookTitle: ".book-title",
  bookAuthor: ".book-author",
  editButton: "text=✏️ Edit",
  deleteButton: "text=🗑️ Delete",
  saveButton: "text=💾 Save",
  cancelButton: "text=❌ Cancel",

  // Modal selectors
  deleteModal: ".modal-overlay",
  confirmDeleteButton: "text=🗑️ Delete",
  cancelDeleteButton: "text=❌ Cancel",

  // Common selectors
  loadingSpinner: ".spinner",
  errorMessage: ".error-message",
  successMessage: ".success-message",
  emptyState: ".books-empty",
};

export const URLS = {
  home: "/",
  dashboard: "/",
};

export const TIMEOUTS = {
  short: 5000,
  medium: 10000,
  long: 30000,
};

// Helper function to login
export async function login(page, credentials = TEST_CREDENTIALS) {
  await page.goto("/");
  await page.fill(SELECTORS.emailInput, credentials.email);
  await page.fill(SELECTORS.passwordInput, credentials.password);
  await page.click(SELECTORS.loginButton);

  // Wait for successful login
  await page.waitForSelector(SELECTORS.welcomeUser, {
    timeout: TIMEOUTS.medium,
  });
}

// Helper function to logout
export async function logout(page) {
  await page.click(SELECTORS.logoutButton);
  await page.waitForSelector(SELECTORS.emailInput, {
    timeout: TIMEOUTS.medium,
  });
}

// Helper function to add a book
export async function addBook(page, book) {
  await page.fill(SELECTORS.titleInput, book.title);
  await page.fill(SELECTORS.authorInput, book.author);
  await page.click(SELECTORS.addBookButton);

  // Wait for form to reset (indicating success)
  await page.waitForFunction(
    () => {
      const titleInput = document.querySelector("#title");
      return titleInput && titleInput.value === "";
    },
    { timeout: TIMEOUTS.medium }
  );
}

// Helper function to wait for page load
export async function waitForPageLoad(page) {
  await page.waitForLoadState("networkidle");
}

// Helper function to take screenshot with timestamp
export async function takeScreenshot(page, name) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  await page.screenshot({
    path: `test-results/screenshots/${name}-${timestamp}.png`,
    fullPage: true,
  });
}

// Helper function to clear all books
export async function clearAllBooks(page) {
  // Check if there are any books to delete
  const bookCards = page.locator(SELECTORS.bookCard);
  let count = await bookCards.count();
  let loop = 0;
  // Delete all books one by one, with max 20 attempts to avoid infinite loop
  while (count > 0 && loop < 20) {
    const firstCard = bookCards.first();
    const deleteButton = firstCard.locator(SELECTORS.deleteButton);
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      // Pastikan modal benar-benar muncul sebelum klik tombol delete
      const modal = page.locator(SELECTORS.deleteModal);
      await expect(modal).toBeVisible({ timeout: TIMEOUTS.short });
      const confirmDeleteButton = modal.locator(SELECTORS.confirmDeleteButton);
      await expect(confirmDeleteButton).toBeVisible({
        timeout: TIMEOUTS.short,
      });
      await confirmDeleteButton.click();
      // Wait for the book to be removed (shorter wait)
      await page.waitForTimeout(200);
      count = await bookCards.count();
    } else {
      break;
    }
    loop++;
  }
}
