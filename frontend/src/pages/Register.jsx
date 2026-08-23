import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Logo from "../components/common/Logo";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

    const name = form.name.trim();
    const email = form.email.trim();
    const password = form.password;
    const confirmPassword = form.confirmPassword;

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (name.length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);

      await register(
        name,
        email,
        password,
        confirmPassword
      );

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Unable to create account. Please try again.";

      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-12">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl lg:grid-cols-2">
          {/* LEFT */}
          <section className="relative hidden overflow-hidden bg-gradient-to-br from-cyan-500/10 via-slate-900 to-violet-500/10 p-10 lg:flex lg:flex-col">
            <div className="absolute -right-32 top-10 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="relative z-10">
              <Logo />
            </div>

            <div className="relative z-10 mt-auto">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
                Create your workspace
              </p>

              <h1 className="mt-4 text-4xl font-bold leading-tight">
                Start analysing the world from above.
              </h1>

              <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
                Build projects, upload remote-sensing imagery
                and work with multimodal satellite analysis
                through natural-language queries.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  "Optical & multispectral imagery",
                  "SAR imagery",
                  "Bi-temporal analysis",
                  "Cross-modal analysis",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-slate-500"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400/10 text-xs text-cyan-400">
                      ✓
                    </span>

                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* RIGHT */}
          <section className="p-7 sm:p-10">
            <div className="mb-8 lg:hidden">
              <Logo />
            </div>

            <div>
              <p className="text-sm font-medium text-cyan-400">
                Get started
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                Create your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Create your SatQuery AI workspace.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mt-6 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm leading-6 text-red-300"
              >
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-5"
            >
              {/* NAME */}
              <div>
                <label
                  htmlFor="register-name"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Full name
                </label>

                <input
                  id="register-name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  placeholder="Your full name"
                  disabled={submitting}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-400/50 focus:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="register-email"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Email address
                </label>

                <input
                  id="register-email"
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
                <label
                  htmlFor="register-password"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="register-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    placeholder="Minimum 8 characters"
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-white/5 hover:text-white"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <p className="mt-2 text-xs text-slate-700">
                  Password must contain at least 8 characters.
                </p>
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label
                  htmlFor="register-confirm-password"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Confirm password
                </label>

                <div className="relative">
                  <input
                    id="register-confirm-password"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    disabled={submitting}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 pr-16 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-400/50 focus:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (current) => !current
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-white/5 hover:text-white"
                  >
                    {showConfirmPassword
                      ? "Hide"
                      : "Show"}
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
                  ? "Creating account..."
                  : "Create Account"}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-cyan-400 hover:text-cyan-300"
              >
                Sign in
              </Link>
            </p>

            <Link
              to="/"
              className="mt-5 block text-center text-sm text-slate-600 hover:text-slate-400"
            >
              ← Back to home
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Register;