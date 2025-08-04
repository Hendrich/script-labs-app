/**
 * Utility functions for the Script Labs App
 */

// Format error messages for better UX
export const formatErrorMessage = (error) => {
  if (typeof error === "string") return error;
  if (error?.message) return error.message;
  return "An unexpected error occurred";
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength (at least 6 characters)
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Debounce function for search/input
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// Format script data for consistent structure
export const formatScriptData = (script) => {
  return {
    id: script._id || script.id,
    title: script.title?.trim() || "",
    description: script.description?.trim() || "",
    createdAt: script.createdAt,
    updatedAt: script.updatedAt,
  };
};
