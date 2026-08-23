function Logo() {
  return (
    <div className="inline-flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 font-bold text-slate-950">
        S
      </div>

      <span className="font-bold">
        <span className="text-cyan-400">Sat</span>Query
        <span className="text-violet-400"> AI</span>
      </span>
    </div>
  );
}

export default Logo;