const handleSubmit = async (event) => {
  event.preventDefault();

  console.log("🔥 SUBMIT CLICKED");
  console.log("projectId:", projectId);
  console.log("inputType:", inputType);
  console.log("files:", files);
  console.log("token exists:", Boolean(token));
  console.log("query:", query);
};

import {
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
  useNavigate,
} from "react-router-dom";

import {
  createAnalysis,
} from "../services/analysisApi";

import {
  getProjects,
} from "../services/projectApi";

import {
  useAuth,
} from "../context/AuthContext";


function NewAnalysis() {

  const navigate =
    useNavigate();


  const [
    searchParams,
  ] = useSearchParams();


  const {
    user,
  } = useAuth();


  const [
    projects,
    setProjects,
  ] = useState([]);


  const [
    projectId,
    setProjectId,
  ] = useState(
    searchParams.get(
      "project"
    ) || ""
  );


  const [
    inputType,
    setInputType,
  ] = useState(
    "single"
  );


  const [
    query,
    setQuery,
  ] = useState("");


  const [
    files,
    setFiles,
  ] = useState([]);


  const [
    loadingProjects,
    setLoadingProjects,
  ] = useState(true);


  const [
    submitting,
    setSubmitting,
  ] = useState(false);


  const [
    progress,
    setProgress,
  ] = useState(0);


  const [
    error,
    setError,
  ] = useState("");


  /* =================================================
     TOKEN
  ================================================= */

  const token =
    localStorage.getItem(
      "satquery_token"
    );


  /* =================================================
     LOAD PROJECTS
  ================================================= */

  useEffect(() => {

    const loadProjects =
      async () => {

        try {

          const response =
            await getProjects();


          setProjects(
            response.projects ||
              []
          );


        } catch (error) {

          setError(
            error.response?.data
              ?.message ||
            error.message ||
            "Unable to load projects."
          );


        } finally {

          setLoadingProjects(
            false
          );
        }
      };


    loadProjects();

  }, []);


  /* =================================================
     EXPECTED FILE COUNT
  ================================================= */

  const expectedFileCount =
    inputType === "single"
      ? 1
      : 2;


  /* =================================================
     FILE CHANGE
  ================================================= */

  const handleFileChange =
    (event) => {

      const selected =
        Array.from(
          event.target.files ||
            []
        );


      setError("");


      /* ---------------------------------------------
         FILE COUNT
      --------------------------------------------- */

      if (
        selected.length >
        expectedFileCount
      ) {

        setError(
          `This analysis requires ${expectedFileCount} image${
            expectedFileCount > 1
              ? "s"
              : ""
          }.`
        );


        setFiles(
          selected.slice(
            0,
            expectedFileCount
          )
        );


        return;
      }


      /* ---------------------------------------------
         EXTENSION
      --------------------------------------------- */

      const invalid =
        selected.find(
          (file) => {

            const name =
              file.name.toLowerCase();


            return (
              !name.endsWith(
                ".tif"
              ) &&
              !name.endsWith(
                ".tiff"
              )
            );
          }
        );


      if (invalid) {

        setError(
          "Only .tif and .tiff files are supported."
        );


        setFiles([]);

        return;
      }


      /* ---------------------------------------------
         NDVI VALIDATION
      --------------------------------------------- */

      if (
        inputType === "ndvi" &&
        selected.length === 2
      ) {

        const hasB04 =
          selected.some(
            (file) =>
              file.name
                .toUpperCase()
                .includes("B04")
          );


        const hasB08 =
          selected.some(
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
            "NDVI requires one B04 (Red) and one B08 (NIR) GeoTIFF."
          );


          setFiles([]);

          return;
        }
      }


      setFiles(
        selected
      );
    };


  /* =================================================
     INPUT TYPE
  ================================================= */

  const handleInputType =
    (value) => {

      setInputType(
        value
      );

      setFiles([]);

      setError("");

      setProgress(0);
    };


  /* =================================================
     SUBMIT
  ================================================= */

  const handleSubmit =
    async (event) => {

      event.preventDefault();

      setError("");


      /* ---------------------------------------------
         AUTH
      --------------------------------------------- */

      if (!token) {

        setError(
          "Authentication token is missing or expired. Please logout and login again."
        );

        return;
      }


      /* ---------------------------------------------
         PROJECT
      --------------------------------------------- */

      if (!projectId) {

        setError(
          "Please select a project."
        );

        return;
      }


      /* ---------------------------------------------
         FILE COUNT
      --------------------------------------------- */

      if (
        files.length !==
        expectedFileCount
      ) {

        setError(
          `Please upload ${expectedFileCount} valid TIFF image${
            expectedFileCount > 1
              ? "s"
              : ""
          }.`
        );

        return;
      }


      /* ---------------------------------------------
         NDVI B04/B08
      --------------------------------------------- */

      if (
        inputType === "ndvi"
      ) {

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
            "Please upload both B04 (Red) and B08 (NIR) GeoTIFF files."
          );

          return;
        }
      }


      try {

        setSubmitting(
          true
        );

        setProgress(0);


        const response =
          await createAnalysis({

            projectId,

            inputType,

            query,

            files,

            token,

            onUploadProgress:
              (event) => {

                if (
                  event.total
                ) {

                  const percentage =
                    Math.round(
                      (
                        event.loaded /
                        event.total
                      ) *
                      100
                    );


                  setProgress(
                    percentage
                  );
                }
              },
          });


        /* -------------------------------------------
           NAVIGATE
        ------------------------------------------- */

        if (
          response.analysis
            ?._id
        ) {

          navigate(
            `/analysis/${response.analysis._id}`
          );

          return;
        }


        throw new Error(
          "Analysis was created but no analysis ID was returned."
        );


      } catch (error) {

        setError(
          error.response?.data
            ?.message ||
          error.message ||
          "Unable to upload satellite imagery."
        );


      } finally {

        setSubmitting(
          false
        );
      }
    };


  /* =================================================
     UI
  ================================================= */

  return (

    <div className="mx-auto max-w-5xl">

      {/* HEADER */}

      <div>

        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Analysis
        </p>


        <h1 className="mt-2 text-3xl font-bold">
          New Analysis
        </h1>


        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Upload supported remote-sensing imagery and configure the analysis input.
        </p>

      </div>


      {/* ERROR */}

      {error && (

        <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300">

          {error}

        </div>

      )}


      <form
        onSubmit={
          handleSubmit
        }
        className="mt-8 space-y-6"
      >


        {/* =================================================
            PROJECT
        ================================================= */}

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

          <h2 className="text-lg font-semibold">
            1. Select Project
          </h2>


          <p className="mt-1 text-sm text-slate-600">
            Associate this analysis with a SatQuery project.
          </p>


          <select

            value={
              projectId
            }

            onChange={
              (event) =>
                setProjectId(
                  event.target.value
                )
            }

            disabled={
              loadingProjects ||
              submitting
            }

            className="mt-5 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50"
          >

            <option value="">
              Select a project
            </option>


            {projects.map(
              (project) => (

                <option
                  key={
                    project._id
                  }
                  value={
                    project._id
                  }
                >

                  {
                    project.name
                  }

                </option>

              )
            )}

          </select>

        </section>


        {/* =================================================
            INPUT TYPE
        ================================================= */}

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

          <h2 className="text-lg font-semibold">
            2. Input Configuration
          </h2>


          <p className="mt-1 text-sm text-slate-600">
            Select the type of imagery you want to analyse.
          </p>


          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">


            {/* SINGLE */}

            <button
              type="button"

              onClick={() =>
                handleInputType(
                  "single"
                )
              }

              className={`rounded-2xl border p-5 text-left transition ${
                inputType ===
                "single"
                  ? "border-cyan-400/40 bg-cyan-400/10"
                  : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
              }`}
            >

              <div className="flex items-center justify-between">

                <span className="font-medium">
                  Single Image
                </span>


                {inputType ===
                  "single" && (

                  <span className="text-cyan-400">
                    ✓
                  </span>

                )}

              </div>


              <p className="mt-2 text-xs leading-5 text-slate-600">
                One optical, multispectral or SAR image.
              </p>

            </button>


            {/* OPTICAL + SAR */}

            <button
              type="button"

              onClick={() =>
                handleInputType(
                  "cross-modal"
                )
              }

              className={`rounded-2xl border p-5 text-left transition ${
                inputType ===
                "cross-modal"
                  ? "border-cyan-400/40 bg-cyan-400/10"
                  : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
              }`}
            >

              <div className="flex items-center justify-between">

                <span className="font-medium">
                  Optical + SAR
                </span>


                {inputType ===
                  "cross-modal" && (

                  <span className="text-cyan-400">
                    ✓
                  </span>

                )}

              </div>


              <p className="mt-2 text-xs leading-5 text-slate-600">
                Two co-registered complementary modalities.
              </p>

            </button>


            {/* BI-TEMPORAL */}

            <button
              type="button"

              onClick={() =>
                handleInputType(
                  "bi-temporal"
                )
              }

              className={`rounded-2xl border p-5 text-left transition ${
                inputType ===
                "bi-temporal"
                  ? "border-cyan-400/40 bg-cyan-400/10"
                  : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
              }`}
            >

              <div className="flex items-center justify-between">

                <span className="font-medium">
                  Bi-Temporal
                </span>


                {inputType ===
                  "bi-temporal" && (

                  <span className="text-cyan-400">
                    ✓
                  </span>

                )}

              </div>


              <p className="mt-2 text-xs leading-5 text-slate-600">
                Two corresponding observations from different times.
              </p>

            </button>


            {/* NDVI */}

            <button
              type="button"

              onClick={() =>
                handleInputType(
                  "ndvi"
                )
              }

              className={`rounded-2xl border p-5 text-left transition ${
                inputType ===
                "ndvi"
                  ? "border-emerald-400/40 bg-emerald-400/10"
                  : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
              }`}
            >

              <div className="flex items-center justify-between">

                <span className="font-medium">
                  NDVI Vegetation
                </span>


                {inputType ===
                  "ndvi" && (

                  <span className="text-emerald-400">
                    ✓
                  </span>

                )}

              </div>


              <p className="mt-2 text-xs leading-5 text-slate-600">
                Calculate vegetation health using B04 Red and B08 NIR.
              </p>

            </button>

          </div>

        </section>


        {/* =================================================
            FILE UPLOAD
        ================================================= */}

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

          <h2 className="text-lg font-semibold">
            3. Satellite Imagery
          </h2>


          <p className="mt-1 text-sm text-slate-600">
            Supported format: GeoTIFF / TIFF.
          </p>


          {inputType ===
            "ndvi" && (

            <p className="mt-2 text-xs text-emerald-400">
              NDVI requires B04 (Red) + B08 (NIR).
            </p>

          )}


          <label className="mt-5 flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/40 px-6 text-center transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.02]">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-xl text-cyan-400">
              ↑
            </div>


            <p className="mt-4 text-sm font-medium">
              Select satellite imagery
            </p>


            <p className="mt-2 text-xs text-slate-600">

              {expectedFileCount ===
              1
                ? "1 TIFF file required"
                : "2 TIFF files required"}

            </p>


            <input
              type="file"
              accept=".tif,.tiff"
              multiple={
                expectedFileCount >
                1
              }
              onChange={
                handleFileChange
              }
              disabled={
                submitting
              }
              className="hidden"
            />

          </label>


          {/* FILE LIST */}

          {files.length > 0 && (

            <div className="mt-4 space-y-2">

              {files.map(
                (file) => (

                  <div
                    key={`${file.name}-${file.size}`}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3"
                  >

                    <div className="min-w-0">

                      <p className="truncate text-sm text-slate-300">
                        {file.name}
                      </p>


                      <p className="mt-1 text-xs text-slate-600">

                        {(
                          file.size /
                          1024 /
                          1024
                        ).toFixed(
                          2
                        )}{" "}
                        MB

                      </p>

                    </div>


                    <span className="ml-4 text-xs text-emerald-400">
                      TIFF
                    </span>

                  </div>

                )
              )}

            </div>

          )}

        </section>


        {/* =================================================
            QUERY
        ================================================= */}

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

          <h2 className="text-lg font-semibold">
            4. Natural-Language Query
          </h2>


          <p className="mt-1 text-sm text-slate-600">
            Describe what you want SatQuery AI to analyse.
          </p>


          <textarea

            value={
              query
            }

            onChange={
              (event) =>
                setQuery(
                  event.target.value
                )
            }

            rows={5}

            disabled={
              submitting
            }

            placeholder={
              inputType ===
              "ndvi"
                ? "Example: Calculate vegetation health and summarize NDVI statistics."
                : "Example: Describe the land-cover and major objects visible in this image."
            }

            className="mt-5 w-full resize-none rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-700 focus:border-cyan-400/50"
          />

        </section>


        {/* =================================================
            SUBMIT
        ================================================= */}

        <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.03] p-5">

          <div>

            <p className="text-sm font-medium">

              {inputType ===
              "ndvi"
                ? "Ready to calculate NDVI"
                : "Ready to upload"}

            </p>


            <p className="mt-1 text-xs text-slate-600">

              {inputType ===
              "ndvi"
                ? "B04 and B08 will be processed by the ML service."
                : "The imagery will be validated by the backend."}

            </p>

          </div>


          <button
            type="submit"
            disabled={
              submitting
            }

            className="flex min-w-40 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {submitting && (

              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />

            )}


            {submitting
              ? `Uploading ${progress}%`
              : inputType ===
                "ndvi"
              ? "Calculate NDVI"
              : "Upload Imagery"}

          </button>

        </section>

      </form>

    </div>
  );
}


export default NewAnalysis;