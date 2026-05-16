import React, { useState } from "react";
import Login from "./Login.jsx";
import Register from "./Register.jsx";

const demoAccounts = [
  {
    label: "Standard User",
    email: "standard_user@example.com",
    password: "script_sauce",
    note: "Normal login flow",
  },
  {
    label: "Admin",
    email: "admin@example.com",
    password: "admin123",
    note: "Admin role scenario",
  },
];
const AuthContainer = () => {
  const [activeTab, setActiveTab] = useState("login");

  //console.log("🔐 AuthContainer: Rendering with activeTab:", activeTab);

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
          {/* <button
            className={`tab-button ${activeTab === "register" ? "active" : ""}`}
            onClick={() => setActiveTab("register")}
            aria-selected={activeTab === "register"}
            role="tab"
          >
            <span className="tab-icon">✨</span>
            <span>Sign Up</span>
          </button> */}
        </div>
      </div>

      <div className="auth-content">
        <div className={`auth-forms ${activeTab}`}>
          <div className="form-container">
            {activeTab === "login" ? (
              <>
                <Login />

                <div className="demo-accounts-card">
                  <div className="demo-accounts-header">
                    <div>
                      <span className="demo-label">Demo Accounts</span>
                      <h3>Use these accounts for testing</h3>
                    </div>
                    <span className="demo-badge">QA Ready</span>
                  </div>

                  <div className="demo-accounts-list">
                    {demoAccounts.map((account) => (
                      <div className="demo-account-item" key={account.email}>
                        <div className="demo-account-main">
                          <strong>{account.label}</strong>
                          <span>{account.note}</span>
                        </div>

                        <div className="demo-credentials">
                          <code>{account.email}</code>
                          <code>{account.password}</code>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
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
