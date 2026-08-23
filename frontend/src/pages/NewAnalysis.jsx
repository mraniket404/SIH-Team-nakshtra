import { useState } from "react";
import { useNavigate } from "react-router-dom";

const modes = [
  {
    id: "single",
    title: "Single Image",
    description:
      "Analyse one optical, multispectral or SAR image.",
    icon: "01",
  },
  {
    id: "bi-temporal",
    title: "Bi-Temporal",
    description:
      "Analyse changes between two corresponding observations.",
    icon: "02",
  },
  {
    id: "optical-sar",
    title: "Optical + SAR",
    description:
      "Combine optical and SAR observations of the same area.",
    icon: "03",
  },
];

function NewAnalysis() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("single");

  const handleContinue = () => {
    navigate(`/analysis/workspace?mode=${mode}`);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
          New Analysis
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Choose your analysis configuration
        </h1>

        <p className="mt-3 text-slate-400">
          SatQuery AI will validate the selected imagery and
          determine the appropriate remote-sensing workflow.
        </p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {modes.map((item) => {
          const selected = mode === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setMode(item.id)}
              className={`text-left rounded-2xl border p-6 transition ${
                selected
                  ? "border-cyan-400/60 bg-cyan-400/10"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20"
              }`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl font-bold ${
                  selected
                    ? "bg-cyan-400 text-slate-950"
                    : "bg-white/5 text-slate-400"
                }`}
              >
                {item.icon}
              </div>

              <h2 className="mt-5 text-lg font-semibold">
                {item.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {item.description}
              </p>

              <div className="mt-5 text-sm">
                {selected ? (
                  <span className="text-cyan-400">
                    Selected
                  </span>
                ) : (
                  <span className="text-slate-600">
                    Select
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleContinue}
          className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
        >
          Continue to Workspace →
        </button>
      </div>
    </div>
  );
}

export default NewAnalysis;