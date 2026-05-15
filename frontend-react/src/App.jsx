import React from "react";
import "./App.css";
import "./styles/common.css";
import "./styles/auth.css";
import "./styles/labs.css";
import { useAuth } from "./hooks/AuthContext.jsx";
import Dashboard from "./Dashboard.jsx";
import LandingPage from "./components/landing/LandingPage.jsx";

function App() {
  const { user, logout } = useAuth();

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="container app-header-content">
          <div>
            <h1>🧪 Script Labs</h1>
            <p className="app-subtitle">QA Automation Playground</p>
          </div>
          {user && (
            <nav>
              <span id="welcome-user">Hello, {user.email}</span>
              <button className="btn secondary" onClick={logout}>
                Logout
              </button>
            </nav>
          )}
        </div>
      </header>

      <main className="container app-main-card">
        {!user ? <LandingPage /> : <Dashboard />}
      </main>

      <footer className="app-footer">
        <div>
          <strong>MIT License</strong> &copy; 2025 Hendrich
        </div>
      </footer>
    </div>
  );
}

export default App;
