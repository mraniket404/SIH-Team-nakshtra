import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo from "../components/common/Logo";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Authentication backend Phase 2 mein connect hoga.
    // Abhi frontend form validation complete hai.
    if (!form.email || !form.password) {
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="hidden lg:flex relative overflow-hidden bg-slate-900 p-12">
          <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between">
            <Logo />

            <div className="max-w-xl">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
                Remote Sensing Intelligence
              </p>

              <h1 className="text-5xl font-bold leading-tight">
                Understand satellite imagery through natural language.
              </h1>

              <p className="mt-6 leading-7 text-slate-400">
                SatQuery AI combines remote-sensing vision models,
                multimodal analysis and agentic task orchestration
                to answer questions about satellite imagery.
              </p>
            </div>

            <p className="text-sm text-slate-600">
              SatQuery AI · SIH26167
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Logo />
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold">
                Welcome back
              </h2>

              <p className="mt-2 text-slate-400">
                Sign in to continue to SatQuery AI.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Email address
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:bg-white/[0.07]"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-300">
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs text-cyan-400 hover:text-cyan-300"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-16 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Sign In
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-cyan-400 hover:text-cyan-300"
              >
                Create account
              </Link>
            </p>

            <Link
              to="/"
              className="mt-6 block text-center text-sm text-slate-600 hover:text-slate-400"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;