import { useEffect, useState } from "react";

function CreateProjectModal({
  open,
  onClose,
  onSubmit,
  submitting,
}) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
    areaOfInterest: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm({
        name: "",
        description: "",
        location: "",
        areaOfInterest: "",
      });

      setError("");
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError(
        "Project name is required."
      );

      return;
    }

    try {
      await onSubmit({
        name: form.name.trim(),
        description:
          form.description.trim(),
        location:
          form.location.trim(),
        areaOfInterest:
          form.areaOfInterest.trim(),
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to create project."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold">
              Create Project
            </h2>

            <p className="mt-1 text-xs text-slate-600">
              Create a workspace for your remote-sensing analysis.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-500 hover:bg-white/5 hover:text-white"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
          {error && (
            <div className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Project name *
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Mumbai Urban Change Analysis"
              disabled={submitting}
              autoFocus
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-700 focus:border-cyan-400/50"
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
              rows={3}
              placeholder="Describe the purpose of this project..."
              disabled={submitting}
              className="w-full resize-none rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-700 focus:border-cyan-400/50"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Location
              </label>

              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Mumbai, Maharashtra"
                disabled={submitting}
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-700 focus:border-cyan-400/50"
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
                placeholder="Coordinates / AOI reference"
                disabled={submitting}
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-700 focus:border-cyan-400/50"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl border border-white/10 px-5 py-3 text-sm text-slate-400 hover:bg-white/5"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
              )}

              {submitting
                ? "Creating..."
                : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProjectModal;