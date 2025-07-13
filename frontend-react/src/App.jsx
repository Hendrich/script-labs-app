import React, { useState } from "react";
import "./App.css";
import LoginRegister from "./LoginRegister";
import Dashboard from "./Dashboard";

function App() {
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("authToken"));

  const handleLogin = (user, token) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("userData", JSON.stringify(user));
    localStorage.setItem("authToken", token);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("userData");
    localStorage.removeItem("authToken");
  };

  return (
    <div className="app-wrapper">
      <header>
        <div className="container">
          <h1>📚 Book Catalog</h1>
          {user && (
            <nav>
              <span id="welcome-user">Hello, {user.email}</span>
              <button className="btn secondary" onClick={handleLogout}>
                Logout
              </button>
            </nav>
          )}
        </div>
      </header>
      <main style={{ minHeight: "60vh", marginBottom: "2rem" }}>
        {!user ? (
          <LoginRegister onLogin={handleLogin} />
        ) : (
          <Dashboard token={token} />
        )}
      </main>
      <footer>
        <p>&copy; 2025 Book Catalog App - Inspired by Gramedia</p>
      </footer>
    </div>
  );
}

export default App;
