import { useAuth } from "../../context/AuthContext";

function Topbar() {
  const { user } = useAuth();

  return (
    <header className="hidden h-16 shrink-0 items-center justify-between border-b border-white/10 bg-slate-950/80 px-6 backdrop-blur lg:flex">
      <div>
        <p className="text-sm font-medium text-white">
          SatQuery AI
        </p>

        <p className="text-xs text-slate-600">
          Multimodal Remote Sensing Analysis
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-slate-300">
            {user?.name || "User"}
          </p>

          <p className="text-xs text-slate-600">
            {user?.email || ""}
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-sm font-bold text-slate-950">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
}

export default Topbar;