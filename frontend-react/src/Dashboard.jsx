import React, { useEffect, useState } from "react";
import { apiUrl } from "./main";

function Dashboard({ token }) {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");

  const fetchBooks = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${apiUrl}/api/books`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error?.message || "Failed");
      setBooks(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line
  }, [token]);

  const handleAddBook = async () => {
    if (!title || !author) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${apiUrl}/api/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, author }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error?.message || "Failed");
      setTitle("");
      setAuthor("");
      fetchBooks();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm("Yakin ingin menghapus buku ini?")) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${apiUrl}/api/books/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error?.message || "Failed");
      fetchBooks();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startEditBook = (book) => {
    setEditId(book.id);
    setEditTitle(book.title);
    setEditAuthor(book.author);
  };

  const handleEditBook = async () => {
    if (!editTitle || !editAuthor) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${apiUrl}/api/books/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: editTitle, author: editAuthor }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error?.message || "Failed");
      setEditId(null);
      setEditTitle("");
      setEditAuthor("");
      fetchBooks();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditTitle("");
    setEditAuthor("");
  };

  return (
    <section className="book-section">
      <div className="card">
        <h2>Add New Book</h2>
        <input
          type="text"
          id="title"
          placeholder="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          id="author"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <button
          className="btn primary"
          id="addBookBtn"
          disabled={loading}
          onClick={handleAddBook}
        >
          Add Book
        </button>
        {error && (
          <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>
        )}
      </div>
      <div id="booksContainer" className="book-grid">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : books.length === 0 ? (
          <p className="text-center">No books found. Add your first book!</p>
        ) : (
          books.map((book) => (
            <div className="book-card" key={book.id}>
              <img src="public/image/pdefault-book.jpg" alt="cover" />
              {editId === book.id ? (
                <>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="editable-title"
                  />
                  <input
                    type="text"
                    value={editAuthor}
                    onChange={(e) => setEditAuthor(e.target.value)}
                    className="editable-author"
                  />
                  <button
                    className="btn primary"
                    onClick={handleEditBook}
                    disabled={loading}
                  >
                    Simpan
                  </button>
                  <button
                    className="btn secondary"
                    onClick={cancelEdit}
                    disabled={loading}
                  >
                    Batal
                  </button>
                </>
              ) : (
                <>
                  <h3 className="editable-title" contentEditable={false}>
                    {book.title}
                  </h3>
                  <p className="editable-author" contentEditable={false}>
                    {book.author}
                  </p>
                  <button
                    className="btn secondary"
                    onClick={() => startEditBook(book)}
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button
                    className="btn danger"
                    onClick={() => handleDeleteBook(book.id)}
                    disabled={loading}
                  >
                    Hapus
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default Dashboard;
