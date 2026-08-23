import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getProjectStats } from "../services/projectApi";

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
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    archived: 0,
  });

  const [recentProjects, setRecentProjects] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadDashboard =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getProjectStats();

        setStats(
          response.stats || {
            total: 0,
            active: 0,
            archived: 0,
          }
        );

        setRecentProjects(
          response.recentProjects || []
        );
      } catch (error) {
        setError(
          error.response?.data?.message ||
            error.message ||
            "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-violet-500/10 p-8">
        <div className="relative z-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Remote Sensing Intelligence
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            What do you want to discover?
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-slate-400">
            Start a remote-sensing analysis by selecting a project,
            uploading satellite imagery and asking a natural-language
            question.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/analysis/new"
              className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
            >
              New Analysis
            </Link>

            <Link
              to="/projects"
              className="rounded-xl border border-white/10 px-6 py-3 font-medium text-slate-300 hover:bg-white/5"
            >
              View Projects
            </Link>
          </div>
        </div>
      </section>

      {/* ERROR */}
      {error && (
        <div className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* STATS */}
      <section>
        <div className="mb-5">
          <h2 className="text-xl font-semibold">
            Workspace overview
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Live project information from your workspace.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-slate-500">
              Total Projects
            </p>

            <p className="mt-2 text-3xl font-bold">
              {loading ? "—" : stats.total}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-slate-500">
              Active Projects
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-400">
              {loading ? "—" : stats.active}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-slate-500">
              Archived Projects
            </p>

            <p className="mt-2 text-3xl font-bold">
              {loading ? "—" : stats.archived}
            </p>
          </div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section>
        <div className="mb-5">
          <h2 className="text-xl font-semibold">
            Analysis capabilities
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Remote-sensing workflows available in SatQuery AI.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {capabilities.map(
            (item) => (
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
            )
          )}
        </div>
      </section>

      {/* RECENT PROJECTS */}
      <section>
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Recent projects
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your latest project activity.
            </p>
          </div>

          <Link
            to="/projects"
            className="text-sm text-cyan-400 hover:text-cyan-300"
          >
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-28 animate-pulse rounded-2xl bg-white/[0.03]" />
            <div className="h-28 animate-pulse rounded-2xl bg-white/[0.03]" />
          </div>
        ) : recentProjects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
            <p className="text-sm text-slate-600">
              No projects created yet.
            </p>

            <Link
              to="/projects"
              className="mt-4 inline-block text-sm text-cyan-400"
            >
              Create your first project →
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {recentProjects.map(
              (project) => (
                <Link
                  key={project._id}
                  to={`/projects/${project._id}`}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyan-400/30"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="truncate font-medium">
                      {project.name}
                    </h3>

                    <span
                      className={`rounded-full px-2 py-1 text-[10px] uppercase ${
                        project.status ===
                        "active"
                          ? "bg-emerald-400/10 text-emerald-400"
                          : "bg-slate-400/10 text-slate-500"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>

                  {project.location && (
                    <p className="mt-2 text-xs text-slate-600">
                      {project.location}
                    </p>
                  )}
                </Link>
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;