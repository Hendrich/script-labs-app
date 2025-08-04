import React, { useState } from "react";
import DeleteConfirmationModal from "../common/DeleteConfirmationModal";

const ScriptCard = ({ script, onEdit, onDelete, loading }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(script.title);
  const [editDescription, setEditDescription] = useState(script.description);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSave = () => {
    onEdit(script._id || script.id, {
      title: editTitle,
      description: editDescription,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(script.title);
    setEditDescription(script.description);
    setIsEditing(false);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    onDelete(script._id || script.id);
    setShowDeleteModal(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
      <div
        className={`script-card ${isEditing ? "editing" : ""} ${
          loading ? "loading" : ""
        }`}
      >
        <div className="script-icon">🧪</div>

        {isEditing ? (
          <>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="editable-title"
              placeholder="Script Title"
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="editable-description"
              placeholder="Script Description"
              rows={3}
            />
            <div className="script-actions">
              <button
                className="btn primary"
                onClick={handleSave}
                disabled={
                  loading || !editTitle.trim() || !editDescription.trim()
                }
              >
                {loading ? "💾 Saving..." : "💾 Save"}
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
            <h3 className="script-title">{script.title}</h3>
            <p className="script-description">{script.description}</p>
            <div className="script-actions">
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
        itemTitle={script.title}
        itemType="script"
      />
    </>
  );
};

export default ScriptCard;
