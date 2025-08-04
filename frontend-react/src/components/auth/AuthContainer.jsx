import React, { useState } from "react";
import Login from "./Login.jsx";
import Register from "./Register.jsx";

const AuthContainer = () => {
  const [activeTab, setActiveTab] = useState("login");

  console.log("🔐 AuthContainer: Rendering with activeTab:", activeTab);

  return (
    <section className="auth-section card">
      <div className="auth-header">
        <h2
          style={{
            textAlign: "center",
            marginBottom: "1rem",
            color: "var(--text-primary)",
          }}
        >
          Welcome to Script Labs
        </h2>
        <div className="auth-tabs">
          <button
            className={`tab-button ${activeTab === "login" ? "active" : ""}`}
            onClick={() => setActiveTab("login")}
            aria-selected={activeTab === "login"}
            role="tab"
          >
            <span className="tab-icon">👤</span>
            <span>Sign In</span>
          </button>
          <button
            className={`tab-button ${activeTab === "register" ? "active" : ""}`}
            onClick={() => setActiveTab("register")}
            aria-selected={activeTab === "register"}
            role="tab"
          >
            <span className="tab-icon">✨</span>
            <span>Sign Up</span>
          </button>
        </div>
      </div>

      <div className="auth-content">
        <div className={`auth-forms ${activeTab}`}>
          <div className="form-container">
            {activeTab === "login" ? (
              <Login />
            ) : (
              <Register onSuccess={() => setActiveTab("login")} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthContainer;
