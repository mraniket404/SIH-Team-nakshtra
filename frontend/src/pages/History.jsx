import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getAnalyses } from "../services/analysisApi";
import { useAuth } from "../context/AuthContext";


function History() {
  const { token } = useAuth();

  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  /* =====================================================
     LOAD ANALYSIS HISTORY
  ===================================================== */

  useEffect(() => {
    const loadHistory = async () => {
      if (!token) {
        setError(
          "Authentication token is missing. Please login again."
        );

        setLoading(false);

        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await getAnalyses(token);

        setAnalyses(
          Array.isArray(response?.analyses)
            ? response.analyses
            : []
        );

      } catch (error) {
        console.error(
          "History loading error:",
          error
        );

        setError(
          error.message ||
            "Unable to load analysis history."
        );

      } finally {
        setLoading(false);
      }
    };


    loadHistory();
  }, [token]);


  /* =====================================================
     FORMAT DATE
  ===================================================== */

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };


  /* =====================================================
     FORMAT ANALYSIS TYPE
  ===================================================== */

  const formatInputType = (type) => {
    if (!type) {
      return "Unknown";
    }

    const labels = {
      ndvi: "NDVI",
      single: "Single Image",
      "cross-modal": "Optical + SAR",
      "bi-temporal": "Bi-Temporal",
    };

    return (
      labels[type] ||
      type
        .replace(/-/g, " ")
        .replace(/\b\w/g, (letter) =>
          letter.toUpperCase()
        )
    );
  };


  /* =====================================================
     STATUS STYLE
  ===================================================== */

  const getStatusStyle = (status) => {
    switch (status) {
      case "completed":
        return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";

      case "processing":
        return "border-cyan-400/20 bg-cyan-400/10 text-cyan-300";

      case "failed":
        return "border-red-400/20 bg-red-400/10 text-red-300";

      case "validating":
        return "border-amber-400/20 bg-amber-400/10 text-amber-300";

      default:
        return "border-slate-400/20 bg-slate-400/10 text-slate-300";
    }
  };


  /* =====================================================
     NDVI SUMMARY
  ===================================================== */

  const getNdviSummary = (analysis) => {
    const ndvi =
      analysis?.ndviResult?.analysis;

    if (!ndvi) {
      return null;
    }

    return {
      mean:
        ndvi.statistics?.mean,

      healthy:
        ndvi.vegetation?.healthy_percentage,

      files:
        analysis.files?.length || 0,
    };
  };


  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="mx-auto max-w-6xl">

      {/* =========================
          HEADER
      ========================= */}

      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
        Analysis Records
      </p>

      <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

        <div>
          <h1 className="text-3xl font-bold">
            Analysis History
          </h1>

          <p className="mt-2 text-slate-500">
            Review previously executed remote-sensing analyses.
          </p>
        </div>


        <Link
          to="/analysis/new"
          className="inline-flex w-fit items-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2.5 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
        >
          + New Analysis
        </Link>

      </div>


      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}


      {/* =========================
          LOADING
      ========================= */}

      {loading && (
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">

          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-400" />

          <p className="mt-4 text-sm text-slate-500">
            Loading analysis history...
          </p>

        </div>
      )}


      {/* =========================
          EMPTY STATE
      ========================= */}

      {!loading &&
        !error &&
        analyses.length === 0 && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-400/5 text-2xl">
              ◷
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-300">
              No analysis records yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Your completed remote-sensing analyses will appear here after you run your first analysis.
            </p>

            <Link
              to="/analysis/new"
              className="mt-6 inline-flex rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              Create Your First Analysis
            </Link>

          </div>
        )}


      {/* =========================
          DESKTOP TABLE
      ========================= */}

      {!loading &&
        analyses.length > 0 && (
          <div className="mt-8 hidden overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] md:block">

            {/* TABLE HEADER */}

            <div className="grid grid-cols-[2fr_1.3fr_1fr_1.4fr] border-b border-white/10 px-6 py-4 text-xs uppercase tracking-wider text-slate-600">

              <span>Analysis</span>

              <span>Task</span>

              <span>Status</span>

              <span>Date</span>

            </div>


            {/* TABLE ROWS */}

            <div className="divide-y divide-white/5">

              {analyses.map((analysis) => {

                const ndvi =
                  getNdviSummary(
                    analysis
                  );


                return (
                  <div
                    key={analysis._id}
                    className="grid grid-cols-[2fr_1.3fr_1fr_1.4fr] items-center px-6 py-5 transition hover:bg-white/[0.025]"
                  >

                    {/* ANALYSIS */}

                    <div className="min-w-0">

                      <Link
                        to={`/analysis/${analysis._id}`}
                        className="block truncate font-semibold text-slate-200 transition hover:text-cyan-300"
                      >
                        {analysis.project?.name ||
                          "Untitled Project"}
                      </Link>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {analysis.project?.location ||
                          "Location unavailable"}
                      </p>

                      {ndvi && (
                        <p className="mt-2 text-xs text-slate-600">
                          Mean NDVI:{" "}
                          <span className="text-cyan-400">
                            {Number(
                              ndvi.mean
                            ).toFixed(4)}
                          </span>
                        </p>
                      )}

                    </div>


                    {/* TASK */}

                    <div>

                      <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-medium text-slate-400">
                        {formatInputType(
                          analysis.inputType
                        )}
                      </span>

                      <p className="mt-2 text-xs text-slate-600">
                        {analysis.files?.length ||
                          0}{" "}
                        file
                        {analysis.files?.length ===
                        1
                          ? ""
                          : "s"}
                      </p>

                    </div>


                    {/* STATUS */}

                    <div>

                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                          analysis.status
                        )}`}
                      >
                        {analysis.status ||
                          "unknown"}
                      </span>

                    </div>


                    {/* DATE */}

                    <div>

                      <p className="text-sm text-slate-400">
                        {formatDate(
                          analysis.createdAt
                        )}
                      </p>

                      <Link
                        to={`/analysis/${analysis._id}`}
                        className="mt-2 inline-block text-xs font-semibold text-cyan-400 transition hover:text-cyan-300"
                      >
                        View Analysis →
                      </Link>

                    </div>

                  </div>
                );
              })}

            </div>

          </div>
        )}


      {/* =========================
          MOBILE CARDS
      ========================= */}

      {!loading &&
        analyses.length > 0 && (
          <div className="mt-8 space-y-4 md:hidden">

            {analyses.map((analysis) => {

              const ndvi =
                getNdviSummary(
                  analysis
                );


              return (
                <div
                  key={analysis._id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div className="min-w-0">

                      <Link
                        to={`/analysis/${analysis._id}`}
                        className="font-semibold text-slate-200 hover:text-cyan-300"
                      >
                        {analysis.project?.name ||
                          "Untitled Project"}
                      </Link>

                      <p className="mt-1 text-xs text-slate-500">
                        {analysis.project?.location ||
                          "Location unavailable"}
                      </p>

                    </div>


                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                        analysis.status
                      )}`}
                    >
                      {analysis.status}
                    </span>

                  </div>


                  <div className="mt-5 grid grid-cols-2 gap-3">

                    <div className="rounded-xl border border-white/5 bg-black/10 p-3">

                      <p className="text-[10px] uppercase tracking-wider text-slate-600">
                        Task
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        {formatInputType(
                          analysis.inputType
                        )}
                      </p>

                    </div>


                    <div className="rounded-xl border border-white/5 bg-black/10 p-3">

                      <p className="text-[10px] uppercase tracking-wider text-slate-600">
                        Files
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        {analysis.files?.length ||
                          0}
                      </p>

                    </div>

                  </div>


                  {ndvi && (
                    <div className="mt-3 grid grid-cols-2 gap-3">

                      <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/5 p-3">

                        <p className="text-[10px] uppercase tracking-wider text-slate-600">
                          Mean NDVI
                        </p>

                        <p className="mt-1 text-sm font-semibold text-cyan-300">
                          {Number(
                            ndvi.mean
                          ).toFixed(4)}
                        </p>

                      </div>


                      <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/5 p-3">

                        <p className="text-[10px] uppercase tracking-wider text-slate-600">
                          Healthy
                        </p>

                        <p className="mt-1 text-sm font-semibold text-emerald-300">
                          {Number(
                            ndvi.healthy
                          ).toFixed(2)}
                          %
                        </p>

                      </div>

                    </div>
                  )}


                  <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">

                    <p className="text-xs text-slate-600">
                      {formatDate(
                        analysis.createdAt
                      )}
                    </p>

                    <Link
                      to={`/analysis/${analysis._id}`}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                    >
                      View Analysis →
                    </Link>

                  </div>

                </div>
              );
            })}

          </div>
        )}

    </div>
  );
}


export default History;