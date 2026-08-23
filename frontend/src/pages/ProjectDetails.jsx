import { useCallback, useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  deleteProject,
  getProject,
  updateProject,
} from "../services/projectApi";

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
    areaOfInterest: "",
    status: "active",
  });

  const loadProject = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getProject(id);

        const data = response.project;

        setProject(data);

        setForm({
          name: data.name || "",
          description:
            data.description || "",
          location:
            data.location || "",
          areaOfInterest:
            data.areaOfInterest || "",
          status:
            data.status || "active",
        });
      } catch (error) {
        setError(
          error.response?.data?.message ||
            error.message ||
            "Unable to load project."
        );
      } finally {
        setLoading(false);
      }
    },
    [id]
  );

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError(
        "Project name is required."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response =
        await updateProject(id, {
          name: form.name.trim(),
          description:
            form.description.trim(),
          location:
            form.location.trim(),
          areaOfInterest:
            form.areaOfInterest.trim(),
          status: form.status,
        });

      setProject(response.project);

      setForm({
        name: response.project.name,
        description:
          response.project.description || "",
        location:
          response.project.location || "",
        areaOfInterest:
          response.project.areaOfInterest || "",
        status:
          response.project.status,
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to update project."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete "${project.name}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProject(id);

      navigate("/projects", {
        replace: true,
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to delete project."
      );
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="h-96 animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-red-400/10 bg-red-400/[0.03] p-10 text-center">
          <h1 className="text-xl font-semibold">
            Project unavailable
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {error ||
              "The requested project could not be found."}
          </p>

          <Link
            to="/projects"
            className="mt-6 inline-flex rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            to="/projects"
            className="text-sm text-slate-600 hover:text-cyan-400"
          >
            ← Projects
          </Link>

          <div className="mt-3 flex items-center gap-3">
            <h1 className="text-3xl font-bold">
              {project.name}
            </h1>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                project.status ===
                "active"
                  ? "bg-emerald-400/10 text-emerald-400"
                  : "bg-slate-400/10 text-slate-500"
              }`}
            >
              {project.status}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDelete}
          className="rounded-xl border border-red-400/10 px-4 py-2.5 text-sm text-red-400 hover:bg-red-400/5"
        >
          Delete Project
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* PROJECT SETTINGS */}
      <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03]">
        <div className="border-b border-white/10 px-6 py-5">
          <h2 className="font-semibold">
            Project Information
          </h2>

          <p className="mt-1 text-xs text-slate-600">
            Update project metadata.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6"
        >
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Project name
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={saving}
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              disabled={saving}
              className="w-full resize-none rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Location
              </label>

              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                disabled={saving}
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Area of Interest
              </label>

              <input
                name="areaOfInterest"
                value={form.areaOfInterest}
                onChange={handleChange}
                disabled={saving}
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Status
            </label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              disabled={saving}
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50"
            >
              <option value="active">
                Active
              </option>

              <option value="archived">
                Archived
              </option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300 disabled:opacity-50"
            >
              {saving && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
              )}

              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </section>

      {/* ANALYSIS ENTRY */}
      <section className="mt-6 rounded-3xl border border-cyan-400/10 bg-cyan-400/[0.03] p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
          Analysis
        </p>

        <h2 className="mt-2 text-xl font-semibold">
          Analyse imagery for this project
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          The project is ready to receive satellite imagery
          and analysis workflows.
        </p>

        <Link
          to={`/analysis/new?project=${project._id}`}
          className="mt-5 inline-flex rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300"
        >
          Start Analysis →
        </Link>
      </section>
    </div>
  );
}

export default ProjectDetails;