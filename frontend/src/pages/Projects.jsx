import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ProjectCard from "../components/projects/ProjectCard";
import CreateProjectModal from "../components/projects/CreateProjectModal";

import {
  createProject,
  deleteProject,
  getProjects,
} from "../services/projectApi";

function Projects() {
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const [createModalOpen, setCreateModalOpen] =
    useState(false);

  const loadProjects = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getProjects();

        setProjects(
          response.projects || []
        );
      } catch (error) {
        setError(
          error.response?.data?.message ||
            error.message ||
            "Unable to load projects."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleCreateProject =
    async (projectData) => {
      try {
        setCreating(true);

        const response =
          await createProject(
            projectData
          );

        if (response.project) {
          setProjects((current) => [
            response.project,
            ...current,
          ]);
        }

        setCreateModalOpen(false);
      } finally {
        setCreating(false);
      }
    };

  const handleDeleteProject =
    async (project) => {
      const confirmed = window.confirm(
        `Delete "${project.name}"? This action cannot be undone.`
      );

      if (!confirmed) {
        return;
      }

      try {
        setError("");

        await deleteProject(
          project._id
        );

        setProjects((current) =>
          current.filter(
            (item) =>
              item._id !== project._id
          )
        );
      } catch (error) {
        setError(
          error.response?.data?.message ||
            error.message ||
            "Unable to delete project."
        );
      }
    };

  return (
    <>
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Workspace
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Projects
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Create and manage remote-sensing analysis
              projects.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setCreateModalOpen(true)
            }
            className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
          >
            + New Project
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3">
            <p className="text-sm text-red-300">
              {error}
            </p>

            <button
              type="button"
              onClick={loadProjects}
              className="text-xs font-medium text-red-300 hover:text-red-200"
            >
              Retry
            </button>
          </div>
        )}

        {/* CONTENT */}
        {loading ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map(
              (item) => (
                <div
                  key={item}
                  className="h-72 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]"
                />
              )
            )}
          </div>
        ) : projects.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/10 text-2xl text-cyan-400">
              +
            </div>

            <h2 className="mt-6 text-xl font-semibold">
              Create your first project
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
              Projects organize your satellite imagery,
              analysis runs and results in one workspace.
            </p>

            <button
              type="button"
              onClick={() =>
                setCreateModalOpen(true)
              }
              className="mt-7 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300"
            >
              Create Project
            </button>
          </div>
        ) : (
          <>
            <div className="mt-8 mb-4 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                {projects.length}{" "}
                {projects.length === 1
                  ? "project"
                  : "projects"}
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {projects.map(
                (project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    onDelete={
                      handleDeleteProject
                    }
                  />
                )
              )}
            </div>
          </>
        )}
      </div>

      <CreateProjectModal
        open={createModalOpen}
        onClose={() =>
          setCreateModalOpen(false)
        }
        onSubmit={
          handleCreateProject
        }
        submitting={creating}
      />
    </>
  );
}

export default Projects;