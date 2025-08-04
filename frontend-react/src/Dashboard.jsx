import React from "react";
import { useScripts } from "./hooks/useScripts.js";
import ScriptForm from "./components/labs/ScriptForm.jsx";
import ScriptList from "./components/labs/ScriptList.jsx";
import ErrorMessage from "./components/common/ErrorMessage.jsx";

import { useState, useCallback } from "react";

function Dashboard() {
  const { books, loading, error, createBook, updateBook, deleteBook, refetch } =
    useBooks();

  const handleCreateScript = async (scriptData) => {
    try {
      await createBook(bookData);
    } catch (err) {
      console.error("Failed to create book:", err);
      // Optionally, you could set a local error state here to display a message
    }
  };

  const handleUpdateScript = async (id, scriptData) => {
    try {
      await updateBook(id, bookData);
    } catch (err) {
      console.error("Failed to update book:", err);
      // Optionally, you could set a local error state here to display a message
    }
  };

  const handleDeleteScript = async (id) => {
    try {
      await deleteBook(id);
    } catch (err) {
      console.error("Failed to delete book:", err);
      // Optionally, you could set a local error state here to display a message
    }
  };

  return (
    <section className="book-section">
      <BookForm onSubmit={handleCreateBook} loading={loading} />

      <ErrorMessage message={error} onRetry={refetch} />

      <div className="books-container">
        <BookList
          books={books}
          onEdit={handleUpdateBook}
          onDelete={handleDeleteBook}
          loading={loading}
          searchQuery={searchQuery}
          onSearch={handleSearch}
        />
      </div>
    </section>
  );
}

export default Dashboard;
