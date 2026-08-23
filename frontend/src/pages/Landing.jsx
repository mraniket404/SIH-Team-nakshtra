import { Link } from 'react-router-dom';

import Logo from '../components/common/Logo';

function Landing() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6">
        <header className="flex items-center justify-between py-6">
          <Logo />

          <div className="flex gap-3">
            <Link
              to="/login"
              className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Get Started
            </Link>
          </div>
        </header>

        <section className="flex flex-1 items-center py-20">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm text-cyan-300">
              Agentic Remote-Sensing Intelligence
            </div>

            <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Ask satellite imagery
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                what you want to know.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">
              SatQuery AI analyzes optical, multispectral and SAR
              imagery through natural-language queries using
              specialized remote-sensing AI workflows.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/analysis/new"
                className="rounded-2xl bg-cyan-400 px-7 py-4 font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Start Analysis
              </Link>

              <Link
                to="/login"
                className="rounded-2xl border border-white/10 px-7 py-4 font-semibold text-slate-200 transition hover:bg-white/5"
              >
                Sign In
              </Link>
            </div>

            <div className="mt-16 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                'Single Image',
                'Bi-Temporal',
                'Optical + SAR',
                'Natural Language',
              ].map((feature) => (
                <div
                  key={feature}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <p className="text-sm font-medium text-slate-300">
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Landing;