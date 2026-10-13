
import React, { useState } from "react";
import { GraduationCap, Eye, EyeOff, Mail, Lock } from "lucide-react";
import "./Login.css";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    const instructor = {
      email: email.trim().toLowerCase(),
      role: "Instructor",
      loggedIn: true,
    };

    // Frontend-only demo session.
    localStorage.setItem(
      "instructorSession",
      JSON.stringify(instructor)
    );

    if (onLogin) {
      onLogin(instructor);
    } else {
      setError(
        "Login details validated. Connect this page to your dashboard in App.jsx."
      );
    }

    setLoading(false);
  }

  return (
    <main className="login-page">
      <section className="login-visual">
        <div className="visual-brand">
          <div className="brand-icon">
            <GraduationCap size={30} />
          </div>
          <span>Classroom</span>
        </div>

        <div className="visual-content">
          <span className="visual-tag">INSTRUCTOR PORTAL</span>
          <h1>
            Share your knowledge.
            <br />
            <span>Inspire the future.</span>
          </h1>
          <p>
            Your teaching journey starts here. Create courses,
            upload learning materials, and manage your content
            in one simple place.
          </p>

          <div className="visual-decoration">
            <div className="decoration-circle circle-one" />
            <div className="decoration-circle circle-two" />
            <div className="decoration-card">
              <GraduationCap size={78} strokeWidth={1.2} />
              <span>Teach. Create. Inspire.</span>
            </div>
          </div>
        </div>

        <p className="visual-footer">
          © 2026 Classroom · Instructor workspace
        </p>
      </section>

      <section className="login-form-section">
        <div className="login-form-wrapper">
          <div className="mobile-brand">
            <GraduationCap size={30} />
            <span>Classroom</span>
          </div>

          <div className="form-heading">
            <span className="welcome-label">WELCOME BACK</span>
            <h2>Instructor Login</h2>
            <p>Sign in to continue to your dashboard.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <label htmlFor="instructor-email">Email address</label>
            <div className="login-input">
              <Mail size={19} />
              <input
                id="instructor-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
            </div>

            <label htmlFor="instructor-password">Password</label>
            <div className="login-input">
              <Lock size={19} />
              <input
                id="instructor-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                className="password-toggle"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            {error && (
              <div className="login-error" role="alert">
                {error}
              </div>
            )}

            <button
              className="login-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In to Dashboard"}
            </button>
          </form>

          <div className="secure-note">
            <Lock size={15} />
            <span>Instructor access only</span>
          </div>

          <p className="login-help">
            Need help accessing your account? Contact your LMS administrator.
          </p>
        </div>
      </section>
    </main>
  );
}
