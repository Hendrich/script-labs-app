import React, { useState } from 'react';

const BookForm = ({ onSubmit, loading }) => {
	const [title, setTitle] = useState('');
	const [author, setAuthor] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!title.trim() || !author.trim()) return;

		onSubmit({ title: title.trim(), author: author.trim() });
		setTitle('');
		setAuthor('');
	};

	return (
		<div className="book-form">
			<h2>Add New Book</h2>
			<form onSubmit={handleSubmit}>
				<div className="form-row">
					<div className="form-group">
						<label htmlFor="title">Book Title</label>
						<input
							id="title"
							type="text"
							placeholder="Enter book title..."
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
						/>
					</div>
					<div className="form-group">
						<label htmlFor="author">Author</label>
						<input
							id="author"
							type="text"
							placeholder="Enter author name..."
							value={author}
							onChange={(e) => setAuthor(e.target.value)}
							required
						/>
					</div>
				</div>
				<button
					type="submit"
					className="btn primary"
					disabled={loading || !title.trim() || !author.trim()}
				>
					{loading ? 'Adding Book...' : '📚 Add Book'}
				</button>
			</form>
		</div>
	);
};

export default BookForm;
