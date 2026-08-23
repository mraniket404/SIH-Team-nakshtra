import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo from "../components/common/Logo";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      return;
    }

    if (form.password !== form.confirmPassword) {
      return;
    }

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-12">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl lg:grid-cols-2">
          <div className="hidden bg-gradient-to-br from-cyan-500/10 via-slate-900 to-violet-500/10 p-10 lg:flex lg:flex-col">
            <Logo />

            <div className="mt-auto">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
                SatQuery AI
              </p>

              <h1 className="mt-4 text-4xl font-bold">
                Your remote-sensing analysis workspace.
              </h1>

              <p className="mt-5 leading-7 text-slate-400">
                Upload imagery, ask natural-language questions
                and analyse optical, multispectral and SAR data.
              </p>
            </div>
          </div>

          <div className="p-7 sm:p-10">
            <div className="mb-8 lg:hidden">
              <Logo />
            </div>

            <h2 className="text-3xl font-bold">
              Create your account
            </h2>

            <p className="mt-2 text-slate-400">
              Start using SatQuery AI.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Full name
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-400/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Email address
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-400/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create password"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-16 outline-none focus:border-cyan-400/50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Confirm password
                </label>

                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-400/50"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
              >
                Create Account
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-cyan-400 hover:text-cyan-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;