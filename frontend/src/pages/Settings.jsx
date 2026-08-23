import { useState } from "react";

function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    saveHistory: true,
  });

  const toggle = (key) => {
    setSettings((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
        Configuration
      </p>

      <h1 className="mt-2 text-3xl font-bold">
        Settings
      </h1>

      <p className="mt-2 text-slate-500">
        Configure your SatQuery AI workspace.
      </p>

      <div className="mt-8 space-y-5">
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="font-semibold">
            Account
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs text-slate-500">
                Name
              </label>

              <input
                value="User"
                readOnly
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-400 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs text-slate-500">
                Email
              </label>

              <input
                value="Not connected"
                readOnly
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-400 outline-none"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="font-semibold">
            Preferences
          </h2>

          <div className="mt-5 space-y-4">
            {[
              {
                key: "notifications",
                title: "Notifications",
                description:
                  "Receive updates about analysis processing.",
              },
              {
                key: "saveHistory",
                title: "Save analysis history",
                description:
                  "Keep completed analyses available in history.",
              },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => toggle(item.key)}
                className="flex w-full items-center justify-between rounded-xl border border-white/10 p-4 text-left hover:bg-white/[0.03]"
              >
                <div>
                  <p className="text-sm font-medium">
                    {item.title}
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    {item.description}
                  </p>
                </div>

                <div
                  className={`h-6 w-11 rounded-full p-1 transition ${
                    settings[item.key]
                      ? "bg-cyan-400"
                      : "bg-slate-700"
                  }`}
                >
                  <div
                    className={`h-4 w-4 rounded-full bg-white transition ${
                      settings[item.key]
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  />
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Settings;