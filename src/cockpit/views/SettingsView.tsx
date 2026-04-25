import { Button, Pill, SectionLabel } from "../components/primitives";
import { STORAGE_KEY } from "../types";
import type { useCockpitStore } from "../store";

type Store = ReturnType<typeof useCockpitStore>;

export function SettingsView({ store }: { store: Store }) {
  const exportAll = () => {
    const blob = new Blob([JSON.stringify(store.state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "atomix-cockpit-config.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    if (confirm("Reset all cockpit data? This cannot be undone.")) {
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-sm text-[#64748B] mt-1">Manage cockpit data and integrations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
        <div
          className="rounded-xl border p-6"
          style={{ backgroundColor: "#0D1526", borderColor: "rgba(99,179,237,0.08)" }}
        >
          <SectionLabel>Data</SectionLabel>
          <p className="text-sm text-[#94A3B8] mb-4">
            All your scenarios, themes, and apps live in localStorage under{" "}
            <code className="font-mono text-[#60A5FA]">{STORAGE_KEY}</code>.
          </p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={exportAll}>
              Export config
            </Button>
            <Button variant="ghost" size="sm" onClick={reset}>
              Reset all data
            </Button>
          </div>
        </div>

        <div
          className="rounded-xl border p-6"
          style={{ backgroundColor: "#0D1526", borderColor: "rgba(99,179,237,0.08)" }}
        >
          <SectionLabel>Stats</SectionLabel>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[#94A3B8]">Scenarios</span>
              <Pill>{store.state.scenarios.length}</Pill>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#94A3B8]">Themes</span>
              <Pill>{store.state.themes.length}</Pill>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#94A3B8]">Library apps</span>
              <Pill>{store.state.appLibrary.length}</Pill>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}