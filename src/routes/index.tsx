import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAtomixConfig } from "@/atomix/useAtomixConfig";
import { MODE_META, type ModeKey } from "@/atomix/types";
import { ModeSwitcher } from "@/atomix/ModeSwitcher";
import { ModeConfigPanel } from "@/atomix/ModeConfigPanel";
import { ScriptGenerator } from "@/atomix/ScriptGenerator";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "AtomixOS Config" },
      { name: "description", content: "Mode manager for the AtomixOS experience layer." },
    ],
  }),
});

function Index() {
  const { config, setActiveMode, updateMode, addApp, removeApp, toggleApp } =
    useAtomixConfig();
  const [tab, setTab] = useState<ModeKey>(config.activeMode);
  const activeMeta = MODE_META[config.activeMode];

  return (
    <div className="min-h-screen bg-[#080810] text-white/90">
      {/* Header */}
      <header
        className="sticky top-0 z-40 h-14 flex items-center justify-between px-5 bg-[#080810]"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-white tracking-tight">
            AtomixOS
          </span>
          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
          <span className="font-mono text-sm text-white/40 ml-1">Config</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: activeMeta.accent }}
          />
          <span
            className="font-mono text-xs uppercase tracking-widest"
            style={{ color: activeMeta.accent }}
          >
            {activeMeta.label}
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-8 space-y-12">
        <ModeSwitcher
          active={config.activeMode}
          onChange={(m) => {
            setActiveMode(m);
            setTab(m);
          }}
        />

        {/* Mode configuration */}
        <section className="space-y-4">
          <div className="font-mono text-[11px] uppercase tracking-widest text-white/40">
            Mode Configuration
          </div>
          <div className="flex gap-1 border-b border-white/[0.06]">
            {(Object.keys(MODE_META) as ModeKey[]).map((m) => {
              const meta = MODE_META[m];
              const isActive = tab === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setTab(m)}
                  className="font-mono text-xs uppercase tracking-wider px-4 py-2.5 transition-colors"
                  style={{
                    color: isActive ? meta.accent : "rgba(255,255,255,0.4)",
                    borderBottom: isActive
                      ? `2px solid ${meta.accent}`
                      : "2px solid transparent",
                    marginBottom: "-1px",
                  }}
                >
                  {meta.label}
                </button>
              );
            })}
          </div>
          <ModeConfigPanel
            mode={tab}
            config={config.modes[tab]}
            onUpdate={(patch) => updateMode(tab, patch)}
            onAddApp={(app) => addApp(tab, app)}
            onRemoveApp={(id) => removeApp(tab, id)}
            onToggleApp={(id) => toggleApp(tab, id)}
          />
        </section>

        <ScriptGenerator config={config} />

        <footer className="pt-4 pb-2 font-mono text-[10px] uppercase tracking-widest text-white/25 text-center">
          atomixos · v0.1.0 · config layer
        </footer>
      </main>
    </div>
  );
}
