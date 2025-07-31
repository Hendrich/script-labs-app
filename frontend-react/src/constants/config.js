// API Configuration
export const API_CONFIG = {
	BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
	ENDPOINTS: {
		AUTH: {
			LOGIN: '/api/auth/login',
			REGISTER: '/api/auth/register'
		},
	   BOOKS: {
		   GET_ALL: '/api/books',
		   CREATE: '/api/books',
		   UPDATE: '/api/books',
		   DELETE: '/api/books',
		   SEARCH: '/api/books/search'
	   }
	}
};

export const APP_CONFIG = {
	APP_NAME: 'Book Catalog',
	VERSION: '1.0.0'
};
