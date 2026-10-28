
import React, { useState } from "react";
import { login, setToken } from "../api.js";

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await login({ email: email.trim(), password });
      if (result.user.role !== "admin") {
        setError("This account does not have administrator access.");
        return;
      }
      setToken(result.token);
      onLogin(result.user);
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-5 py-12 text-slate-900">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-36 -top-44 h-[28rem] w-[28rem] rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-52 -right-28 h-[32rem] w-[32rem] rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.12),_transparent_55%)]" />
      </div>

      <div className="relative w-full max-w-md rounded-3xl border border-white/60 bg-white px-7 py-9 shadow-2xl shadow-indigo-950/30 sm:px-10 sm:py-11">
        <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-2xl text-white shadow-lg shadow-indigo-600/25">
          <span aria-hidden="true">✦</span>
        </div>

        <p className="mb-3 text-xs font-bold tracking-[0.2em] text-indigo-600">
          LEARNING MANAGEMENT SYSTEM
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Welcome back</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Sign in to your administrator account.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700" htmlFor="email">Admin email</label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700" htmlFor="password">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-16 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                required
              />

              <button
                type="button"
                className="absolute inset-y-0 right-3 my-auto h-fit rounded-md px-2 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>}

          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/25 disabled:cursor-wait disabled:opacity-60" disabled={loading}>
            {loading ? "Signing in..." : "Sign in securely"} <span aria-hidden="true">→</span>
          </button>
        </form>

        <div className="mt-7 flex items-center justify-center gap-2 border-t border-slate-100 pt-5 text-xs font-medium text-slate-500">
          <span aria-hidden="true">🔒</span>
          <span>Authorized administrators only</span>
        </div>
      </div>

      <p className="absolute bottom-5 left-4 right-4 text-center text-xs text-slate-400">
        LMS Admin Portal · Secure access
      </p>
    </div>
  );
}
