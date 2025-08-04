import React, { useState } from "react";
import ScriptCard from "./ScriptCard.jsx";

const ScriptList = ({ scripts, onEdit, onDelete, loading }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter scripts by title or description (case-insensitive)
  const filteredScripts = scripts.filter(
    (script) =>
      script.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      script.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner spinner-medium"></div>
        <div className="loading-message">Loading your script labs...</div>
      </div>
    );
  }

  // Tampilkan pesan jika tidak ada script setelah filter
  if (scripts.length === 0) {
    return (
      <div className="scripts-empty">
        <h3>🧪 Your Script Labs is Empty</h3>
        <p>
          Start building your testing scripts collection by adding your first
          script above!
        </p>
      </div>
    );
  }

  return (
    <div className="scripts-container">
      <h2>Your Script Labs Collection</h2>
      <div className="search-bar-container">
        <input
          type="text"
          className="search-bar"
          placeholder="🔍 Search scripts by title or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search scripts"
          autoComplete="off"
        />
      </div>
      {filteredScripts.length === 0 ? (
        <div className="scripts-empty">
          <h3>🔍 No scripts found</h3>
          <p>No scripts match your search.</p>
        </div>
      ) : (
        <div className="scripts-grid">
          {filteredScripts.map((script, index) => (
            <ScriptCard
              key={script._id || script.id || index}
              script={script}
              onEdit={onEdit}
              onDelete={onDelete}
              loading={loading}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ScriptList;
