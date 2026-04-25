import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Play, Square, Code2, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button, Pill, StatusDot } from "../components/primitives";
import { Drawer } from "../components/Drawer";
import { Input, Textarea } from "../components/primitives";
import { ScriptPanel } from "../components/ScriptPanel";
import { generateScenarioScript } from "../scriptGenerator";
import { SCENARIO_EMOJI_OPTIONS, type Scenario } from "../types";
import type { useCockpitStore } from "../store";

type Store = ReturnType<typeof useCockpitStore>;

export function ScenariosView({
  store,
  onEditScenario,
}: {
  store: Store;
  onEditScenario: (id: string) => void;
}) {
  const [createOpen, setCreateOpen] = useState(false);
  const [exporting, setExporting] = useState<Scenario | null>(null);
  const scenarios = store.state.scenarios;

  return (
    <>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Scenarios</h1>
          <p className="text-sm text-[#64748B] mt-1">Automate your desktop environment</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4" />
          New Scenario
        </Button>
      </div>

      {scenarios.length === 0 ? (
        <EmptyState onCreate={() => setCreateOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence initial={false}>
            {scenarios.map((sc) => (
              <ScenarioCard
                key={sc.id}
                scenario={sc}
                onEdit={() => onEditScenario(sc.id)}
                onToggle={() => store.toggleScenarioRunning(sc.id)}
                onDelete={() => store.deleteScenario(sc.id)}
                onExport={() => setExporting(sc)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <CreateScenarioDrawer
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={(input) => {
          const id = store.createScenario(input);
          setCreateOpen(false);
          onEditScenario(id);
        }}
      />

      {exporting && (
        <ScriptPanel
          open
          onClose={() => setExporting(null)}
          title={`Export: ${exporting.name}`}
          filename={`${exporting.name.toLowerCase().replace(/\s+/g, "-")}.sh`}
          script={generateScenarioScript(exporting)}
        />
      )}
    </>
  );
}

function ScenarioCard({
  scenario,
  onEdit,
  onToggle,
  onDelete,
  onExport,
}: {
  scenario: Scenario;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
  onExport: () => void;
}) {
  const visibleApps = scenario.apps.slice(0, 4);
  const extra = scenario.apps.length - visibleApps.length;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className={`rounded-xl border p-6 transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.08)] ${
        scenario.isRunning ? "glow-pulse" : ""
      }`}
      style={{
        backgroundColor: "#0D1526",
        borderColor: scenario.isRunning ? "rgba(59,130,246,0.4)" : "rgba(99,179,237,0.08)",
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl">{scenario.emoji}</span>
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-white truncate">{scenario.name}</h3>
          </div>
        </div>
        <Pill color={scenario.isRunning ? "green" : "gray"}>
          <StatusDot on={scenario.isRunning} color={scenario.isRunning ? "#10B981" : "#64748B"} />
          {scenario.isRunning ? "Running" : "Stopped"}
        </Pill>
      </div>

      <p className="text-sm text-[#94A3B8] mb-4 line-clamp-2 min-h-[40px]">
        {scenario.description || "No description"}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        <Pill>{scenario.apps.length} apps</Pill>
        <Pill>{scenario.themeConfig.globalTheme}</Pill>
      </div>

      <div className="h-px bg-white/[0.05] mb-4" />

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center -space-x-2">
          {visibleApps.map((a) => (
            <span
              key={a.id}
              title={a.name}
              className="w-8 h-8 rounded-full flex items-center justify-center text-base border-2"
              style={{
                backgroundColor: "#111D35",
                borderColor: "#0D1526",
              }}
            >
              {a.emoji}
            </span>
          ))}
          {extra > 0 && (
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-semibold border-2 text-[#94A3B8]"
              style={{ backgroundColor: "#111D35", borderColor: "#0D1526" }}
            >
              +{extra}
            </span>
          )}
          {visibleApps.length === 0 && (
            <span className="text-xs text-[#64748B]">No apps yet</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExport}
            className="p-2 rounded-md text-[#64748B] hover:text-white hover:bg-white/[0.05] transition-colors"
            title="Export script"
          >
            <Code2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-2 rounded-md text-[#64748B] hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </Button>
          <Button size="sm" onClick={onToggle}>
            {scenario.isRunning ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {scenario.isRunning ? "Stop" : "Start"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
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
      <h2 className="text-xl font-semibold text-white mb-2">Create your first scenario</h2>
      <p className="text-sm text-[#64748B] max-w-sm mb-6">
        Automate apps, themes, and layout for any context — gaming, work, creative flow.
      </p>
      <Button onClick={onCreate}>
        <Plus className="w-4 h-4" />
        New Scenario
      </Button>
    </div>
  );
}

function CreateScenarioDrawer({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (input: { name: string; description: string; emoji: string }) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState("⚡");

  const reset = () => {
    setName("");
    setDescription("");
    setEmoji("⚡");
  };

  return (
    <Drawer
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      title="New Scenario"
    >
      <div className="space-y-5">
        <div>
          <div className="text-xs font-medium text-[#94A3B8] mb-1.5">Name</div>
          <Input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Gaming Night"
          />
        </div>
        <div>
          <div className="text-xs font-medium text-[#94A3B8] mb-1.5">Description</div>
          <Textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this scenario for?"
          />
        </div>
        <div>
          <div className="text-xs font-medium text-[#94A3B8] mb-2">Icon</div>
          <div className="grid grid-cols-6 gap-2">
            {SCENARIO_EMOJI_OPTIONS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEmoji(e)}
                className="aspect-square rounded-lg flex items-center justify-center text-2xl transition-all"
                style={{
                  backgroundColor: emoji === e ? "rgba(59,130,246,0.15)" : "#060D1A",
                  border: `1px solid ${emoji === e ? "#3B82F6" : "rgba(59,130,246,0.1)"}`,
                }}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
        <Button
          className="w-full"
          disabled={!name.trim()}
          onClick={() => {
            onCreate({ name: name.trim(), description: description.trim(), emoji });
            reset();
          }}
        >
          Create Scenario
        </Button>
      </div>
    </Drawer>
  );
}