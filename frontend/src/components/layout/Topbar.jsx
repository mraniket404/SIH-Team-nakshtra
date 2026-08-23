function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 bg-slate-950/80 px-6 backdrop-blur">
      <div>
        <p className="text-sm font-medium text-white">
          SatQuery AI
        </p>

        <p className="text-xs text-slate-500">
          Multimodal Remote Sensing Analysis
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm text-slate-300">
            Production Environment
          </p>

          <p className="text-xs text-slate-500">
            Real-data processing
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm">
          A
        </div>
      </div>
    </header>
  );
}

export default Topbar;