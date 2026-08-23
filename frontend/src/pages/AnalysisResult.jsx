import { Link, useParams } from "react-router-dom";

function AnalysisResult() {
  const { id } = useParams();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-cyan-400">
            Analysis Result
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Analysis {id}
          </h1>
        </div>

        <Link
          to="/analysis/new"
          className="rounded-xl border border-white/10 px-5 py-3 text-sm text-slate-300 hover:bg-white/5"
        >
          New Analysis
        </Link>
      </div>

      <div className="rounded-2xl border border-amber-400/10 bg-amber-400/[0.03] p-6">
        <h2 className="font-semibold text-amber-300">
          Result unavailable
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          No real analysis result has been generated for this
          analysis ID yet. Results will be populated from the
          actual backend and AI service once the analysis pipeline
          is connected.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="font-semibold">
            Answer
          </h2>

          <p className="mt-4 text-sm text-slate-600">
            Awaiting real model output.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="font-semibold">
            Confidence
          </h2>

          <p className="mt-4 text-sm text-slate-600">
            Awaiting actual model confidence.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="font-semibold">
          Evidence
        </h2>

        <div className="mt-4 flex min-h-48 items-center justify-center rounded-xl border border-dashed border-white/10">
          <p className="text-sm text-slate-600">
            Actual evidence will appear here after analysis.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="font-semibold">
          Execution Trace
        </h2>

        <p className="mt-3 text-sm text-slate-600">
          No execution has been recorded yet.
        </p>
      </div>
    </div>
  );
}

export default AnalysisResult;