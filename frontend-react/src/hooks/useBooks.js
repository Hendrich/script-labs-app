import { useState, useEffect } from 'react';
import { bookService } from '../services/bookService.js';

export const useBooks = () => {
	const [books, setBooks] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);


	   const fetchBooks = async () => {
			   try {
					   setLoading(true);
					   setError(null);
					   const response = await bookService.getAllBooks();
					   setBooks(response.data || []);
			   } catch (err) {
					   setError(err.message);
			   } finally {
					   setLoading(false);
			   }
	   };

	   // Search books from API
	   const searchBooks = async (query, page = 1, limit = 10) => {
			   try {
					   setLoading(true);
					   setError(null);
					   const response = await bookService.searchBooks(query, page, limit);
					   setBooks(response.data || []);
					   return response;
			   } catch (err) {
					   setError(err.message);
					   throw err;
			   } finally {
					   setLoading(false);
			   }
	   };

	const createBook = async (bookData) => {
		try {
			setLoading(true);
			const response = await bookService.createBook(bookData);
			setBooks(prev => [...prev, response.data]); // Fixed: use response.data instead of response.book
			return response;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const updateBook = async (id, bookData) => {
		try {
			setLoading(true);
			const response = await bookService.updateBook(id, bookData);
			setBooks(prev => prev.map(book =>
				(book._id === id || book.id === id) ? response.data : book // Fixed: check both _id and id
			));
			return response;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const deleteBook = async (id) => {
		try {
			setLoading(true);
			await bookService.deleteBook(id);
			setBooks(prev => prev.filter(book => book._id !== id && book.id !== id)); // Fixed: check both _id and id
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchBooks();
	}, []);

	   return {
			   books,
			   loading,
			   error,
			   createBook,
			   updateBook,
			   deleteBook,
			   refetch: fetchBooks,
			   searchBooks
	   };
};
