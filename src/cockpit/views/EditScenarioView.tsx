import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronDown, GripVertical, Pencil, Play, Plus, Save, Square, Trash2 } from "lucide-react";
import { Button, Input, Pill, Select, Toggle, SectionLabel } from "../components/primitives";
import { AppSearch } from "../components/AppSearch";
import { ThemeEditor } from "../components/ThemeEditor";
import type { AppConfig, Scenario } from "../types";
import { DEFAULT_APP_CONFIG } from "../types";
import type { useCockpitStore } from "../store";

type Store = ReturnType<typeof useCockpitStore>;
type Tab = "apps" | "theme" | "behavior";

export function EditScenarioView({
  scenario,
  store,
  onBack,
}: {
  scenario: Scenario;
  store: Store;
  onBack: () => void;
}) {
  const [tab, setTab] = useState<Tab>("apps");
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(scenario.name);

  const commitName = () => {
    setEditingName(false);
    if (name.trim() && name.trim() !== scenario.name) {
      store.updateScenario(scenario.id, { name: name.trim() });
    } else {
      setName(scenario.name);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-[#94A3B8] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Scenarios
          </button>
          <span className="text-[#475569]">/</span>
          <span className="text-2xl">{scenario.emoji}</span>
          {editingName ? (
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={commitName}
              onKeyDown={(e) => e.key === "Enter" && commitName()}
              className="max-w-xs"
            />
          ) : (
            <button
              type="button"
              onClick={() => setEditingName(true)}
              className="group flex items-center gap-2 text-2xl font-bold text-white hover:text-[#60A5FA] transition-colors"
            >
              {scenario.name}
              <Pencil className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-[#64748B]" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <Save className="w-3.5 h-3.5" />
            Save
          </Button>
          <Button onClick={() => store.toggleScenarioRunning(scenario.id)}>
            {scenario.isRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {scenario.isRunning ? "Stop Scenario" : "Start Scenario"}
          </Button>
        </div>
      </div>

      <div className="flex gap-1 border-b mb-8" style={{ borderColor: "rgba(99,179,237,0.08)" }}>
        {(["apps", "theme", "behavior"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className="px-5 py-3 text-sm font-medium capitalize transition-colors relative"
            style={{
              color: tab === t ? "#F0F4FF" : "#64748B",
            }}
          >
            {t}
            {tab === t && (
              <motion.span
                layoutId="edit-tab"
                className="absolute left-0 right-0 -bottom-px h-[2px]"
                style={{ backgroundColor: "#3B82F6" }}
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {tab === "apps" && <AppsTab scenario={scenario} store={store} />}
          {tab === "theme" && (
            <div className="space-y-2">
              <p className="text-sm text-[#94A3B8] mb-4">
                Configure the visual appearance applied when this scenario starts.
              </p>
              <ThemeEditor
                theme={scenario.themeConfig}
                onChange={(patch) => store.updateScenarioTheme(scenario.id, patch)}
              />
            </div>
          )}
          {tab === "behavior" && <BehaviorTab scenario={scenario} store={store} />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function AppsTab({ scenario, store }: { scenario: Scenario; store: Store }) {
  const [adding, setAdding] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Apps in this Scenario</h2>
          <p className="text-xs text-[#64748B] mt-0.5">{scenario.apps.length} configured</p>
        </div>
        <Button onClick={() => setAdding((a) => !a)}>
          <Plus className="w-4 h-4" />
          Add App
        </Button>
      </div>

      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <AppSearch
              onAdd={(entry) => {
                const app: Omit<AppConfig, "id"> = {
                  name: entry.name,
                  emoji: entry.emoji,
                  installMethod: entry.installMethod,
                  flatpakId: entry.flatpakId,
                  command: entry.command,
                  ...DEFAULT_APP_CONFIG,
                };
                store.addAppToScenario(scenario.id, app);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="rounded-lg p-3 text-xs"
        style={{ backgroundColor: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)" }}
      >
        <span className="text-[#60A5FA] font-medium">ⓘ</span>{" "}
        <span className="text-[#94A3B8]">
          Apps marked as Flatpak will be automatically installed via{" "}
          <code className="font-mono text-[#60A5FA]">flatpak install [id]</code> when the scenario
          starts if not already present.
        </span>
      </div>

      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {scenario.apps.map((app, idx) => (
            <AppRow
              key={app.id}
              app={app}
              expanded={expanded === app.id}
              onToggleExpand={() => setExpanded(expanded === app.id ? null : app.id)}
              onUpdate={(patch) => store.updateScenarioApp(scenario.id, app.id, patch)}
              onRemove={() => store.removeScenarioApp(scenario.id, app.id)}
              onMoveUp={idx > 0 ? () => store.reorderScenarioApps(scenario.id, idx, idx - 1) : undefined}
              onMoveDown={
                idx < scenario.apps.length - 1
                  ? () => store.reorderScenarioApps(scenario.id, idx, idx + 1)
                  : undefined
              }
            />
          ))}
        </AnimatePresence>
        {scenario.apps.length === 0 && !adding && (
          <div className="text-center py-12 text-sm text-[#64748B]">
            No apps yet — click <span className="text-[#60A5FA]">Add App</span> to begin.
          </div>
        )}
      </div>
    </div>
  );
}

function AppRow({
  app,
  expanded,
  onToggleExpand,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  app: AppConfig;
  expanded: boolean;
  onToggleExpand: () => void;
  onUpdate: (patch: Partial<AppConfig>) => void;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16 }}
      className="rounded-lg border"
      style={{ backgroundColor: "#0D1526", borderColor: "rgba(99,179,237,0.08)" }}
    >
      <div className="flex items-center gap-3 p-4">
        <div className="flex flex-col">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!onMoveUp}
            className="text-[#475569] hover:text-[#60A5FA] disabled:opacity-30 disabled:hover:text-[#475569]"
          >
            <GripVertical className="w-4 h-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={onToggleExpand}
          className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0"
          style={{ backgroundColor: "rgba(59,130,246,0.1)" }}
        >
          {app.emoji}
        </button>
        <button type="button" onClick={onToggleExpand} className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white truncate">{app.name}</span>
            <Pill color={app.installMethod === "flatpak" ? "blue" : "gray"}>
              {app.installMethod === "flatpak" ? "Flatpak" : "System"}
            </Pill>
          </div>
          {app.flatpakId && (
            <div className="text-xs text-[#64748B] font-mono mt-0.5 truncate">{app.flatpakId}</div>
          )}
          {!app.flatpakId && app.command && (
            <div className="text-xs text-[#64748B] font-mono mt-0.5 truncate">{app.command}</div>
          )}
        </button>
        <div className="flex items-center gap-1">
          {onMoveDown && (
            <button
              type="button"
              onClick={onMoveDown}
              className="p-1.5 rounded text-[#64748B] hover:text-white"
              title="Move down"
            >
              ↓
            </button>
          )}
          <button
            type="button"
            onClick={onToggleExpand}
            className="p-2 rounded text-[#64748B] hover:text-white"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="p-2 rounded text-[#64748B] hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div
              className="px-4 pb-4 pt-2 grid grid-cols-2 gap-3 border-t"
              style={{ borderColor: "rgba(255,255,255,0.05)" }}
            >
              <Field label="Monitor">
                <Select value={app.monitor} onChange={(e) => onUpdate({ monitor: e.target.value as AppConfig["monitor"] })}>
                  <option value="any">Any</option>
                  <option value="1">Monitor 1</option>
                  <option value="2">Monitor 2</option>
                  <option value="3">Monitor 3</option>
                </Select>
              </Field>
              <Field label="Position">
                <Select value={app.position} onChange={(e) => onUpdate({ position: e.target.value as AppConfig["position"] })}>
                  <option value="maximized">Maximized</option>
                  <option value="left-half">Left Half</option>
                  <option value="right-half">Right Half</option>
                  <option value="top-half">Top Half</option>
                  <option value="float">Float</option>
                  <option value="custom">Custom</option>
                </Select>
              </Field>
              <Field label="Priority">
                <Select value={app.priority} onChange={(e) => onUpdate({ priority: e.target.value as AppConfig["priority"] })}>
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </Select>
              </Field>
              <Field label="Start delay (s)">
                <Input
                  type="number"
                  value={app.startDelay}
                  onChange={(e) => onUpdate({ startDelay: Number(e.target.value) || 0 })}
                />
              </Field>
              <div className="col-span-2">
                <Field label="Start command (override)">
                  <Input
                    value={app.command ?? ""}
                    onChange={(e) => onUpdate({ command: e.target.value || undefined })}
                    placeholder={app.installMethod === "flatpak" ? `flatpak run ${app.flatpakId}` : "/usr/bin/..."}
                  />
                </Field>
              </div>
              <div className="col-span-2">
                <Toggle
                  checked={app.waitForPrevious}
                  onChange={(v) => onUpdate({ waitForPrevious: v })}
                  label="Wait for previous app"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-medium text-[#94A3B8] mb-1.5">{label}</div>
      {children}
    </div>
  );
}

function BehaviorTab({ scenario, store }: { scenario: Scenario; store: Store }) {
  const b = scenario.behavior;
  const update = (patch: Partial<typeof b>) => store.updateScenarioBehavior(scenario.id, patch);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-3">
        <SectionLabel>On Start</SectionLabel>
        <BehaviorCard>
          <Toggle
            checked={b.showNotification}
            onChange={(v) => update({ showNotification: v })}
            label="Show notification when scenario starts"
          />
          {b.showNotification && (
            <Input
              className="mt-3"
              value={b.notificationText}
              onChange={(e) => update({ notificationText: e.target.value })}
              placeholder="Notification text"
            />
          )}
        </BehaviorCard>
        <BehaviorCard>
          <Toggle
            checked={b.killAppsOnStart}
            onChange={(v) => update({ killAppsOnStart: v })}
            label="Kill all running apps before starting"
          />
        </BehaviorCard>
        <BehaviorCard>
          <Toggle
            checked={b.switchVirtualDesktop}
            onChange={(v) => update({ switchVirtualDesktop: v })}
            label="Switch to virtual desktop"
          />
          {b.switchVirtualDesktop && (
            <Input
              className="mt-3 max-w-[120px]"
              type="number"
              value={b.virtualDesktopNumber}
              onChange={(e) => update({ virtualDesktopNumber: Number(e.target.value) || 1 })}
            />
          )}
        </BehaviorCard>
        <BehaviorCard>
          <Toggle
            checked={b.applyThemeFirst}
            onChange={(v) => update({ applyThemeFirst: v })}
            label="Apply theme before launching apps"
          />
        </BehaviorCard>
        <BehaviorCard>
          <div className="text-sm text-white mb-2">Delay before starting apps (s)</div>
          <Input
            type="number"
            value={b.appStartDelay}
            onChange={(e) => update({ appStartDelay: Number(e.target.value) || 0 })}
            className="max-w-[120px]"
          />
        </BehaviorCard>
      </div>

      <div className="space-y-3">
        <SectionLabel>On Stop</SectionLabel>
        <BehaviorCard>
          <Toggle
            checked={b.saveStateOnStop}
            onChange={(v) => update({ saveStateOnStop: v })}
            label="Save running apps state"
          />
        </BehaviorCard>
        <BehaviorCard>
          <Toggle
            checked={b.showStopNotification}
            onChange={(v) => update({ showStopNotification: v })}
            label="Show stop notification"
          />
        </BehaviorCard>

        <SectionLabel>Scheduling</SectionLabel>
        <div
          className="rounded-xl border p-5 opacity-50 space-y-3"
          style={{ backgroundColor: "#0D1526", borderColor: "rgba(99,179,237,0.08)" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-white">Auto-start on time</span>
            <Pill color="blue">Coming soon</Pill>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white">Auto-start on device connect</span>
            <Pill color="blue">Coming soon</Pill>
          </div>
        </div>
      </div>
    </div>
  );
}

function BehaviorCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{ backgroundColor: "#0D1526", borderColor: "rgba(99,179,237,0.08)" }}
    >
      {children}
    </div>
  );
}