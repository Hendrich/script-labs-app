import React from "react";
import { useBooks } from "./hooks/useBooks.js";
import BookForm from "./components/books/BookForm.jsx";
import BookList from "./components/books/BookList.jsx";
import ErrorMessage from "./components/common/ErrorMessage.jsx";

function Dashboard() {
  const { books, loading, error, createBook, updateBook, deleteBook, refetch } =
    useBooks();

  const handleCreateBook = async (bookData) => {
    try {
      await createBook(bookData);
    } catch (err) {
      console.error("Failed to create book:", err);
      // Optionally, you could set a local error state here to display a message
    }
  };

  const handleUpdateBook = async (id, bookData) => {
    try {
      await updateBook(id, bookData);
    } catch (err) {
      console.error("Failed to update book:", err);
      // Optionally, you could set a local error state here to display a message
    }
  };

  const handleDeleteBook = async (id) => {
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
        />
      </div>
    </section>
  );
}

export default Dashboard;
