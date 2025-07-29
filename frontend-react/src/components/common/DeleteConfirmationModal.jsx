import React from 'react';

const DeleteConfirmationModal = ({ isOpen, onConfirm, onCancel, bookTitle }) => {
	if (!isOpen) return null;

	return (
		<div className="modal-overlay">
			<div className="modal-content">
				<div className="modal-header">
					<h3>🗑️ Confirm Delete</h3>
				</div>
				<div className="modal-body">
					<p>Are you sure you want to delete this book?</p>
					<p className="book-title-highlight">"{bookTitle}"</p>
				</div>
				<div className="modal-actions">
					<button
						className="btn danger"
						onClick={onConfirm}
					>
						🗑️ Delete
					</button>
					<button
						className="btn secondary"
						onClick={onCancel}
					>
						❌ Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default DeleteConfirmationModal;
