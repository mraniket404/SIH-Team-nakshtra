import { Link } from "react-router-dom";

const capabilities = [
  {
    title: "Single Image VQA",
    description:
      "Ask natural-language questions about optical, multispectral or SAR imagery.",
    icon: "Q",
    path: "/analysis/new",
  },
  {
    title: "Bi-Temporal Analysis",
    description:
      "Compare corresponding observations acquired at different times.",
    icon: "Δ",
    path: "/analysis/new",
  },
  {
    title: "Optical + SAR",
    description:
      "Combine complementary information from optical and SAR observations.",
    icon: "◎",
    path: "/analysis/new",
  },
  {
    title: "Grounding",
    description:
      "Locate regions referenced by natural-language queries.",
    icon: "⌖",
    path: "/analysis/new",
  },
];

function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-violet-500/10 p-8">
        <div className="relative z-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Remote Sensing Intelligence
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            What do you want to discover?
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-slate-400">
            Start an analysis by uploading satellite imagery and
            asking a natural-language question.
          </p>

          <Link
            to="/analysis/new"
            className="mt-7 inline-flex rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
          >
            New Analysis
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-5">
          <h2 className="text-xl font-semibold">
            Analysis capabilities
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Choose a workflow based on the imagery you want to analyse.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {capabilities.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.05]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 font-bold text-cyan-400">
                {item.icon}
              </div>

              <h3 className="mt-5 font-semibold">
                {item.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {item.description}
              </p>

              <span className="mt-5 block text-sm text-cyan-400">
                Start →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-slate-500">
            Analyses
          </p>

          <p className="mt-2 text-3xl font-bold">
            —
          </p>

          <p className="mt-2 text-xs text-slate-600">
            Live data will appear after backend connection.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-slate-500">
            AI Service
          </p>

          <p className="mt-2 text-lg font-semibold text-amber-400">
            Connecting
          </p>

          <p className="mt-2 text-xs text-slate-600">
            Status will come from the actual AI service.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-slate-500">
            Models
          </p>

          <p className="mt-2 text-3xl font-bold">
            —
          </p>

          <p className="mt-2 text-xs text-slate-600">
            Loaded models will be retrieved from the backend.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;