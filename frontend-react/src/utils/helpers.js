/**
 * Utility functions for the Book Catalog App
 */

// Format error messages for better UX
export const formatErrorMessage = (error) => {
	if (typeof error === 'string') return error;
	if (error?.message) return error.message;
	return 'An unexpected error occurred';
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

// Format book data for consistent structure
export const formatBookData = (book) => {
	return {
		id: book._id || book.id,
		title: book.title?.trim() || '',
		author: book.author?.trim() || '',
		createdAt: book.createdAt,
		updatedAt: book.updatedAt
	};
};
