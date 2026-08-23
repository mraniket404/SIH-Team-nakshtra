import { useState } from "react";

import { createAnalysis } from "../../services/analysisApi";


const AnalysisUpload = ({
  projectId,
  token,
  inputType = "single",
}) => {

  const [files, setFiles] = useState([]);

  const [query, setQuery] = useState("");

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(null);

  const [error, setError] = useState("");


  const isNDVI =
    inputType === "ndvi";

  const isBiTemporal =
    inputType === "bi-temporal";

  const isCrossModal =
    inputType === "cross-modal";


  /* =====================================================
     FILE VALIDATION
  ===================================================== */

  const validateFiles = (selectedFiles) => {

    /* ===================================================
       NDVI
       Exactly B04 + B08
    =================================================== */

    if (isNDVI) {

      if (selectedFiles.length !== 2) {

        return (
          "NDVI analysis requires exactly 2 GeoTIFF files: B04 (Red) and B08 (NIR)."
        );
      }


      const b04Files =
        selectedFiles.filter((file) =>
          file.name
            .toUpperCase()
            .includes("B04")
        );


      const b08Files =
        selectedFiles.filter((file) =>
          file.name
            .toUpperCase()
            .includes("B08")
        );


      if (
        b04Files.length !== 1 ||
        b08Files.length !== 1
      ) {

        return (
          "For NDVI, upload exactly one B04 (Red) and one B08 (NIR) GeoTIFF file."
        );
      }


      return null;
    }


    /* ===================================================
       BI-TEMPORAL
       
       Earlier:
       B04 + B08

       Later:
       B04 + B08
    =================================================== */

    if (isBiTemporal) {

      if (selectedFiles.length !== 4) {

        return (
          "Bi-temporal analysis requires exactly 4 GeoTIFF files: Earlier B04, Earlier B08, Later B04 and Later B08."
        );
      }


      const b04Files =
        selectedFiles.filter((file) =>
          file.name
            .toUpperCase()
            .includes("B04")
        );


      const b08Files =
        selectedFiles.filter((file) =>
          file.name
            .toUpperCase()
            .includes("B08")
        );


      if (
        b04Files.length !== 2 ||
        b08Files.length !== 2
      ) {

        return (
          "Bi-temporal analysis requires 2 B04 files and 2 B08 files: one pair for Earlier and one pair for Later."
        );
      }


      const years =
        selectedFiles.map((file) =>
          getYearFromFilename(file.name)
        );


      const validYears =
        years.filter(
          (year) => year !== null
        );


      if (
        validYears.length !== 4
      ) {

        return (
          "Could not identify the year from all filenames. Use filenames containing 2017 and 2024."
        );
      }


      const earlierCount =
        validYears.filter(
          (year) => year === 2017
        ).length;


      const laterCount =
        validYears.filter(
          (year) => year === 2024
        ).length;


      if (
        earlierCount !== 2 ||
        laterCount !== 2
      ) {

        return (
          "Bi-temporal analysis requires exactly 2 files from 2017 and 2 files from 2024."
        );
      }


      return null;
    }


    /* ===================================================
       CROSS MODAL
    =================================================== */

    if (isCrossModal) {

      if (selectedFiles.length !== 2) {

        return (
          "Cross-modal analysis requires exactly 2 images."
        );
      }


      return null;
    }


    /* ===================================================
       SINGLE
    =================================================== */

    if (inputType === "single") {

      if (selectedFiles.length !== 1) {

        return (
          "Single analysis requires exactly 1 GeoTIFF file."
        );
      }


      return null;
    }


    return null;
  };


  /* =====================================================
     YEAR DETECTION
  ===================================================== */

  const getYearFromFilename = (
    filename = ""
  ) => {

    const match =
      filename.match(
        /(19|20)\d{2}/
      );


    if (!match) {
      return null;
    }


    return Number(
      match[0]
    );
  };


  /* =====================================================
     FILE CHANGE
  ===================================================== */

  const handleFileChange = (
    event
  ) => {

    const selectedFiles =
      Array.from(
        event.target.files || []
      );


    setError("");

    setResult(null);


    /* ===================================================
       SINGLE
    =================================================== */

    if (
      inputType === "single"
    ) {

      const firstFile =
        selectedFiles.slice(
          0,
          1
        );


      setFiles(
        firstFile
      );


      if (
        selectedFiles.length > 1
      ) {

        setError(
          "Single analysis accepts only one GeoTIFF file."
        );

      }


      return;
    }


    /* ===================================================
       OTHER TYPES
    =================================================== */

    const validationError =
      validateFiles(
        selectedFiles
      );


    setFiles(
      selectedFiles
    );


    if (validationError) {

      setError(
        validationError
      );

    }

  };


  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit =
    async (event) => {

      event.preventDefault();


      setError("");

      setResult(null);


      /* =================================================
         PROJECT
      ================================================= */

      if (!projectId) {

        setError(
          "Please select a project first."
        );

        return;
      }


      /* =================================================
         TOKEN
      ================================================= */

      if (!token) {

        setError(
          "Authentication token is missing. Please login again."
        );

        return;
      }


      /* =================================================
         FILES
      ================================================= */

      if (
        files.length === 0
      ) {

        if (isNDVI) {

          setError(
            "Please select B04 and B08 GeoTIFF files."
          );

        } else if (isBiTemporal) {

          setError(
            "Please select 4 GeoTIFF files: 2017 B04, 2017 B08, 2024 B04 and 2024 B08."
          );

        } else {

          setError(
            "Please select at least one GeoTIFF."
          );

        }


        return;
      }


      /* =================================================
         FINAL VALIDATION
      ================================================= */

      const validationError =
        validateFiles(
          files
        );


      if (validationError) {

        setError(
          validationError
        );

        return;
      }


      /* =================================================
         PROCESSING
      ================================================= */

      setLoading(true);


      try {

        const data =
          await createAnalysis({

            projectId,

            inputType,

            query,

            files,

            token,

          });


        console.log(
          "Analysis result:",
          data
        );


        setResult(
          data
        );


      } catch (err) {

        console.error(
          "Analysis upload error:",
          err
        );


        setError(
          err.message ||
          "Analysis upload failed."
        );


      } finally {

        setLoading(false);
      }

    };


  /* =====================================================
     UI TEXT
  ===================================================== */

  const getTitle = () => {

    if (isNDVI) {

      return "NDVI Satellite Bands";

    }


    if (isBiTemporal) {

      return "Bi-temporal Satellite Imagery";

    }


    if (isCrossModal) {

      return "Cross-modal Satellite Imagery";

    }


    return "Satellite GeoTIFF";
  };


  const getDescription = () => {

    if (isNDVI) {

      return (
        "Upload B04 (Red) and B08 (NIR) bands."
      );

    }


    if (isBiTemporal) {

      return (
        "Upload 4 GeoTIFF files: 2017 B04 + B08 and 2024 B04 + B08."
      );

    }


    if (isCrossModal) {

      return (
        "Upload 2 compatible satellite imagery files."
      );

    }


    return "";
  };


  const getButtonText = () => {

    if (loading) {

      return "Processing imagery...";

    }


    if (isNDVI) {

      return "Calculate NDVI";

    }


    if (isBiTemporal) {

      return "Analyze Vegetation Change";

    }


    return "Analyze Imagery";
  };


  /* =====================================================
     FILE GROUPING
  ===================================================== */

  const earlierFiles =
    isBiTemporal
      ? files.filter((file) =>
          getYearFromFilename(
            file.name
          ) === 2017
        )
      : [];


  const laterFiles =
    isBiTemporal
      ? files.filter((file) =>
          getYearFromFilename(
            file.name
          ) === 2024
        )
      : [];


  /* =====================================================
     RESULT HELPERS
  ===================================================== */

  const analysis =
    result?.analysis ||
    result?.data?.analysis ||
    result?.result?.analysis ||
    result?.data ||
    result;


  const ndviResult =
    result?.ndviResult ||
    analysis?.ndviResult ||
    null;


  const changeResult =
    result?.changeResult ||
    analysis?.changeResult ||
    result?.change ||
    analysis?.change ||
    null;


  /* =====================================================
     GET NUMBERS
  ===================================================== */

  const getNumber = (
    value
  ) => {

    const number =
      Number(value);

    return Number.isFinite(number)
      ? number
      : null;
  };


  /* =====================================================
     FIND NDVI DATA
  ===================================================== */

  const earlierNDVI =
    ndviResult?.earlier ||
    analysis?.earlierNDVI ||
    analysis?.earlierNdvi ||
    null;


  const laterNDVI =
    ndviResult?.later ||
    analysis?.laterNDVI ||
    analysis?.laterNdvi ||
    null;


  const earlierStats =
    earlierNDVI?.statistics ||
    null;


  const laterStats =
    laterNDVI?.statistics ||
    null;


  const earlierVegetation =
    earlierNDVI?.vegetation ||
    null;


  const laterVegetation =
    laterNDVI?.vegetation ||
    null;


  /* =====================================================
     CHANGE DATA
  ===================================================== */

  const change =
    changeResult?.change ||
    changeResult?.analysis?.change ||
    analysis?.change ||
    null;


  const increase =
    getNumber(
      change?.increase_percentage
    );


  const decrease =
    getNumber(
      change?.decrease_percentage
    );


  const stable =
    getNumber(
      change?.stable_percentage
    );


  const changed =
    getNumber(
      change?.changed_percentage
    );


  /* =====================================================
     RENDER BAR
  ===================================================== */

  const ResultBar = ({
    label,
    value,
  }) => {

    if (
      value === null ||
      value === undefined
    ) {

      return null;
    }


    return (
      <div
        style={{
          marginBottom: "16px",
        }}
      >

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            marginBottom: "6px",
          }}
        >

          <strong>
            {label}
          </strong>

          <span>
            {value.toFixed(2)}%
          </span>

        </div>


        <div
          style={{
            width: "100%",
            height: "12px",
            background:
              "#e5e7eb",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >

          <div
            style={{
              width: `${Math.min(
                Math.max(value, 0),
                100
              )}%`,
              height: "100%",
              background:
                "#2563eb",
              borderRadius: "10px",
              transition:
                "width 0.5s ease",
            }}
          />

        </div>

      </div>
    );
  };


  /* =====================================================
     RESULT CARD
  ===================================================== */

  const StatCard = ({
    title,
    value,
  }) => {

    return (
      <div
        style={{
          padding: "18px",
          border:
            "1px solid #e5e7eb",
          borderRadius: "12px",
          background: "#ffffff",
        }}
      >

        <div
          style={{
            fontSize: "13px",
            color: "#6b7280",
            marginBottom: "6px",
          }}
        >
          {title}
        </div>


        <div
          style={{
            fontSize: "24px",
            fontWeight: "700",
          }}
        >
          {value ?? "—"}
        </div>

      </div>
    );
  };


  /* =====================================================
     RENDER
  ===================================================== */

  return (

    <div
      className="analysis-upload"
      style={{
        width: "100%",
      }}
    >

      <form
        onSubmit={
          handleSubmit
        }
      >

        {/* =================================================
            FILE UPLOAD
        ================================================= */}

        <div>

          <label
            htmlFor="satellite-images"
          >
            {getTitle()}
          </label>


          {getDescription() && (

            <p>
              {getDescription()}
            </p>

          )}


          <input
            id="satellite-images"
            type="file"
            accept=".tif,.tiff"
            multiple={
              isNDVI ||
              isBiTemporal ||
              isCrossModal
            }
            onChange={
              handleFileChange
            }
          />

        </div>


        {/* =================================================
            QUERY
        ================================================= */}

        <div>

          <label
            htmlFor="satquery"
          >
            Natural-language query
          </label>


          <textarea
            id="satquery"
            value={query}
            onChange={(
              event
            ) =>
              setQuery(
                event.target.value
              )
            }
            placeholder={
              isNDVI
                ? "Example: Calculate vegetation health using NDVI."
                : isBiTemporal
                ? "Example: Compare vegetation between 2017 and 2024 and identify vegetation increase, decrease and stable areas."
                : "Ask a question about the satellite imagery..."
            }
            rows={4}
          />

        </div>


        {/* =================================================
            INPUT TYPE
        ================================================= */}

        <div>

          <p>

            Input type:{" "}

            <strong>

              {isNDVI
                ? "NDVI"
                : isBiTemporal
                ? "Bi-temporal"
                : inputType}

            </strong>

          </p>


          <p>

            Selected files:{" "}

            <strong>
              {files.length}
            </strong>

          </p>


          {/* ===============================================
              NDVI FILES
          =============================================== */}

          {isNDVI &&
            files.length > 0 && (

              <div>

                <h4>
                  NDVI Bands
                </h4>


                {files.map(
                  (file) => (

                    <p
                      key={
                        file.name
                      }
                    >
                      {file.name}
                    </p>

                  )
                )}

              </div>

            )}


          {/* ===============================================
              BI-TEMPORAL FILES
          =============================================== */}

          {isBiTemporal &&
            files.length > 0 && (

              <div>

                <h4>
                  Bi-temporal Input
                </h4>


                <div>

                  <h5>
                    Earlier — 2017
                  </h5>


                  {earlierFiles.length > 0
                    ? earlierFiles.map(
                        (file) => (

                          <p
                            key={
                              file.name
                            }
                          >
                            {file.name}
                          </p>

                        )
                      )
                    : (
                        <p>
                          No 2017 files detected.
                        </p>
                      )}

                </div>


                <div>

                  <h5>
                    Later — 2024
                  </h5>


                  {laterFiles.length > 0
                    ? laterFiles.map(
                        (file) => (

                          <p
                            key={
                              file.name
                            }
                          >
                            {file.name}
                          </p>

                        )
                      )
                    : (
                        <p>
                          No 2024 files detected.
                        </p>
                      )}

                </div>

              </div>

            )}

        </div>


        {/* =================================================
            SUBMIT
        ================================================= */}

        <button
          type="submit"
          disabled={
            loading
          }
        >

          {getButtonText()}

        </button>

      </form>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div
          role="alert"
          style={{
            marginTop: "20px",
            padding: "12px",
            borderRadius: "8px",
            background: "#fee2e2",
            color: "#991b1b",
          }}
        >

          {error}

        </div>

      )}


      {/* =================================================
          RESULTS
      ================================================= */}

      {result && (

        <div
          style={{
            marginTop: "30px",
          }}
        >

          <h3>
            Analysis Results
          </h3>


          {/* =================================================
              BI-TEMPORAL RESULTS
          ================================================= */}

          {isBiTemporal && (

            <>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "14px",
                  marginTop: "20px",
                }}
              >

                <StatCard
                  title="Vegetation Increased"
                  value={
                    increase !== null
                      ? `${increase.toFixed(2)}%`
                      : null
                  }
                />


                <StatCard
                  title="Vegetation Decreased"
                  value={
                    decrease !== null
                      ? `${decrease.toFixed(2)}%`
                      : null
                  }
                />


                <StatCard
                  title="Stable Area"
                  value={
                    stable !== null
                      ? `${stable.toFixed(2)}%`
                      : null
                  }
                />


                <StatCard
                  title="Total Changed"
                  value={
                    changed !== null
                      ? `${changed.toFixed(2)}%`
                      : null
                  }
                />

              </div>


              {/* =================================================
                  CHANGE GRAPH
              ================================================= */}

              {(
                increase !== null ||
                decrease !== null ||
                stable !== null
              ) && (

                <div
                  style={{
                    marginTop: "30px",
                    padding: "20px",
                    border:
                      "1px solid #e5e7eb",
                    borderRadius: "12px",
                    background:
                      "#ffffff",
                  }}
                >

                  <h4>
                    Vegetation Change Distribution
                  </h4>


                  <ResultBar
                    label="Increase"
                    value={
                      increase
                    }
                  />


                  <ResultBar
                    label="Decrease"
                    value={
                      decrease
                    }
                  />


                  <ResultBar
                    label="Stable"
                    value={
                      stable
                    }

                  />

                </div>

              )}


              {/* =================================================
                  NDVI COMPARISON
              ================================================= */}

              {(
                earlierStats ||
                laterStats
              ) && (

                <div
                  style={{
                    marginTop: "30px",
                  }}
                >

                  <h4>
                    NDVI Statistics Comparison
                  </h4>


                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: "14px",
                      marginTop: "15px",
                    }}
                  >

                    <StatCard
                      title="2017 Mean NDVI"
                      value={
                        getNumber(
                          earlierStats?.mean
                        ) !== null
                          ? getNumber(
                              earlierStats.mean
                            ).toFixed(4)
                          : null
                      }
                    />


                    <StatCard
                      title="2024 Mean NDVI"
                      value={
                        getNumber(
                          laterStats?.mean
                        ) !== null
                          ? getNumber(
                              laterStats.mean
                            ).toFixed(4)
                          : null
                      }
                    />


                    <StatCard
                      title="2017 Median NDVI"
                      value={
                        getNumber(
                          earlierStats?.median
                        ) !== null
                          ? getNumber(
                              earlierStats.median
                            ).toFixed(4)
                          : null
                      }
                    />


                    <StatCard
                      title="2024 Median NDVI"
                      value={
                        getNumber(
                          laterStats?.median
                        ) !== null
                          ? getNumber(
                              laterStats.median
                            ).toFixed(4)
                          : null
                      }
                    />

                  </div>

                </div>

              )}


              {/* =================================================
                  VEGETATION HEALTH COMPARISON
              ================================================= */}

              {(
                earlierVegetation ||
                laterVegetation
              ) && (

                <div
                  style={{
                    marginTop: "30px",
                  }}
                >

                  <h4>
                    Vegetation Health
                  </h4>


                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(280px, 1fr))",
                      gap: "20px",
                      marginTop: "15px",
                    }}
                  >

                    <div
                      style={{
                        padding: "20px",
                        border:
                          "1px solid #e5e7eb",
                        borderRadius:
                          "12px",
                      }}
                    >

                      <h5>
                        2017
                      </h5>


                      <ResultBar
                        label="Low"
                        value={
                          getNumber(
                            earlierVegetation?.low_percentage
                          )
                        }
                      />


                      <ResultBar
                        label="Moderate"
                        value={
                          getNumber(
                            earlierVegetation?.moderate_percentage
                          )
                        }
                      />


                      <ResultBar
                        label="Healthy"
                        value={
                          getNumber(
                            earlierVegetation?.healthy_percentage
                          )
                        }
                      />

                    </div>


                    <div
                      style={{
                        padding: "20px",
                        border:
                          "1px solid #e5e7eb",
                        borderRadius:
                          "12px",
                      }}
                    >

                      <h5>
                        2024
                      </h5>


                      <ResultBar
                        label="Low"
                        value={
                          getNumber(
                            laterVegetation?.low_percentage
                          )
                        }
                      />


                      <ResultBar
                        label="Moderate"
                        value={
                          getNumber(
                            laterVegetation?.moderate_percentage
                          )
                        }
                      />


                      <ResultBar
                        label="Healthy"
                        value={
                          getNumber(
                            laterVegetation?.healthy_percentage
                          )
                        }
                      />

                    </div>

                  </div>

                </div>

              )}

            </>

          )}


          {/* =================================================
              NDVI RESULTS
          ================================================= */}

          {isNDVI && (

            <div
              style={{
                marginTop: "20px",
              }}
            >

              <h4>
                NDVI Analysis
              </h4>


              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "14px",
                  marginTop: "15px",
                }}
              >

                <StatCard
                  title="Minimum NDVI"
                  value={
                    getNumber(
                      analysis?.statistics?.min
                    ) !== null
                      ? getNumber(
                          analysis.statistics.min
                        ).toFixed(4)
                      : null
                  }
                />


                <StatCard
                  title="Maximum NDVI"
                  value={
                    getNumber(
                      analysis?.statistics?.max
                    ) !== null
                      ? getNumber(
                          analysis.statistics.max
                        ).toFixed(4)
                      : null
                  }
                />


                <StatCard
                  title="Mean NDVI"
                  value={
                    getNumber(
                      analysis?.statistics?.mean
                    ) !== null
                      ? getNumber(
                          analysis.statistics.mean
                        ).toFixed(4)
                      : null
                  }
                />


                <StatCard
                  title="Median NDVI"
                  value={
                    getNumber(
                      analysis?.statistics?.median
                    ) !== null
                      ? getNumber(
                          analysis.statistics.median
                        ).toFixed(4)
                      : null
                  }
                />

              </div>

            </div>

          )}


          {/* =================================================
              PREVIEW URL
          ================================================= */}

          {(analysis?.preview_url ||
            analysis?.visualization?.preview_url ||
            result?.visualization?.preview_url) && (

            <div
              style={{
                marginTop: "30px",
              }}
            >

              <h4>
                Analysis Preview
              </h4>


              <img
                src={
                  analysis?.preview_url ||
                  analysis?.visualization?.preview_url ||
                  result?.visualization?.preview_url
                }
                alt="Analysis preview"
                style={{
                  width: "100%",
                  maxWidth: "1200px",
                  borderRadius: "12px",
                  marginTop: "10px",
                }}
              />

            </div>

          )}


          {/* =================================================
              RAW RESPONSE
          ================================================= */}

          <details
            style={{
              marginTop: "30px",
            }}
          >

            <summary>
              Technical Response
            </summary>


            <pre
              style={{
                marginTop: "10px",
                overflowX: "auto",
                padding: "15px",
                background:
                  "#111827",
                color: "#f9fafb",
                borderRadius: "10px",
                fontSize: "12px",
              }}
            >
              {JSON.stringify(
                result,
                null,
                2
              )}
            </pre>

          </details>

        </div>

      )}

    </div>

  );
};


export default AnalysisUpload;