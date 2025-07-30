import React, { useState } from 'react';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal';

const BookCard = ({ book, onEdit, onDelete, loading }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editTitle, setEditTitle] = useState(book.title);
	const [editAuthor, setEditAuthor] = useState(book.author);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const handleSave = () => {
		onEdit(book._id || book.id, { title: editTitle, author: editAuthor });
		setIsEditing(false);
	};

	const handleCancel = () => {
		setEditTitle(book.title);
		setEditAuthor(book.author);
		setIsEditing(false);
	};

	const handleDelete = () => {
		setShowDeleteModal(true);
	};

	const handleConfirmDelete = () => {
		onDelete(book._id || book.id);
		setShowDeleteModal(false);
	};

	const handleCancelDelete = () => {
		setShowDeleteModal(false);
	};

	return (
		<>
			<div className={`book-card ${isEditing ? 'editing' : ''} ${loading ? 'loading' : ''}`}>
				<img src="/image/default-book.jpg" alt="Book cover" />

				{isEditing ? (
					<>
						<input
							type="text"
							value={editTitle}
							onChange={(e) => setEditTitle(e.target.value)}
							className="editable-title"
							placeholder="Book Title"
						/>
						<input
							type="text"
							value={editAuthor}
							onChange={(e) => setEditAuthor(e.target.value)}
							className="editable-author"
							placeholder="Author"
						/>
						<div className="book-actions">
							<button
								className="btn primary"
								onClick={handleSave}
								disabled={loading || !editTitle.trim() || !editAuthor.trim()}
							>
								{loading ? '💾 Saving...' : '💾 Save'}
							</button>
							<button
								className="btn secondary"
								onClick={handleCancel}
								disabled={loading}
							>
								❌ Cancel
							</button>
						</div>
					</>
				) : (
					<>
						<h3 className="book-title">{book.title}</h3>
						<p className="book-author">by {book.author}</p>
						<div className="book-actions">
							<button
								className="btn secondary"
								onClick={() => setIsEditing(true)}
								disabled={loading}
							>
								✏️ Edit
							</button>
							<button
								className="btn danger"
								onClick={handleDelete}
								disabled={loading}
							>
								🗑️ Delete
							</button>
						</div>
					</>
				)}
			</div>

			<DeleteConfirmationModal
				isOpen={showDeleteModal}
				onConfirm={handleConfirmDelete}
				onCancel={handleCancelDelete}
				bookTitle={book.title}
			/>
		</>
	);
};

export default BookCard;