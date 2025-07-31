import React from "react";
import { useBooks } from "./hooks/useBooks.js";
import BookForm from "./components/books/BookForm.jsx";
import BookList from "./components/books/BookList.jsx";
import ErrorMessage from "./components/common/ErrorMessage.jsx";


import { useState, useCallback } from "react";

function Dashboard() {
  const { books, loading, error, createBook, updateBook, deleteBook, refetch, searchBooks } = useBooks();
  const [searchQuery, setSearchQuery] = useState("");

  // Debounce search (opsional, simple timeout)
  const [searchTimeout, setSearchTimeout] = useState(null);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    if (searchTimeout) clearTimeout(searchTimeout);
    // debounce 400ms
    const timeout = setTimeout(() => {
      if (query.trim() === "") {
        refetch();
      } else {
        searchBooks(query);
      }
    }, 400);
    setSearchTimeout(timeout);
  }, [searchBooks, refetch, searchTimeout]);

  const handleCreateBook = async (bookData) => {
    try {
      await createBook(bookData);
      if (searchQuery) handleSearch(searchQuery); else refetch();
    } catch (err) {
      console.error("Failed to create book:", err);
    }
  };

  const handleUpdateBook = async (id, bookData) => {
    try {
      await updateBook(id, bookData);
      if (searchQuery) handleSearch(searchQuery); else refetch();
    } catch (err) {
      console.error("Failed to update book:", err);
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      await deleteBook(id);
      if (searchQuery) handleSearch(searchQuery); else refetch();
    } catch (err) {
      console.error("Failed to delete book:", err);
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
