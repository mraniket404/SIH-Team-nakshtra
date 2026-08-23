import { useState } from "react";

import { createAnalysis } from "../../services/analysisApi";


const AnalysisUpload = ({
  projectId,
  token,
  inputType = "single",
}) => {

  const [files, setFiles] =
    useState([]);

  const [query, setQuery] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState(null);

  const [error, setError] =
    useState("");


  const isNDVI =
    inputType === "ndvi";


  const handleFileChange = (
    event
  ) => {

    const selectedFiles =
      Array.from(
        event.target.files || []
      );


    setError("");
    setResult(null);


    if (isNDVI) {

      if (
        selectedFiles.length !== 2
      ) {

        setFiles(
          selectedFiles
        );

        setError(
          "NDVI analysis requires exactly 2 GeoTIFF files: B04 (Red) and B08 (NIR)."
        );

        return;
      }


      const hasB04 =
        selectedFiles.some(
          (file) =>
            file.name
              .toUpperCase()
              .includes("B04")
        );


      const hasB08 =
        selectedFiles.some(
          (file) =>
            file.name
              .toUpperCase()
              .includes("B08")
        );


      if (!hasB04 || !hasB08) {

        setFiles(
          selectedFiles
        );

        setError(
          "For NDVI, upload both B04 (Red) and B08 (NIR) GeoTIFF files."
        );

        return;
      }


      setFiles(
        selectedFiles
      );

      return;
    }


    if (
      inputType === "single"
    ) {

      setFiles(
        selectedFiles.slice(
          0,
          1
        )
      );

      return;
    }


    if (
      selectedFiles.length !== 2
    ) {

      setFiles(
        selectedFiles
      );

      setError(
        `${
          inputType ===
          "cross-modal"
            ? "Cross-modal"
            : "Bi-temporal"
        } analysis requires exactly 2 images.`
      );

      return;
    }


    setFiles(
      selectedFiles
    );
  };


  const handleSubmit =
    async (event) => {

      event.preventDefault();

      setError("");
      setResult(null);


      if (!projectId) {

        setError(
          "Please select a project first."
        );

        return;
      }


      if (!token) {

        setError(
          "Authentication token is missing. Please login again."
        );

        return;
      }


      if (
        files.length === 0
      ) {

        setError(
          isNDVI
            ? "Please select B04 and B08 GeoTIFF files."
            : "Please select at least one GeoTIFF."
        );

        return;
      }


      if (
        isNDVI &&
        files.length !== 2
      ) {

        setError(
          "NDVI analysis requires exactly B04 and B08."
        );

        return;
      }


      if (
        !isNDVI &&
        inputType !== "single" &&
        files.length !== 2
      ) {

        setError(
          "This analysis type requires exactly 2 GeoTIFF files."
        );

        return;
      }


      if (isNDVI) {

        const hasB04 =
          files.some(
            (file) =>
              file.name
                .toUpperCase()
                .includes("B04")
          );


        const hasB08 =
          files.some(
            (file) =>
              file.name
                .toUpperCase()
                .includes("B08")
          );


        if (
          !hasB04 ||
          !hasB08
        ) {

          setError(
            "Please upload one B04 Red band and one B08 NIR band."
          );

          return;
        }
      }


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


        setResult(
          data
        );


      } catch (err) {

        setError(
          err.message ||
          "Analysis upload failed."
        );


      } finally {

        setLoading(false);
      }
    };


  return (
    <div className="analysis-upload">

      <form
        onSubmit={
          handleSubmit
        }
      >

        <div>

          <label
            htmlFor="satellite-images"
          >
            {isNDVI
              ? "NDVI Satellite Bands"
              : "Satellite GeoTIFF"}
          </label>


          {isNDVI && (
            <p>
              Upload B04 (Red) and
              B08 (NIR) bands.
            </p>
          )}


          <input
            id="satellite-images"
            type="file"
            accept=".tif,.tiff"
            multiple={
              isNDVI ||
              inputType !==
                "single"
            }
            onChange={
              handleFileChange
            }
          />

        </div>


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
                : "Ask a question about the satellite imagery..."
            }
            rows={4}
          />

        </div>


        <div>

          <p>
            Input type:{" "}
            <strong>
              {isNDVI
                ? "NDVI"
                : inputType}
            </strong>
          </p>


          <p>
            Selected files:{" "}
            <strong>
              {files.length}
            </strong>
          </p>


          {isNDVI &&
            files.length > 0 && (
              <div>

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

        </div>


        <button
          type="submit"
          disabled={
            loading
          }
        >

          {loading
            ? "Processing imagery..."
            : isNDVI
            ? "Calculate NDVI"
            : "Analyze Imagery"}

        </button>

      </form>


      {error && (
        <div
          role="alert"
        >
          {error}
        </div>
      )}


      {result && (
        <div>

          <h3>
            Analysis completed
          </h3>


          <pre>
            {JSON.stringify(
              result,
              null,
              2
            )}
          </pre>

        </div>
      )}

    </div>
  );
};


export default AnalysisUpload;