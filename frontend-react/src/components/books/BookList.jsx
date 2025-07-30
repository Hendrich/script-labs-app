import React from 'react';
import BookCard from './BookCard.jsx';

const BookList = ({ books, onEdit, onDelete, loading }) => {
	if (loading) {
		return (
			<div className="loading-container">
				<div className="spinner spinner-medium"></div>
				<div className="loading-message">Loading your amazing books...</div>
			</div>
		);
	}

	if (books.length === 0) {
		return (
			<div className="books-empty">
				<h3>📚 Your Library is Empty</h3>
				<p>Start building your digital library by adding your first book above!</p>
			</div>
		);
	}

	return (
		<div className="books-container">
			<h2>Your Book Collection</h2>
			<div className="book-grid">
				{books.map((book) => (
					<BookCard
						key={book._id || book.id}
						book={book}
						onEdit={onEdit}
						onDelete={onDelete}
						loading={loading}
					/>
				))}
			</div>
		</div>
	);
};

export default BookList;
