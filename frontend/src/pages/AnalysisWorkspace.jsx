import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

const querySuggestions = {
  single: [
    "Describe the land-cover and major objects visible in this image.",
    "What major features are visible in this image?",
    "Identify the dominant land-cover type.",
  ],
  "bi-temporal": [
    "What changed between these two dates, and where did the change occur?",
    "Has the built-up area increased, decreased, or remained unchanged?",
    "Describe the major changes between the two observations.",
  ],
  "optical-sar": [
    "Use the optical and SAR images together to identify built-up and water-covered regions.",
    "What complementary information is visible across the two modalities?",
    "Identify regions that appear built-up using both observations.",
  ],
};

function FileCard({
  label,
  file,
  onChange,
  required = true,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-medium text-white">
            {label}
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            GeoTIFF / TIFF
            {!required && " · Optional"}
          </p>
        </div>

        <span className="rounded-lg bg-white/5 px-2 py-1 text-xs text-slate-500">
          {file ? "Selected" : "Required"}
        </span>
      </div>

      <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-slate-950/40 px-5 text-center transition hover:border-cyan-400/40">
        <span className="text-3xl text-slate-600">
          ↑
        </span>

        <span className="mt-3 text-sm font-medium text-slate-300">
          {file ? file.name : "Choose satellite image"}
        </span>

        <span className="mt-1 text-xs text-slate-600">
          Maximum file validation will be handled by backend.
        </span>

        <input
          type="file"
          accept=".tif,.tiff,.png,.jpg,.jpeg"
          onChange={onChange}
          className="hidden"
        />
      </label>

      {file && (
        <div className="mt-3 rounded-lg bg-slate-950/60 p-3 text-xs text-slate-500">
          <p>
            File:{" "}
            <span className="text-slate-300">
              {file.name}
            </span>
          </p>

          <p className="mt-1">
            Size:{" "}
            <span className="text-slate-300">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </p>

          <p className="mt-1 text-amber-400">
            Metadata validation pending backend processing.
          </p>
        </div>
      )}
    </div>
  );
}

function AnalysisWorkspace() {
  const [searchParams] = useSearchParams();

  const mode = searchParams.get("mode") || "single";

  const [files, setFiles] = useState({
    image: null,
    imageT1: null,
    imageT2: null,
    optical: null,
    sar: null,
  });

  const [query, setQuery] = useState("");

  const suggestions = useMemo(
    () => querySuggestions[mode] || querySuggestions.single,
    [mode]
  );

  const modeTitle = {
    single: "Single Image Analysis",
    "bi-temporal": "Bi-Temporal Change Analysis",
    "optical-sar": "Optical + SAR Analysis",
  };

  const handleFile = (name) => (event) => {
    const selectedFile = event.target.files?.[0] || null;

    setFiles((current) => ({
      ...current,
      [name]: selectedFile,
    }));
  };

  const handleAnalyze = (event) => {
    event.preventDefault();

    // Actual analysis API Phase 6+ mein connect hoga.
    // No fake AI result is generated here.
  };

  const selectSuggestion = (suggestion) => {
    setQuery(suggestion);
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Analysis Workspace
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          {modeTitle[mode]}
        </h1>

        <p className="mt-3 max-w-3xl text-slate-400">
          Upload the required imagery and ask a natural-language
          question. Input compatibility and task routing will be
          handled by the AI service.
        </p>
      </div>

      <form
        onSubmit={handleAnalyze}
        className="mt-8 space-y-8"
      >
        {mode === "single" && (
          <FileCard
            label="Satellite Image"
            file={files.image}
            onChange={handleFile("image")}
          />
        )}

        {mode === "bi-temporal" && (
          <div className="grid gap-5 md:grid-cols-2">
            <FileCard
              label="Image — T1"
              file={files.imageT1}
              onChange={handleFile("imageT1")}
            />

            <FileCard
              label="Image — T2"
              file={files.imageT2}
              onChange={handleFile("imageT2")}
            />
          </div>
        )}

        {mode === "optical-sar" && (
          <div className="grid gap-5 md:grid-cols-2">
            <FileCard
              label="Optical / Multispectral Image"
              file={files.optical}
              onChange={handleFile("optical")}
            />

            <FileCard
              label="SAR Image"
              file={files.sar}
              onChange={handleFile("sar")}
            />
          </div>
        )}

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">
              Natural-language query
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Ask what you want SatQuery AI to analyse.
            </p>
          </div>

          <textarea
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            rows={5}
            placeholder="Ask a question about the satellite imagery..."
            className="w-full resize-none rounded-xl border border-white/10 bg-slate-950/60 p-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
          />

          <div className="mt-5">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-600">
              Suggested queries
            </p>

            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  type="button"
                  key={suggestion}
                  onClick={() =>
                    selectSuggestion(suggestion)
                  }
                  className="rounded-lg border border-white/10 px-3 py-2 text-left text-xs text-slate-400 transition hover:border-cyan-400/30 hover:text-cyan-300"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-amber-400/10 bg-amber-400/[0.03] p-5">
          <div className="flex gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 text-amber-400">
              !
            </div>

            <div>
              <h3 className="font-medium text-amber-300">
                Analysis service status
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                The actual AI analysis endpoint will be connected
                after the Python AI service and backend are implemented.
                No fabricated analysis result is generated.
              </p>
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!query.trim()}
            className="rounded-xl bg-cyan-400 px-7 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Analyse Imagery
          </button>
        </div>
      </form>
    </div>
  );
}

export default AnalysisWorkspace;