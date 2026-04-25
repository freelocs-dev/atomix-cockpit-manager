import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button, Input, Pill } from "./primitives";
import { FLATPAK_CATALOG } from "../types";
import type { AppLibraryEntry } from "../types";

export function AppSearch({
  onAdd,
}: {
  onAdd: (entry: Omit<AppLibraryEntry, "id">) => void;
}) {
  const [tab, setTab] = useState<"flatpak" | "system">("flatpak");
  const [query, setQuery] = useState("");

  const [sysName, setSysName] = useState("");
  const [sysCmd, setSysCmd] = useState("");
  const [sysFlatpakId, setSysFlatpakId] = useState("");

  const results = FLATPAK_CATALOG.filter((a) =>
    [a.name, a.flatpakId].join(" ").toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div
      className="rounded-xl border p-5 space-y-4"
      style={{ backgroundColor: "#0A0F1E", borderColor: "rgba(99,179,237,0.08)" }}
    >
      <div className="flex gap-1">
        {(["flatpak", "system"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
            style={{
              backgroundColor: tab === t ? "rgba(59,130,246,0.15)" : "transparent",
              color: tab === t ? "#60A5FA" : "#64748B",
            }}
          >
            {t === "flatpak" ? "Search Flatpak" : "System App"}
          </button>
        ))}
      </div>

      {tab === "flatpak" ? (
        <>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Flatpak apps..."
              className="pl-9"
            />
          </div>
          <div className="max-h-72 overflow-y-auto space-y-1.5">
            {results.map((r) => (
              <div
                key={r.flatpakId}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/[0.03] transition-colors"
              >
                <span className="text-xl">{r.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white font-medium truncate">{r.name}</div>
                  <div className="text-xs text-[#64748B] truncate font-mono">{r.flatpakId}</div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    onAdd({
                      name: r.name,
                      emoji: r.emoji,
                      installMethod: "flatpak",
                      flatpakId: r.flatpakId,
                    })
                  }
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </Button>
              </div>
            ))}
            {results.length === 0 && (
              <div className="text-center text-sm text-[#64748B] py-6">No results</div>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-[#94A3B8] pt-2">
            <Pill>Flatpak</Pill>
            <span>Will install via flatpak install when scenario starts</span>
          </div>
        </>
      ) : (
        <div className="space-y-3">
          <Input value={sysName} onChange={(e) => setSysName(e.target.value)} placeholder="App name" />
          <Input
            value={sysCmd}
            onChange={(e) => setSysCmd(e.target.value)}
            placeholder="Command (e.g. /usr/bin/firefox)"
          />
          <Input
            value={sysFlatpakId}
            onChange={(e) => setSysFlatpakId(e.target.value)}
            placeholder="Flatpak ID (optional)"
          />
          <Button
            disabled={!sysName.trim() || !sysCmd.trim()}
            onClick={() => {
              onAdd({
                name: sysName.trim(),
                emoji: "📦",
                installMethod: "system",
                command: sysCmd.trim(),
                flatpakId: sysFlatpakId.trim() || undefined,
              });
              setSysName("");
              setSysCmd("");
              setSysFlatpakId("");
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            Add to Scenario
          </Button>
        </div>
      )}
    </div>
  );
}