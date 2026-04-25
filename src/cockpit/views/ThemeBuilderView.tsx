import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Code2, Plus, Trash2 } from "lucide-react";
import { Button, Input, Pill, Select } from "../components/primitives";
import { ThemeEditor } from "../components/ThemeEditor";
import { ScriptPanel } from "../components/ScriptPanel";
import { generateThemeScript } from "../scriptGenerator";
import type { useCockpitStore } from "../store";

type Store = ReturnType<typeof useCockpitStore>;

export function ThemeBuilderView({ store }: { store: Store }) {
  const themes = store.state.themes;
  const scenarios = store.state.scenarios;
  const [selectedId, setSelectedId] = useState<string | null>(themes[0]?.id ?? null);
  const [exportOpen, setExportOpen] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (!selectedId && themes.length > 0) setSelectedId(themes[0].id);
    if (selectedId && !themes.find((t) => t.id === selectedId)) {
      setSelectedId(themes[0]?.id ?? null);
    }
  }, [themes, selectedId]);

  const selected = themes.find((t) => t.id === selectedId) ?? null;

  return (
    <>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Theme Builder</h1>
          <p className="text-sm text-[#64748B] mt-1">Design reusable themes for your scenarios</p>
        </div>
      </div>

      <div className="grid grid-cols-[220px_1fr] gap-6">
        <aside className="space-y-2">
          <div
            className="rounded-xl border p-3 space-y-2"
            style={{ backgroundColor: "#0A0F1E", borderColor: "rgba(99,179,237,0.08)" }}
          >
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Theme name"
            />
            <Button
              size="sm"
              className="w-full"
              disabled={!newName.trim()}
              onClick={() => {
                const id = store.createTheme(newName.trim());
                setSelectedId(id);
                setNewName("");
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              New Theme
            </Button>
          </div>

          <div className="space-y-1.5">
            {themes.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedId(t.id)}
                className="w-full text-left rounded-lg p-3 border transition-all"
                style={{
                  backgroundColor: selectedId === t.id ? "rgba(59,130,246,0.1)" : "#0D1526",
                  borderColor:
                    selectedId === t.id ? "rgba(59,130,246,0.4)" : "rgba(99,179,237,0.08)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: t.accentColor }}
                  />
                  <span
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: t.backgroundColor }}
                  />
                  <span
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: t.textColor }}
                  />
                </div>
                <div className="text-sm font-medium text-white truncate">{t.name}</div>
                <div className="text-xs text-[#64748B] truncate">{t.globalTheme}</div>
              </button>
            ))}
            {themes.length === 0 && (
              <div className="text-xs text-[#64748B] text-center py-6">
                No themes yet
              </div>
            )}
          </div>
        </aside>

        <div>
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <Input
                  value={selected.name}
                  onChange={(e) => store.updateTheme(selected.id, { name: e.target.value })}
                  className="max-w-sm font-semibold"
                />
                <div className="flex items-center gap-2">
                  <Select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        store.assignThemeToScenario(selected.id, e.target.value);
                      }
                    }}
                    className="max-w-[200px]"
                  >
                    <option value="">Assign to scenario…</option>
                    {scenarios.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.emoji} {s.name}
                      </option>
                    ))}
                  </Select>
                  <Button variant="ghost" size="sm" onClick={() => setExportOpen(true)}>
                    <Code2 className="w-3.5 h-3.5" />
                    Export .sh
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => store.deleteTheme(selected.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              {selected.themeId && <Pill>Linked to scenario</Pill>}
              <ThemeEditor
                theme={selected}
                onChange={(patch) => store.updateTheme(selected.id, patch)}
              />
            </motion.div>
          ) : (
            <div
              className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center py-24 text-center"
              style={{ borderColor: "rgba(59,130,246,0.3)" }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                style={{ backgroundColor: "rgba(59,130,246,0.1)" }}
              >
                <Plus className="w-7 h-7 text-[#3B82F6]" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Create your first theme</h2>
              <p className="text-sm text-[#64748B]">
                Type a name on the left and hit New Theme.
              </p>
            </div>
          )}
        </div>
      </div>

      {selected && (
        <ScriptPanel
          open={exportOpen}
          onClose={() => setExportOpen(false)}
          title={`Theme: ${selected.name}`}
          filename={`${selected.name.toLowerCase().replace(/\s+/g, "-")}-theme.sh`}
          script={generateThemeScript(selected)}
        />
      )}
    </>
  );
}