import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const navigation = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: "⌂",
  },
  {
    label: "New Analysis",
    path: "/analysis/new",
    icon: "+",
  },
  {
    label: "Projects",
    path: "/projects",
    icon: "▣",
  },
  {
    label: "History",
    path: "/history",
    icon: "◷",
  },
  {
    label: "Models",
    path: "/models",
    icon: "◈",
  },
  {
    label: "Reports",
    path: "/reports",
    icon: "▤",
  },
  {
    label: "Settings",
    path: "/settings",
    icon: "⚙",
  },
];

function Sidebar() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();

    setMobileOpen(false);

    navigate("/login", {
      replace: true,
    });
  };

  const handleNavigation = () => {
    setMobileOpen(false);
  };

  const renderNavigation = (mobile = false) => (
    <nav className="space-y-1">
      {navigation.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={mobile ? handleNavigation : undefined}
          className={({ isActive }) =>
            [
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
              isActive
                ? "bg-cyan-400/10 text-cyan-300"
                : "text-slate-400 hover:bg-white/5 hover:text-white",
            ].join(" ")
          }
        >
          <span className="flex h-5 w-5 items-center justify-center text-sm">
            {item.icon}
          </span>

          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );

  const userSection = (
    <div className="border-t border-white/10 p-4">
      <div className="mb-3 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-sm font-bold text-slate-950">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">
            {user?.name || "User"}
          </p>

          <p className="truncate text-xs text-slate-600">
            {user?.email || ""}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="w-full rounded-xl px-4 py-2.5 text-left text-sm text-slate-500 transition hover:bg-red-400/5 hover:text-red-300"
      >
        Sign out
      </button>
    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-slate-900/80 lg:block">
        <div className="sticky top-0 flex h-screen flex-col">
          {/* BRAND */}
          <div className="border-b border-white/10 px-6 py-5">
            <button
              type="button"
              onClick={() =>
                navigate("/dashboard")
              }
              className="text-left"
            >
              <div className="text-xl font-bold tracking-tight">
                <span className="text-cyan-400">
                  Sat
                </span>
                Query
                <span className="text-violet-400">
                  {" "}
                  AI
                </span>
              </div>

              <p className="mt-1 text-xs text-slate-600">
                Remote Sensing Intelligence
              </p>
            </button>
          </div>

          {/* NAVIGATION */}
          <div className="flex-1 overflow-y-auto p-4">
            <p className="mb-3 px-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-700">
              Workspace
            </p>

            {renderNavigation()}
          </div>

          {/* AI STATUS */}
          <div className="px-4 pb-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-400">
                  AI Service
                </p>

                <span className="h-2 w-2 rounded-full bg-amber-400" />
              </div>

              <p className="mt-2 text-xs text-slate-600">
                Checking service status...
              </p>
            </div>
          </div>

          {/* USER */}
          {userSection}
        </div>
      </aside>

      {/* MOBILE TOP BAR */}
      <div className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-slate-950/95 px-4 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300"
          aria-label="Open navigation"
        >
          ☰
        </button>

        <button
          type="button"
          onClick={() =>
            navigate("/dashboard")
          }
          className="text-lg font-bold"
        >
          <span className="text-cyan-400">
            Sat
          </span>
          Query
          <span className="text-violet-400">
            {" "}
            AI
          </span>
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-sm font-bold text-slate-950">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* BACKDROP */}
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/70"
          />

          {/* DRAWER */}
          <aside className="absolute left-0 top-0 flex h-full w-80 max-w-[85vw] flex-col border-r border-white/10 bg-slate-900 shadow-2xl">
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
              <button
                type="button"
                onClick={() => {
                  navigate("/dashboard");
                  setMobileOpen(false);
                }}
                className="text-left"
              >
                <div className="text-xl font-bold tracking-tight">
                  <span className="text-cyan-400">
                    Sat
                  </span>
                  Query
                  <span className="text-violet-400">
                    {" "}
                    AI
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-600">
                  Remote Sensing Intelligence
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  setMobileOpen(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-white/5 hover:text-white"
                aria-label="Close navigation"
              >
                ×
              </button>
            </div>

            {/* NAVIGATION */}
            <div className="flex-1 overflow-y-auto p-4">
              <p className="mb-3 px-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-700">
                Workspace
              </p>

              {renderNavigation(true)}
            </div>

            {/* USER */}
            {userSection}
          </aside>
        </div>
      )}
    </>
  );
}

export default Sidebar;