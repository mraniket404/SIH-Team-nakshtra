function Reports() {
  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
        Documentation
      </p>

      <h1 className="mt-2 text-3xl font-bold">
        Reports
      </h1>

      <p className="mt-2 text-slate-500">
        Download analysis reports containing results, evidence,
        metadata and execution information.
      </p>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-slate-500">
          PDF
        </div>

        <h2 className="mt-5 font-semibold">
          No reports available
        </h2>

        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">
          Reports will be generated from completed real analyses.
        </p>
      </div>
    </div>
  );
}

export default Reports;