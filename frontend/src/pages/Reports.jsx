import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { getAnalyses } from "../services/analysisApi";
import { useAuth } from "../context/AuthContext";

function Reports() {
  const { token } = useAuth();

  const [analyses, setAnalyses] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  const reportRef = useRef(null);

  /* =====================================================
     LOAD COMPLETED ANALYSES
  ===================================================== */

  useEffect(() => {
    const loadReports = async () => {
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

        const response = await getAnalyses(token);

        const records = Array.isArray(
          response?.analyses
        )
          ? response.analyses
          : [];

        const completedRecords = records.filter(
          (analysis) =>
            analysis.status === "completed"
        );

        setAnalyses(completedRecords);

        if (completedRecords.length > 0) {
          setSelectedId(
            completedRecords[0]._id
          );
        }
      } catch (err) {
        console.error(
          "Reports loading error:",
          err
        );

        setError(
          err.message ||
            "Unable to load reports."
        );
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [token]);

  /* =====================================================
     SELECTED REPORT
  ===================================================== */

  const selectedAnalysis = useMemo(() => {
    return analyses.find(
      (analysis) =>
        analysis._id === selectedId
    );
  }, [analyses, selectedId]);

  const ndvi =
    selectedAnalysis?.ndviResult?.analysis ||
    null;

  /* =====================================================
     HELPERS
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

  const formatInputType = (type) => {
    const labels = {
      ndvi: "NDVI",
      single: "Single Image",
      "cross-modal":
        "Optical + SAR",
      "bi-temporal":
        "Bi-Temporal",
    };

    return (
      labels[type] ||
      type ||
      "Unknown"
    );
  };

  const formatNumber = (
    value,
    digits = 4
  ) => {
    if (
      value === null ||
      value === undefined ||
      Number.isNaN(Number(value))
    ) {
      return "—";
    }

    return Number(value).toFixed(digits);
  };

  /* =====================================================
     DOWNLOAD PDF
  ===================================================== */

  const downloadPDF = async () => {
    if (!reportRef.current) {
      return;
    }

    if (!selectedAnalysis) {
      return;
    }

    try {
      setDownloading(true);

      const canvas =
        await html2canvas(
          reportRef.current,
          {
            scale: 2,
            useCORS: true,
            backgroundColor: "#020617",
            logging: false,
          }
        );

      const imageData =
        canvas.toDataURL(
          "image/png",
          1.0
        );

      const pdf =
        new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

      const pageWidth =
        pdf.internal.pageSize.getWidth();

      const pageHeight =
        pdf.internal.pageSize.getHeight();

      const imageWidth =
        pageWidth;

      const imageHeight =
        (canvas.height *
          imageWidth) /
        canvas.width;

      let heightLeft =
        imageHeight;

      let position = 0;

      pdf.addImage(
        imageData,
        "PNG",
        0,
        position,
        imageWidth,
        imageHeight,
        undefined,
        "FAST"
      );

      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position =
          heightLeft -
          imageHeight;

        pdf.addPage();

        pdf.addImage(
          imageData,
          "PNG",
          0,
          position,
          imageWidth,
          imageHeight,
          undefined,
          "FAST"
        );

        heightLeft -= pageHeight;
      }

      const projectName =
        selectedAnalysis.project
          ?.name ||
        "SatQuery";

      const safeProjectName =
        projectName
          .replace(
            /[^a-z0-9]/gi,
            "-"
          )
          .replace(
            /-+/g,
            "-"
          )
          .toLowerCase();

      const fileName =
        `${safeProjectName}-${selectedAnalysis.inputType}-analysis-report.pdf`;

      pdf.save(fileName);
    } catch (err) {
      console.error(
        "PDF generation error:",
        err
      );

      setError(
        "Unable to generate PDF report."
      );
    } finally {
      setDownloading(false);
    }
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="mx-auto max-w-6xl">

      {/* =================================================
          HEADER
      ================================================= */}

      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
        Documentation
      </p>

      <h1 className="mt-2 text-3xl font-bold">
        Reports
      </h1>

      <p className="mt-2 text-slate-500">
        Review completed remote-sensing
        analyses and download their
        generated reports.
      </p>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">

          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-400" />

          <p className="mt-4 text-sm text-slate-500">
            Loading completed analyses...
          </p>

        </div>
      )}

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {!loading &&
        !error &&
        analyses.length === 0 && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-400/5 text-sm font-bold text-cyan-400">
              PDF
            </div>

            <h2 className="mt-5 font-semibold text-slate-300">
              No completed reports
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
              Complete a remote-sensing
              analysis first. Its results
              will appear here automatically.
            </p>

            <Link
              to="/analysis/new"
              className="mt-6 inline-flex rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              Create Analysis
            </Link>

          </div>
        )}

      {/* =================================================
          REPORT CONTENT
      ================================================= */}

      {!loading &&
        analyses.length > 0 && (
          <>

            {/* =================================================
                REPORT SELECTOR
            ================================================= */}

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                    Completed Analyses
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Select an analysis to view
                    and download its report.
                  </p>
                </div>

                <select
                  value={selectedId}
                  onChange={(event) =>
                    setSelectedId(
                      event.target.value
                    )
                  }
                  className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-300 outline-none focus:border-cyan-400/40"
                >
                  {analyses.map(
                    (analysis) => (
                      <option
                        key={analysis._id}
                        value={analysis._id}
                      >
                        {analysis.project
                          ?.name ||
                          "Untitled Project"}{" "}
                        —{" "}
                        {formatInputType(
                          analysis.inputType
                        )}
                      </option>
                    )
                  )}
                </select>

              </div>

            </div>

            {/* =================================================
                REPORT
            ================================================= */}

            {selectedAnalysis && (
              <div
                ref={reportRef}
                id="analysis-report"
                className="mt-6 space-y-6 rounded-2xl bg-slate-950 p-1"
              >

                {/* =================================================
                    REPORT HEADER
                ================================================= */}

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                  <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">

                    <div>

                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
                        SatQuery AI
                      </p>

                      <h2 className="mt-2 text-2xl font-bold text-slate-200">
                        Remote Sensing Analysis Report
                      </h2>

                      <p className="mt-3 text-lg font-semibold text-slate-300">
                        {selectedAnalysis.project
                          ?.name ||
                          "Untitled Project"}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {selectedAnalysis.project
                          ?.location ||
                          "Location unavailable"}
                      </p>

                    </div>

                    <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300">
                      Completed
                    </div>

                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-600">
                        Analysis Type
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-300">
                        {formatInputType(
                          selectedAnalysis.inputType
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-600">
                        Files
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-300">
                        {selectedAnalysis.files
                          ?.length || 0}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-600">
                        Created
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-300">
                        {formatDate(
                          selectedAnalysis.createdAt
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-600">
                        Analysis ID
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {selectedAnalysis._id}
                      </p>
                    </div>

                  </div>

                </div>

                {/* =================================================
                    QUERY
                ================================================= */}

                {selectedAnalysis.query && (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                      Natural Language Query
                    </p>

                    <p className="mt-3 leading-7 text-slate-300">
                      {selectedAnalysis.query}
                    </p>

                  </div>
                )}

                {/* =================================================
                    NDVI
                ================================================= */}

                {ndvi && (
                  <>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
                        NDVI Results
                      </p>

                      <h3 className="mt-2 text-xl font-bold text-slate-200">
                        Vegetation Analysis
                      </h3>
                    </div>

                    {/* STATISTICS */}

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                        <p className="text-xs uppercase tracking-wider text-slate-600">
                          Minimum
                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-200">
                          {formatNumber(
                            ndvi.statistics?.min
                          )}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                        <p className="text-xs uppercase tracking-wider text-slate-600">
                          Maximum
                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-200">
                          {formatNumber(
                            ndvi.statistics?.max
                          )}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-5">
                        <p className="text-xs uppercase tracking-wider text-slate-600">
                          Mean
                        </p>

                        <p className="mt-2 text-2xl font-bold text-cyan-300">
                          {formatNumber(
                            ndvi.statistics?.mean
                          )}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-5">
                        <p className="text-xs uppercase tracking-wider text-slate-600">
                          Median
                        </p>

                        <p className="mt-2 text-2xl font-bold text-cyan-300">
                          {formatNumber(
                            ndvi.statistics?.median
                          )}
                        </p>
                      </div>

                    </div>

                    {/* VEGETATION */}

                    <div className="grid gap-4 sm:grid-cols-3">

                      <div className="rounded-2xl border border-amber-400/10 bg-amber-400/5 p-5">
                        <p className="text-xs uppercase tracking-wider text-slate-600">
                          Low Vegetation
                        </p>

                        <p className="mt-2 text-2xl font-bold text-amber-300">
                          {formatNumber(
                            ndvi.vegetation
                              ?.low_percentage,
                            2
                          )}
                          %
                        </p>
                      </div>

                      <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-5">
                        <p className="text-xs uppercase tracking-wider text-slate-600">
                          Moderate Vegetation
                        </p>

                        <p className="mt-2 text-2xl font-bold text-cyan-300">
                          {formatNumber(
                            ndvi.vegetation
                              ?.moderate_percentage,
                            2
                          )}
                          %
                        </p>
                      </div>

                      <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/5 p-5">
                        <p className="text-xs uppercase tracking-wider text-slate-600">
                          Healthy Vegetation
                        </p>

                        <p className="mt-2 text-2xl font-bold text-emerald-300">
                          {formatNumber(
                            ndvi.vegetation
                              ?.healthy_percentage,
                            2
                          )}
                          %
                        </p>
                      </div>

                    </div>

                    {/* TECHNICAL DATA */}

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                        NDVI Processing Information
                      </p>

                      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                        <div>
                          <p className="text-xs text-slate-600">
                            Valid Pixels
                          </p>

                          <p className="mt-1 font-semibold text-slate-300">
                            {Number(
                              ndvi.valid_pixel_count ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-600">
                            Width
                          </p>

                          <p className="mt-1 font-semibold text-slate-300">
                            {ndvi.dimensions
                              ?.width
                              ?.toLocaleString(
                                "en-IN"
                              ) ||
                              "—"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-600">
                            Height
                          </p>

                          <p className="mt-1 font-semibold text-slate-300">
                            {ndvi.dimensions
                              ?.height
                              ?.toLocaleString(
                                "en-IN"
                              ) ||
                              "—"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-600">
                            CRS
                          </p>

                          <p className="mt-1 font-semibold text-slate-300">
                            {ndvi.crs ||
                              "—"}
                          </p>
                        </div>

                      </div>

                    </div>

                  </>
                )}

                {/* =================================================
                    INPUT FILES
                ================================================= */}

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                    Input Imagery
                  </p>

                  <h3 className="mt-2 text-lg font-bold text-slate-200">
                    Uploaded Files
                  </h3>

                  <div className="mt-5 space-y-3">

                    {selectedAnalysis.files?.map(
                      (file) => (
                        <div
                          key={
                            file._id ||
                            file.storedName
                          }
                          className="rounded-xl border border-white/5 bg-black/10 p-4"
                        >

                          <div className="flex flex-col justify-between gap-3 sm:flex-row">

                            <div className="min-w-0">

                              <p className="truncate text-sm font-semibold text-slate-300">
                                {file.originalName}
                              </p>

                              <p className="mt-1 text-xs text-slate-600">
                                Stored as:{" "}
                                {file.storedName}
                              </p>

                            </div>

                            <div className="flex gap-4 text-xs text-slate-500">

                              <span>
                                {file.band ||
                                  "Band not specified"}
                              </span>

                              <span>
                                {file.size
                                  ? `${(
                                      file.size /
                                      (1024 *
                                        1024)
                                    ).toFixed(
                                      2
                                    )} MB`
                                  : "—"}
                              </span>

                            </div>

                          </div>

                        </div>
                      )
                    )}

                  </div>

                </div>

                {/* =================================================
                    RASTER METADATA
                ================================================= */}

                {selectedAnalysis
                  .rasterMetadata
                  ?.length > 0 && (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                      Raster Validation
                    </p>

                    <h3 className="mt-2 text-lg font-bold text-slate-200">
                      GeoTIFF Metadata
                    </h3>

                    <div className="mt-5 space-y-4">

                      {selectedAnalysis.rasterMetadata.map(
                        (metadata, index) => (
                          <div
                            key={
                              metadata.fileName ||
                              index
                            }
                            className="rounded-xl border border-white/5 bg-black/10 p-5"
                          >

                            <p className="font-semibold text-slate-300">
                              {metadata.fileName ||
                                metadata.filename ||
                                `Raster ${
                                  index + 1
                                }`}
                            </p>

                            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                              <div>
                                <p className="text-xs text-slate-600">
                                  Format
                                </p>

                                <p className="mt-1 text-sm text-slate-400">
                                  {metadata.format ||
                                    "—"}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-slate-600">
                                  Dimensions
                                </p>

                                <p className="mt-1 text-sm text-slate-400">
                                  {metadata.width?.toLocaleString(
                                    "en-IN"
                                  ) ||
                                    "—"}{" "}
                                  ×{" "}
                                  {metadata.height?.toLocaleString(
                                    "en-IN"
                                  ) ||
                                    "—"}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-slate-600">
                                  Data Type
                                </p>

                                <p className="mt-1 text-sm text-slate-400">
                                  {metadata.dtype ||
                                    "—"}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-slate-600">
                                  CRS
                                </p>

                                <p className="mt-1 text-sm text-slate-400">
                                  {metadata.crs ||
                                    "—"}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-slate-600">
                                  Resolution
                                </p>

                                <p className="mt-1 text-sm text-slate-400">
                                  {metadata.resolution
                                    ? `${metadata.resolution.x} × ${metadata.resolution.y}`
                                    : "—"}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-slate-600">
                                  Bands
                                </p>

                                <p className="mt-1 text-sm text-slate-400">
                                  {metadata.band_count ??
                                    "—"}
                                </p>
                              </div>

                            </div>

                          </div>
                        )
                      )}

                    </div>

                  </div>
                )}

                {/* =================================================
                    GENERATED OUTPUT
                ================================================= */}

                {ndvi?.output_file && (
                  <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-6">

                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
                      Generated Output
                    </p>

                    <h3 className="mt-2 text-lg font-bold text-slate-200">
                      NDVI Raster
                    </h3>

                    <p className="mt-3 break-all rounded-xl border border-white/5 bg-black/20 p-4 font-mono text-xs text-slate-500">
                      {ndvi.output_file}
                    </p>

                  </div>
                )}

              </div>
            )}

            {/* =================================================
                ACTION BUTTONS
            ================================================= */}

            {selectedAnalysis && (
              <div className="flex flex-col gap-3 pb-10 sm:flex-row">

                <button
                  type="button"
                  onClick={downloadPDF}
                  disabled={downloading}
                  className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {downloading
                    ? "Generating PDF..."
                    : "Download PDF"}
                </button>

                <Link
                  to={`/analysis/${selectedAnalysis._id}`}
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06]"
                >
                  View Full Analysis →
                </Link>

                <Link
                  to="/history"
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06]"
                >
                  View History
                </Link>

              </div>
            )}

          </>
        )}

    </div>
  );
}

export default Reports;