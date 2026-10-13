import { useState } from "react";
import { verifyAdmin } from "../services/votingService";

function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Enter the administrator password.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const result = await verifyAdmin(password);
      if (!result.success) {
        setError(result.message || "Unable to sign in.");
        setPassword("");
        return;
      }
      onLogin(password);
    } catch {
      setError("Unable to connect to the voting server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-canvas flex min-h-[calc(100vh-65px)] items-center justify-center px-4 py-12">
      <div className="surface-card w-full max-w-lg rounded-3xl p-7 sm:p-10">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/15">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 10V7a5 5 0 0 1 10 0v3m-11 0h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v3" />
            </svg>
          </span>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Administrator access</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            Admin Login
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Enter the administrator password to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            placeholder="Enter password"
            autoComplete="current-password"
            disabled={loading}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
          />

          {error && (
            <p role="alert" className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-left text-sm font-medium text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="primary-action mt-6 w-full rounded-xl px-4 py-3.5 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
