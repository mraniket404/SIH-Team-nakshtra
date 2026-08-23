function Models() {
  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
        AI Infrastructure
      </p>

      <h1 className="mt-2 text-3xl font-bold">
        Model Registry
      </h1>

      <p className="mt-2 text-slate-500">
        Remote-sensing specialist models available to the agent.
      </p>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-400">
          AI
        </div>

        <h2 className="mt-5 font-semibold">
          Model registry not connected
        </h2>

        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">
          Models will be retrieved from the Python AI service
          registry. The frontend will not manually choose AI models.
        </p>
      </div>
    </div>
  );
}

export default Models;