import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Logo from "../components/common/Logo";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirectPath =
    location.state?.from?.pathname || "/dashboard";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const email = form.email.trim();
    const password = form.password;

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setSubmitting(true);

      await login(email, password);

      navigate(redirectPath, {
        replace: true,
      });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Unable to login. Please try again.";

      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT PANEL */}
        <section className="relative hidden overflow-hidden border-r border-white/10 bg-slate-900 lg:flex">
          <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12">
            <Logo />

            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
                Remote Sensing Intelligence
              </p>

              <h1 className="mt-5 text-5xl font-bold leading-tight">
                Ask satellite imagery what you want to know.
              </h1>

              <p className="mt-6 max-w-lg text-base leading-8 text-slate-400">
                SatQuery AI is designed to analyse optical,
                multispectral and SAR imagery through
                natural-language queries and specialized
                remote-sensing AI workflows.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3">
                {[
                  "Single Image",
                  "Bi-Temporal",
                  "Optical + SAR",
                  "Natural Language",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-400"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-600">
              SATQUERY AI · SIH26167
            </p>
          </div>
        </section>

        {/* RIGHT PANEL */}
        <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-md">
            <div className="mb-10 lg:hidden">
              <Logo />
            </div>

            <div className="mb-8">
              <p className="mb-3 text-sm font-medium text-cyan-400">
                Welcome back
              </p>

              <h2 className="text-3xl font-bold tracking-tight">
                Sign in to SatQuery AI
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Access your remote-sensing analysis workspace.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm leading-6 text-red-300"
              >
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* EMAIL */}
              <div>
                <label
                  htmlFor="login-email"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Email address
                </label>

                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  placeholder="you@example.com"
                  disabled={submitting}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-400/50 focus:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="login-password"
                    className="text-sm font-medium text-slate-300"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs text-cyan-400 transition hover:text-cyan-300"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <input
                    id="login-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    disabled={submitting}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 pr-16 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-400/50 focus:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs text-slate-500 transition hover:bg-white/5 hover:text-white"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                )}

                {submitting
                  ? "Signing in..."
                  : "Sign In"}
              </button>
            </form>

            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />

              <span className="text-xs text-slate-700">
                OR
              </span>

              <div className="h-px flex-1 bg-white/10" />
            </div>

            <p className="text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-cyan-400 transition hover:text-cyan-300"
              >
                Create account
              </Link>
            </p>

            <Link
              to="/"
              className="mt-6 block text-center text-sm text-slate-600 transition hover:text-slate-400"
            >
              ← Back to home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;