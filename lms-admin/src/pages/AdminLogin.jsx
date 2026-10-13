
import React, { useState } from "react";

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Demo credentials: replace with real authentication later
    const ADMIN_EMAIL = "admin@lms.com";
    const ADMIN_PASSWORD = "Admin@123";

    if (
      email.trim().toLowerCase() === ADMIN_EMAIL &&
      password === ADMIN_PASSWORD
    ) {
      localStorage.setItem(
        "lmsAdminSession",
        JSON.stringify({ role: "admin", email: ADMIN_EMAIL })
      );

      onLogin();
    } else {
      setError("Access denied. Invalid admin credentials.");
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <span>✦</span>
        </div>

        <p className="login-tag">LEARNING MANAGEMENT SYSTEM</p>
        <h1>Welcome back</h1>
        <p className="login-subtitle">
          Sign in to your administrator account.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Admin email</label>
          <input
            id="email"
            type="email"
            placeholder="admin@lms.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />

          <label htmlFor="password">Password</label>
          <div className="password-field">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              className="show-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-button">
            Sign in securely <span>→</span>
          </button>
        </form>

        <div className="login-security">
          <span>🔒</span>
          Authorized administrators only
        </div>
      </div>

      <p className="login-footer">
        LMS Admin Portal · Secure access
      </p>
    </div>
  );
}
