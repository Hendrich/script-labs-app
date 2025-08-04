import React, { useState, useRef } from "react";

const ScriptForm = ({ onSubmit, loading }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const titleInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onSubmit({ title: title.trim(), description: description.trim() });
    setTitle("");
    setDescription("");

    // Focus on title input for next entry
    setTimeout(() => {
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
    }, 100);
  };

  return (
    <div className="script-form">
      <h2>🧪 Add New Script Lab</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Script Title</label>
            <input
              id="title"
              ref={titleInputRef}
              type="text"
              placeholder="Enter script title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Enter script description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="btn primary"
          disabled={loading || !title.trim() || !description.trim()}
        >
          {loading ? "🔄 Adding..." : "🧪 Add Script"}
        </button>
      </form>
    </div>
  );
};

export default ScriptForm;
