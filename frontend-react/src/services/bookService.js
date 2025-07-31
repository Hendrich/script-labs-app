import { apiService } from './api.js';
import { API_CONFIG } from '../constants/config.js';

export const bookService = {
	   async getAllBooks() {
			   return await apiService.get(API_CONFIG.ENDPOINTS.BOOKS.GET_ALL);
	   },

	   async searchBooks(query, page = 1, limit = 10) {
			   const params = new URLSearchParams();
			   if (query) params.append('q', query);
			   if (page) params.append('page', page);
			   if (limit) params.append('limit', limit);
			   const url = `${API_CONFIG.ENDPOINTS.BOOKS.SEARCH}?${params.toString()}`;
			   return await apiService.get(url);
	   },

	async createBook(bookData) {
		return await apiService.post(API_CONFIG.ENDPOINTS.BOOKS.CREATE, bookData);
	},

	async updateBook(id, bookData) {
		return await apiService.put(`${API_CONFIG.ENDPOINTS.BOOKS.UPDATE}/${id}`, bookData);
	},

	async deleteBook(id) {
		return await apiService.delete(`${API_CONFIG.ENDPOINTS.BOOKS.DELETE}/${id}`);
	}
};
