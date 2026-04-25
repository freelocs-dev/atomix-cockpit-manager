import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus } from "lucide-react";
import { MODE_META, type ModeKey, type ModeConfig } from "./types";
import { Toggle } from "./Toggle";

type Props = {
  mode: ModeKey;
  config: ModeConfig;
  onUpdate: (patch: Partial<ModeConfig>) => void;
  onAddApp: (app: { name: string; command: string; emoji: string; enabled: boolean }) => void;
  onRemoveApp: (id: string) => void;
  onToggleApp: (id: string) => void;
};

export function ModeConfigPanel({
  mode,
  config,
  onUpdate,
  onAddApp,
  onRemoveApp,
  onToggleApp,
}: Props) {
  const accent = MODE_META[mode].accent;
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [command, setCommand] = useState("");
  const [emoji, setEmoji] = useState("⚙️");

  const submit = () => {
    if (!name.trim() || !command.trim()) return;
    onAddApp({ name: name.trim(), command: command.trim(), emoji: emoji.trim() || "⚙️", enabled: true });
    setName("");
    setCommand("");
    setEmoji("⚙️");
    setAdding(false);
  };

  const inputCls =
    "font-mono text-sm bg-[#080810] border border-white/10 px-3 py-2 rounded-md text-white placeholder:text-white/30 focus:outline-none focus:border-white/25";

  return (
    <div className="space-y-8">
      {/* Apps */}
      <div>
        <div className="font-mono text-[11px] uppercase tracking-widest text-white/40 mb-3">
          Auto-Start Apps
        </div>
        <div className="rounded-md border border-white/[0.06] bg-[#0F1020] overflow-hidden">
          {config.apps.length === 0 && (
            <div className="px-4 py-6 text-center text-xs text-white/30 font-mono">
              No apps configured
            </div>
          )}
          {config.apps.map((app, i) => (
            <div
              key={app.id}
              className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.02]"
              style={{
                borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <span className="text-xl">{app.emoji}</span>
              <span className="font-mono text-sm text-white min-w-0 w-28 truncate">
                {app.name}
              </span>
              <span className="font-mono text-xs text-white/40 truncate flex-1">
                {app.command}
              </span>
              <Toggle
                checked={app.enabled}
                onChange={() => onToggleApp(app.id)}
                accent={accent}
              />
              <button
                type="button"
                onClick={() => onRemoveApp(app.id)}
                className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-500 transition-all p-1"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>

        <AnimatePresence initial={false}>
          {adding ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-[60px_1fr_1.5fr_auto_auto] gap-2 items-center">
                <input
                  className={inputCls + " text-center"}
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                  placeholder="⚙️"
                  maxLength={4}
                />
                <input
                  className={inputCls}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="App name"
                />
                <input
                  className={inputCls}
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="/usr/bin/command"
                />
                <button
                  type="button"
                  onClick={submit}
                  className="font-mono text-xs uppercase tracking-wider px-4 h-10 rounded-md text-black"
                  style={{ backgroundColor: accent }}
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setAdding(false)}
                  className="font-mono text-xs uppercase tracking-wider px-4 h-10 rounded-md border border-white/10 text-white/60 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          ) : (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="mt-3 w-full h-10 rounded-md border border-dashed border-white/15 text-white/50 hover:text-white hover:border-white/30 font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <Plus size={14} /> Add App
            </button>
          )}
        </AnimatePresence>
      </div>

      {/* Wallpaper */}
      <div>
        <div className="font-mono text-[11px] uppercase tracking-widest text-white/40 mb-3">
          Wallpaper Path
        </div>
        <div className="flex items-center gap-3">
          <span
            className="block w-9 h-9 rounded-sm shrink-0"
            style={{ backgroundColor: accent }}
          />
          <input
            className={inputCls + " w-full"}
            value={config.wallpaperPath}
            onChange={(e) => onUpdate({ wallpaperPath: e.target.value })}
          />
        </div>
      </div>

      {/* Behavior */}
      <div>
        <div className="font-mono text-[11px] uppercase tracking-widest text-white/40 mb-3">
          Behavior
        </div>
        <div className="rounded-md border border-white/[0.06] bg-[#0F1020] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="font-mono text-sm text-white/80">
              Show notification on mode switch
            </span>
            <Toggle
              checked={config.notifications}
              onChange={(v) => onUpdate({ notifications: v })}
              accent={accent}
            />
          </div>
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
          >
            <span className="font-mono text-sm text-white/80">
              Auto-close previous session apps
            </span>
            <Toggle
              checked={config.autoCloseApps}
              onChange={(v) => onUpdate({ autoCloseApps: v })}
              accent={accent}
            />
          </div>
        </div>
      </div>
    </div>
  );
}