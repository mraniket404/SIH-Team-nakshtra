import { Link } from "react-router-dom";

function Projects() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Workspace
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Projects
          </h1>

          <p className="mt-2 text-slate-500">
            Organize your remote-sensing analysis projects.
          </p>
        </div>

        <Link
          to="/analysis/new"
          className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
        >
          New Analysis
        </Link>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-2xl text-slate-600">
          +
        </div>

        <h2 className="mt-5 font-semibold">
          No projects available
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
          Project data will be loaded from MongoDB after the
          backend project management API is implemented.
        </p>
      </div>
    </div>
  );
}

export default Projects;