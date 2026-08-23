import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  getAnalysis,
} from "../services/analysisApi";

import {
  useAuth,
} from "../context/AuthContext";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";


/* =====================================================
   API CONFIG
===================================================== */

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const BACKEND_BASE_URL =
  API_BASE_URL.replace(
    /\/api\/?$/,
    ""
  );


/* =====================================================
   FORMAT BYTES
===================================================== */

function formatBytes(bytes) {
  if (!bytes) {
    return "0 B";
  }

  const units = [
    "B",
    "KB",
    "MB",
    "GB",
  ];

  const index = Math.floor(
    Math.log(bytes) /
      Math.log(1024)
  );

  return `${(
    bytes /
    Math.pow(1024, index)
  ).toFixed(2)} ${units[index]}`;
}


/* =====================================================
   FORMAT NUMBER
===================================================== */

function formatNumber(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return "—";
  }

  return Number(value).toLocaleString();
}


/* =====================================================
   ANALYSIS RESULT
===================================================== */

function AnalysisResult() {
  const { id } = useParams();

  const {
    token,
    loading: authLoading,
    isAuthenticated,
  } = useAuth();

  const [
    analysis,
    setAnalysis,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");


  /* =================================================
     LOAD ANALYSIS
  ================================================= */

  useEffect(() => {

    if (authLoading) {
      return;
    }

    if (
      !isAuthenticated ||
      !token
    ) {
      setError(
        "Authentication token is missing. Please login again."
      );

      setLoading(false);

      return;
    }

    if (!id) {
      setError(
        "Analysis ID is missing."
      );

      setLoading(false);

      return;
    }

    const loadAnalysis =
      async () => {

        try {

          setLoading(true);
          setError("");

          const response =
            await getAnalysis(
              id,
              token
            );

          console.log(
            "Analysis response:",
            response
          );

          if (
            !response?.success
          ) {
            throw new Error(
              response?.message ||
                "Unable to load analysis."
            );
          }

          if (
            !response?.analysis
          ) {
            throw new Error(
              "Analysis data was not returned by the server."
            );
          }

          setAnalysis(
            response.analysis
          );

        } catch (error) {

          console.error(
            "Load analysis error:",
            error
          );

          setError(
            error.message ||
              "Unable to load analysis."
          );

          setAnalysis(null);

        } finally {

          setLoading(false);

        }
      };

    loadAnalysis();

  }, [
    id,
    token,
    authLoading,
    isAuthenticated,
  ]);


  /* =================================================
     LOADING
  ================================================= */

  if (
    authLoading ||
    loading
  ) {
    return (
      <div className="mx-auto max-w-6xl">

        <div className="animate-pulse space-y-6">

          <div className="h-5 w-32 rounded bg-white/[0.05]" />

          <div className="h-10 w-80 rounded bg-white/[0.05]" />

          <div className="grid gap-6 md:grid-cols-2">

            <div className="h-40 rounded-3xl bg-white/[0.03]" />

            <div className="h-40 rounded-3xl bg-white/[0.03]" />

          </div>

          <div className="h-72 rounded-3xl bg-white/[0.03]" />

        </div>

      </div>
    );
  }


  /* =================================================
     ERROR
  ================================================= */

  if (!analysis) {

    return (
      <div className="mx-auto max-w-5xl rounded-3xl border border-red-400/10 bg-red-400/[0.03] p-10 text-center">

        <h1 className="text-xl font-semibold">
          Analysis unavailable
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          {error ||
            "The requested analysis could not be found."}
        </p>

        <Link
          to="/dashboard"
          className="mt-6 inline-block rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
        >
          Back to Dashboard
        </Link>

      </div>
    );
  }


  /* =================================================
     DATA
  ================================================= */

  const rasterMetadata =
    analysis.rasterMetadata || [];

  const ndvi =
    analysis.ndviResult ||
    null;


  /* =================================================
     NDVI PREVIEW URL
  ================================================= */

  /*
   * IMPORTANT:
   *
   * preview_url comes from ML service:
   *
   * /ml-outputs/ndvi/<analysisId>/ndvi_preview.png
   *
   * Backend base:
   *
   * http://localhost:5000
   */

  const ndviPreviewUrl = ndvi
  ? `${BACKEND_BASE_URL}/uploads/ndvi/ndvi_preview.png`
  : null;


  /* =================================================
     NDVI STATISTICS CHART DATA
  ================================================= */

  const ndviStatisticsData =
    ndvi?.statistics
      ? [
          {
            name: "Minimum",
            value: Number(
              ndvi.statistics.min
            ),
          },

          {
            name: "Maximum",
            value: Number(
              ndvi.statistics.max
            ),
          },

          {
            name: "Mean",
            value: Number(
              ndvi.statistics.mean
            ),
          },

          {
            name: "Median",
            value: Number(
              ndvi.statistics.median
            ),
          },
        ]
      : [];


  /* =================================================
     VEGETATION CHART DATA
  ================================================= */

  const vegetationData =
    ndvi?.vegetation
      ? [
          {
            name: "Low",
            value: Number(
              ndvi.vegetation
                .low_percentage
            ),
          },

          {
            name: "Moderate",
            value: Number(
              ndvi.vegetation
                .moderate_percentage
            ),
          },

          {
            name: "Healthy",
            value: Number(
              ndvi.vegetation
                .healthy_percentage
            ),
          },
        ]
      : [];


  const vegetationChartColors = [
    "#f59e0b",
    "#22d3ee",
    "#34d399",
  ];


  /* =================================================
     RENDER
  ================================================= */

  return (
    <div className="mx-auto max-w-6xl pb-12">

      {/* =================================================
          HEADER
      ================================================= */}

      <Link
        to="/dashboard"
        className="text-sm text-slate-600 transition hover:text-cyan-400"
      >
        ← Dashboard
      </Link>


      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">

        <div>

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Analysis
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Analysis Workspace
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Real remote-sensing imagery analysis
          </p>

        </div>


        <span
          className={`
            rounded-full px-4 py-2
            text-xs font-semibold
            uppercase tracking-wide
            ${
              analysis.status ===
              "failed"
                ? "bg-red-400/10 text-red-300"
                : analysis.status ===
                  "completed"
                ? "bg-emerald-400/10 text-emerald-300"
                : analysis.status ===
                  "processing"
                ? "bg-amber-400/10 text-amber-300"
                : "bg-cyan-400/10 text-cyan-400"
            }
          `}
        >
          {analysis.status}
        </span>

      </div>


      {/* =================================================
          PROJECT / INPUT
      ================================================= */}

      <div className="mt-8 grid gap-6 md:grid-cols-2">

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
            Project
          </p>

          <h2 className="mt-3 font-semibold">
            {analysis.project?.name ||
              "Unknown project"}
          </h2>

          {analysis.project?.location && (
            <p className="mt-2 text-sm text-slate-500">
              {analysis.project.location}
            </p>
          )}

        </section>


        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
            Input Configuration
          </p>

          <h2 className="mt-3 font-semibold capitalize">
            {analysis.inputType
              ?.replaceAll(
                "-",
                " + "
              )}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {analysis.files?.length ||
              0}{" "}
            image
            {analysis.files?.length ===
            1
              ? ""
              : "s"}{" "}
            uploaded
          </p>

        </section>

      </div>


      {/* =================================================
          QUERY
      ================================================= */}

      {analysis.query && (

        <section className="mt-6 rounded-3xl border border-cyan-400/10 bg-cyan-400/[0.03] p-6">

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
            Natural Language Query
          </p>

          <p className="mt-4 text-sm leading-7 text-slate-300">
            {analysis.query}
          </p>

        </section>

      )}


      {/* =================================================
          NDVI RESULT
      ================================================= */}

      {ndvi && (

        <section className="mt-6 rounded-3xl border border-emerald-400/10 bg-emerald-400/[0.025] p-6">

          {/* HEADER */}

          <div className="flex flex-wrap items-center justify-between gap-3">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                NDVI Analysis
              </p>

              <h2 className="mt-2 text-lg font-semibold">
                Vegetation Analysis
              </h2>

            </div>

            <span className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
              Completed
            </span>

          </div>


          {/* =================================================
              BANDS
          ================================================= */}

          <div className="mt-6 grid gap-4 md:grid-cols-2">

            <MetadataCard
              label="Red Band"
              value={
                ndvi.red_band ||
                "—"
              }
            />

            <MetadataCard
              label="NIR Band"
              value={
                ndvi.nir_band ||
                "—"
              }
            />

          </div>


          {/* =================================================
              NDVI STATISTICS
          ================================================= */}

          {ndvi.statistics && (

            <div className="mt-6">

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                NDVI Statistics
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                <MetadataCard
                  label="Minimum"
                  value={Number(
                    ndvi.statistics.min
                  ).toFixed(4)}
                />

                <MetadataCard
                  label="Maximum"
                  value={Number(
                    ndvi.statistics.max
                  ).toFixed(4)}
                />

                <MetadataCard
                  label="Mean"
                  value={Number(
                    ndvi.statistics.mean
                  ).toFixed(4)}
                />

                <MetadataCard
                  label="Median"
                  value={Number(
                    ndvi.statistics.median
                  ).toFixed(4)}
                />

              </div>

            </div>

          )}


          {/* =================================================
              VEGETATION DISTRIBUTION
          ================================================= */}

          {ndvi.vegetation && (

            <div className="mt-6">

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                Vegetation Distribution
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">

                <MetadataCard
                  label="Low Vegetation"
                  value={`${Number(
                    ndvi.vegetation
                      .low_percentage
                  ).toFixed(2)}%`}
                />

                <MetadataCard
                  label="Moderate Vegetation"
                  value={`${Number(
                    ndvi.vegetation
                      .moderate_percentage
                  ).toFixed(2)}%`}
                />

                <MetadataCard
                  label="Healthy Vegetation"
                  value={`${Number(
                    ndvi.vegetation
                      .healthy_percentage
                  ).toFixed(2)}%`}
                />

              </div>

            </div>

          )}


          {/* =================================================
              NDVI PREVIEW
          ================================================= */}

          <div className="mt-8">

            <div className="rounded-2xl border border-violet-400/10 bg-slate-950/40 p-5">

              <div className="mb-5">

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">
                  NDVI Visualization
                </p>

                <h3 className="mt-2 text-base font-semibold text-slate-200">
                  Vegetation Health Map
                </h3>

                <p className="mt-1 text-xs leading-6 text-slate-500">
                  Generated NDVI visualization from
                  the uploaded Red (B04) and NIR
                  (B08) satellite imagery.
                </p>

              </div>


              {/* IMAGE */}

              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">

                {ndviPreviewUrl ? (

                  <img
                    src={ndviPreviewUrl}
                    alt="NDVI vegetation health visualization"
                    className="block max-h-[650px] w-full object-contain"
                    loading="lazy"
                    onLoad={() => {
                      console.log(
                        "NDVI preview loaded:",
                        ndviPreviewUrl
                      );
                    }}
                    onError={(event) => {

                      console.error(
                        "NDVI preview failed:",
                        ndviPreviewUrl
                      );

                      event.currentTarget.style.display =
                        "none";

                    }}
                  />

                ) : (

                  <div className="flex min-h-[300px] items-center justify-center">

                    <div className="text-center">

                      <p className="text-sm font-medium text-slate-400">
                        NDVI preview is not available.
                      </p>

                      <p className="mt-2 text-xs text-slate-600">
                        The NDVI raster was processed,
                        but no preview URL was returned.
                      </p>

                    </div>

                  </div>

                )}

              </div>


              {/* IMAGE INFO */}

              <div className="mt-4 flex flex-wrap gap-2">

                <span className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-slate-500">
                  Red: B04
                </span>

                <span className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-slate-500">
                  NIR: B08
                </span>

                <span className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-slate-500">
                  Resolution: 10m
                </span>

                <span className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-slate-500">
                  CRS: {ndvi.crs || "—"}
                </span>

              </div>


              {/* PREVIEW URL DEBUG INFO */}

              {ndviPreviewUrl && (

                <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] p-3">

                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-700">
                    Preview URL
                  </p>

                  <p className="mt-1 break-all text-xs text-slate-600">
                    {ndviPreviewUrl}
                  </p>

                </div>

              )}

            </div>

          </div>


          {/* =================================================
              NDVI CHARTS
          ================================================= */}

          {(
            ndviStatisticsData.length > 0 ||
            vegetationData.length > 0
          ) && (

            <div className="mt-8 grid gap-6 lg:grid-cols-2">


              {/* =================================================
                  BAR CHART
              ================================================= */}

              {ndviStatisticsData.length > 0 && (

                <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">

                  <div className="mb-5">

                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
                      NDVI Statistics
                    </p>

                    <h3 className="mt-2 text-base font-semibold text-slate-200">
                      NDVI Value Distribution
                    </h3>

                    <p className="mt-1 text-xs leading-6 text-slate-500">
                      Minimum, maximum, mean and median
                      calculated from valid pixels.
                    </p>

                  </div>


                  <div className="h-72 w-full">

                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >

                      <BarChart
                        data={
                          ndviStatisticsData
                        }
                        margin={{
                          top: 10,
                          right: 10,
                          left: -10,
                          bottom: 5,
                        }}
                      >

                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(255,255,255,0.08)"
                        />

                        <XAxis
                          dataKey="name"
                          tick={{
                            fill: "#94a3b8",
                            fontSize: 11,
                          }}
                          axisLine={false}
                          tickLine={false}
                        />

                        <YAxis
                          domain={[
                            -1,
                            1,
                          ]}
                          tick={{
                            fill: "#94a3b8",
                            fontSize: 11,
                          }}
                          axisLine={false}
                          tickLine={false}
                        />

                        <Tooltip
                          contentStyle={{
                            background:
                              "#020617",
                            border:
                              "1px solid rgba(255,255,255,0.1)",
                            borderRadius:
                              "12px",
                            color:
                              "#e2e8f0",
                          }}
                          formatter={(
                            value
                          ) =>
                            Number(
                              value
                            ).toFixed(4)
                          }
                        />

                        <Bar
                          dataKey="value"
                          fill="#22d3ee"
                          radius={[
                            6,
                            6,
                            0,
                            0,
                          ]}
                        />

                      </BarChart>

                    </ResponsiveContainer>

                  </div>

                </div>

              )}


              {/* =================================================
                  PIE CHART
              ================================================= */}

              {vegetationData.length > 0 && (

                <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">

                  <div className="mb-5">

                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                      Vegetation Distribution
                    </p>

                    <h3 className="mt-2 text-base font-semibold text-slate-200">
                      Vegetation Health
                    </h3>

                    <p className="mt-1 text-xs leading-6 text-slate-500">
                      Percentage of valid pixels in
                      each vegetation class.
                    </p>

                  </div>


                  <div className="h-72 w-full">

                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >

                      <PieChart>

                        <Pie
                          data={
                            vegetationData
                          }
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="45%"
                          outerRadius={90}
                          innerRadius={48}
                          paddingAngle={3}
                          label={({
                            name,
                            value,
                          }) =>
                            `${name} ${Number(
                              value
                            ).toFixed(
                              2
                            )}%`
                          }
                          labelLine={false}
                        >

                          {vegetationData.map(
                            (
                              _,
                              index
                            ) => (

                              <Cell
                                key={`vegetation-${index}`}
                                fill={
                                  vegetationChartColors[
                                    index
                                  ]
                                }
                              />

                            )
                          )}

                        </Pie>


                        <Tooltip
                          contentStyle={{
                            background:
                              "#020617",
                            border:
                              "1px solid rgba(255,255,255,0.1)",
                            borderRadius:
                              "12px",
                            color:
                              "#e2e8f0",
                          }}
                          formatter={(
                            value
                          ) =>
                            `${Number(
                              value
                            ).toFixed(
                              2
                            )}%`
                          }
                        />


                        <Legend
                          verticalAlign="bottom"
                          iconType="circle"
                          wrapperStyle={{
                            color:
                              "#94a3b8",
                            fontSize:
                              "12px",
                          }}
                        />

                      </PieChart>

                    </ResponsiveContainer>

                  </div>

                </div>

              )}

            </div>

          )}


          {/* =================================================
              VALID PIXELS
          ================================================= */}

          {ndvi.valid_pixel_count !==
            undefined && (

            <div className="mt-6">

              <MetadataCard
                label="Valid Pixels"
                value={formatNumber(
                  ndvi.valid_pixel_count
                )}
              />

            </div>

          )}


          {/* =================================================
              NDVI DIMENSIONS
          ================================================= */}

          {ndvi.dimensions && (

            <div className="mt-4 grid gap-3 sm:grid-cols-3">

              <MetadataCard
                label="Width"
                value={formatNumber(
                  ndvi.dimensions
                    .width
                )}
              />

              <MetadataCard
                label="Height"
                value={formatNumber(
                  ndvi.dimensions
                    .height
                )}
              />

              <MetadataCard
                label="CRS"
                value={
                  ndvi.crs || "—"
                }
              />

            </div>

          )}


          {/* =================================================
              OUTPUT
          ================================================= */}

          {ndvi.output_file && (

            <div className="mt-6 rounded-xl border border-white/5 bg-white/[0.02] p-4">

              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-700">
                Generated NDVI Raster
              </p>

              <p className="mt-2 break-all text-xs text-slate-400">
                {ndvi.output_file}
              </p>

            </div>

          )}

        </section>

      )}


      {/* =================================================
          UPLOADED FILES
      ================================================= */}

      <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">

        <div className="flex flex-wrap items-center justify-between gap-3">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
              Input Data
            </p>

            <h2 className="mt-2 text-lg font-semibold">
              Uploaded Imagery
            </h2>

          </div>

          <span className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-slate-500">
            {analysis.files?.length ||
              0}{" "}
            file
            {analysis.files?.length ===
            1
              ? ""
              : "s"}
          </span>

        </div>


        <div className="mt-6 space-y-3">

          {analysis.files?.map(
            (
              file,
              index
            ) => (

              <div
                key={
                  file.storedName ||
                  `${file.originalName}-${index}`
                }
                className="rounded-2xl border border-white/10 bg-slate-950/50 p-5"
              >

                <div className="flex flex-wrap items-start justify-between gap-4">

                  <div>

                    <p className="text-sm font-medium text-slate-200">
                      {file.originalName}
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      {file.storedName}
                    </p>

                  </div>

                  <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs capitalize text-cyan-400">
                    {file.modality ||
                      "unknown"}
                  </span>

                </div>


                <div className="mt-4 grid gap-3 sm:grid-cols-3">

                  <MetadataCard
                    label="Size"
                    value={formatBytes(
                      file.size
                    )}
                  />

                  <MetadataCard
                    label="MIME"
                    value={
                      file.mimeType ||
                      "—"
                    }
                  />

                  <MetadataCard
                    label="Band"
                    value={
                      file.band ||
                      "Not specified"
                    }
                  />

                </div>

              </div>

            )
          )}

        </div>

      </section>


      {/* =================================================
          RASTER VALIDATION
      ================================================= */}

      <section className="mt-6 rounded-3xl border border-emerald-400/10 bg-emerald-400/[0.025] p-6">

        <div className="flex flex-wrap items-center justify-between gap-3">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
              Raster Validation
            </p>

            <h2 className="mt-2 text-lg font-semibold">
              GeoTIFF Metadata
            </h2>

            <p className="mt-1 text-xs text-slate-600">
              Metadata extracted from the uploaded imagery
              using Rasterio.
            </p>

          </div>

          <span className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
            Validated
          </span>

        </div>


        {rasterMetadata.length ===
        0 ? (

          <div className="mt-6 rounded-2xl border border-amber-400/10 bg-amber-400/[0.03] p-5">

            <p className="text-sm font-medium text-amber-300">
              Raster metadata unavailable
            </p>

            <p className="mt-2 text-xs leading-6 text-slate-600">
              The imagery record exists, but raster metadata
              has not been stored yet.
            </p>

          </div>

        ) : (

          <div className="mt-6 space-y-5">

            {rasterMetadata.map(
              (
                raster,
                index
              ) => (

                <div
                  key={`${raster.fileName}-${index}`}
                  className="rounded-2xl border border-white/10 bg-slate-950/50 p-5"
                >

                  <div className="flex flex-wrap items-center justify-between gap-3">

                    <div>

                      <p className="text-sm font-medium text-slate-200">
                        {raster.fileName}
                      </p>

                      <p className="mt-1 text-xs text-slate-600">
                        {raster.format ||
                          "GeoTIFF"}
                      </p>

                    </div>

                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-500">
                      Raster{" "}
                      {index + 1}
                    </span>

                  </div>


                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                    <MetadataCard
                      label="Width"
                      value={formatNumber(
                        raster.width
                      )}
                    />

                    <MetadataCard
                      label="Height"
                      value={formatNumber(
                        raster.height
                      )}
                    />

                    <MetadataCard
                      label="Bands"
                      value={formatNumber(
                        raster.band_count
                      )}
                    />

                    <MetadataCard
                      label="Data Type"
                      value={
                        raster.dtype ||
                        "—"
                      }
                    />

                  </div>


                  <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                    <MetadataCard
                      label="CRS"
                      value={
                        raster.crs ||
                        "Not defined"
                      }
                    />

                    <MetadataCard
                      label="Resolution"
                      value={
                        raster.resolution
                          ? `${raster.resolution.x} × ${raster.resolution.y}`
                          : "—"
                      }
                    />

                    <MetadataCard
                      label="NoData"
                      value={
                        raster.nodata ??
                        "—"
                      }
                    />

                    <MetadataCard
                      label="Format"
                      value={
                        raster.format ||
                        "GeoTIFF"
                      }
                    />

                  </div>


                  {raster.bounds && (

                    <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">

                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-700">
                        Spatial Bounds
                      </p>

                      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                        <MetadataCard
                          label="Left"
                          value={
                            raster
                              .bounds
                              .left
                          }
                        />

                        <MetadataCard
                          label="Bottom"
                          value={
                            raster
                              .bounds
                              .bottom
                          }
                        />

                        <MetadataCard
                          label="Right"
                          value={
                            raster
                              .bounds
                              .right
                          }
                        />

                        <MetadataCard
                          label="Top"
                          value={
                            raster
                              .bounds
                              .top
                          }
                        />

                      </div>

                    </div>

                  )}

                </div>

              )
            )}

          </div>

        )}

      </section>


      {/* =================================================
          PIPELINE STATUS
      ================================================= */}

      <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">

        <div className="flex items-start gap-4">

          <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400" />

          <div>

            <p className="text-sm font-medium text-emerald-300">
              Real imagery successfully processed
            </p>

            <p className="mt-2 text-xs leading-6 text-slate-600">
              The uploaded GeoTIFF has been stored,
              validated and processed through the
              Python remote-sensing service.
            </p>

          </div>

        </div>

      </section>


      {/* =================================================
          ERROR MESSAGE
      ================================================= */}

      {analysis.errorMessage && (

        <section className="mt-6 rounded-3xl border border-red-400/10 bg-red-400/[0.03] p-6">

          <p className="text-sm font-semibold text-red-300">
            Processing Error
          </p>

          <p className="mt-2 text-xs leading-6 text-slate-500">
            {analysis.errorMessage}
          </p>

        </section>

      )}

    </div>
  );
}


/* =====================================================
   METADATA CARD
===================================================== */

function MetadataCard({
  label,
  value,
}) {

  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">

      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-700">
        {label}
      </p>

      <p className="mt-1 break-all text-xs font-medium text-slate-400">
        {value}
      </p>

    </div>
  );
}


export default AnalysisResult;