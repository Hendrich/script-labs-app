import React, { useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

function LoginRegister({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (setter) => (e) => setter(e.target.value);

  const handleSubmit = async (type) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error?.message || "Failed");
      if (type === "login") {
        onLogin(data.data.user, data.data.token);
      } else {
        setSuccess("Registration successful!");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-section card">
      <h2>Login / Register</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={handleChange(setEmail)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={handleChange(setPassword)}
      />
      <div>
        <button
          className="btn primary"
          disabled={loading}
          onClick={() => handleSubmit("register")}
        >
          Register
        </button>
        <button
          className="btn secondary"
          disabled={loading}
          onClick={() => handleSubmit("login")}
        >
          Login
        </button>
      </div>
      {error && <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>}
      {success && (
        <div style={{ color: "green", marginTop: "1rem" }}>{success}</div>
      )}
    </section>
  );
}

export default LoginRegister;
