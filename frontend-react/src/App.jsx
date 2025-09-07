import React, { useEffect } from "react";
import "./App.css";
import "./styles/common.css";
import "./styles/auth.css";
import "./styles/labs.css";
import { useAuth } from "./hooks/AuthContext.jsx";
import AuthContainer from "./components/auth/AuthContainer.jsx";
import Dashboard from "./Dashboard.jsx";

function App() {
  const { user, logout } = useAuth();

  console.log("� App component is rendering!");
  console.log("� Current user:", user);

  return (
    <div
      className="app-wrapper"
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "#f8fafc",
        padding: "2rem",
      }}
    >
      <header
        style={{
          background: "#1e293b",
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "2rem",
        }}
      >
        <div className="container">
          <h1 style={{ color: "#3b82f6", fontSize: "2rem", margin: 0 }}>
            🧪 Script Labs
          </h1>
          {user && (
            <nav style={{ marginTop: "1rem" }}>
              <span id="welcome-user">Hello, {user.email}</span>
              <button
                className="btn secondary"
                onClick={logout}
                style={{ marginLeft: "1rem" }}
              >
                Logout
              </button>
            </nav>
          )}
        </div>
      </header>
      <main className="container">
        <div
          style={{
            background: "#1e293b",
            padding: "2rem",
            borderRadius: "12px",
            minHeight: "400px",
            border: "1px solid #475569",
          }}
        >
          <h2 style={{ color: "#e2e8f0", marginBottom: "1rem" }}>
            {!user ? "Please Login" : "Welcome to Dashboard"}
          </h2>
          {!user ? <AuthContainer /> : <Dashboard />}
        </div>
      </main>

      {/* License Footer */}
      <footer
        style={{
          marginTop: "2rem",
          padding: "1rem",
          background: "#1e293b",
          borderRadius: "8px",
          textAlign: "center",
          fontSize: "0.95rem",
          color: "#94a3b8",
        }}
      >
        <div>
          <strong>MIT License</strong> &copy; 2025 Hendrich
        </div>
      </footer>
    </div>
  );
}

export default App;
