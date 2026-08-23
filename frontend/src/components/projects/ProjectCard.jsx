import { Link } from "react-router-dom";

function ProjectCard({
  project,
  onDelete,
}) {
  const createdDate = new Date(
    project.createdAt
  ).toLocaleDateString();

  return (
    <article className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyan-400/30 hover:bg-white/[0.05]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 font-bold text-cyan-400">
            {project.name
              ?.charAt(0)
              ?.toUpperCase() || "P"}
          </div>

          <div className="min-w-0">
            <h3 className="truncate font-semibold text-white">
              {project.name}
            </h3>

            <p className="mt-1 truncate text-xs text-slate-600">
              Created {createdDate}
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
            project.status === "active"
              ? "bg-emerald-400/10 text-emerald-400"
              : "bg-slate-400/10 text-slate-500"
          }`}
        >
          {project.status}
        </span>
      </div>

      {project.description && (
        <p className="mt-5 line-clamp-2 text-sm leading-6 text-slate-500">
          {project.description}
        </p>
      )}

      <div className="mt-5 space-y-2">
        {project.location && (
          <div className="flex gap-2 text-xs text-slate-600">
            <span>Location:</span>

            <span className="truncate text-slate-400">
              {project.location}
            </span>
          </div>
        )}

        {project.areaOfInterest && (
          <div className="flex gap-2 text-xs text-slate-600">
            <span>AOI:</span>

            <span className="truncate text-slate-400">
              {project.areaOfInterest}
            </span>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center gap-2">
        <Link
          to={`/projects/${project._id}`}
          className="flex-1 rounded-xl bg-white/5 px-4 py-2.5 text-center text-sm font-medium text-slate-300 transition hover:bg-cyan-400/10 hover:text-cyan-300"
        >
          Open Project
        </Link>

        <button
          type="button"
          onClick={() => onDelete(project)}
          className="rounded-xl px-3 py-2.5 text-sm text-slate-600 transition hover:bg-red-400/5 hover:text-red-300"
          title="Delete project"
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default ProjectCard;