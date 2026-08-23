function History() {
  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
        Analysis Records
      </p>

      <h1 className="mt-2 text-3xl font-bold">
        Analysis History
      </h1>

      <p className="mt-2 text-slate-500">
        Review previously executed remote-sensing analyses.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        <div className="grid grid-cols-4 border-b border-white/10 px-6 py-4 text-xs uppercase tracking-wider text-slate-600">
          <span>Analysis</span>
          <span>Task</span>
          <span>Status</span>
          <span>Date</span>
        </div>

        <div className="p-10 text-center">
          <p className="text-sm text-slate-600">
            No analysis records available.
          </p>

          <p className="mt-2 text-xs text-slate-700">
            History will be retrieved from the real backend.
          </p>
        </div>
      </div>
    </div>
  );
}

export default History;