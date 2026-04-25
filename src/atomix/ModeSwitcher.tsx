import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Code2, Palette } from "lucide-react";
import { MODE_META, type ModeKey } from "./types";

const ICONS = { gaming: Gamepad2, work: Code2, creator: Palette };

function nowStamp() {
  const d = new Date();
  const p = (n: number) => n.toString().padStart(2, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

type Props = {
  active: ModeKey;
  onChange: (m: ModeKey) => void;
};

export function ModeSwitcher({ active, onChange }: Props) {
  const [flash, setFlash] = useState<string | null>(null);
  const [terminal, setTerminal] = useState<string>(
    `> atomix ${active} — active · ${nowStamp()}`,
  );

  const handle = (m: ModeKey) => {
    if (m === active) return;
    setFlash(MODE_META[m].accent);
    onChange(m);
    setTerminal(`> atomix ${m} — activated · ${nowStamp()}`);
    setTimeout(() => setFlash(null), 220);
  };

  return (
    <section className="space-y-4">
      <div className="font-mono text-[11px] uppercase tracking-widest text-white/40">
        Active Mode
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        {(Object.keys(MODE_META) as ModeKey[]).map((key) => {
          const meta = MODE_META[key];
          const Icon = ICONS[key];
          const isActive = active === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => handle(key)}
              className="group relative text-left p-8 min-h-[140px] rounded-md transition-all w-full"
              style={{
                backgroundColor: isActive
                  ? `color-mix(in oklab, ${meta.accent} 4%, #0F1020)`
                  : "#0F1020",
                border: `1px solid ${
                  isActive
                    ? `color-mix(in oklab, ${meta.accent} 60%, transparent)`
                    : "rgba(255,255,255,0.06)"
                }`,
                boxShadow: isActive
                  ? `0 0 20px color-mix(in oklab, ${meta.accent} 10%, transparent)`
                  : "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "rgba(255,255,255,0.12)";
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "rgba(255,255,255,0.06)";
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <Icon className="w-8 h-8" style={{ color: meta.accent }} />
                {isActive && (
                  <span
                    className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-sm"
                    style={{
                      backgroundColor: `color-mix(in oklab, ${meta.accent} 15%, transparent)`,
                      color: meta.accent,
                      border: `1px solid color-mix(in oklab, ${meta.accent} 30%, transparent)`,
                    }}
                  >
                    ● ACTIVE
                  </span>
                )}
              </div>
              <div className="font-mono text-lg text-white">{meta.label}</div>
              <div className="text-xs text-white/40 mt-1">{meta.subtitle}</div>
              {isActive && (
                <motion.div
                  layoutId="mode-accent-bar"
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: meta.accent }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="font-mono text-xs text-white/50">
        <span>{terminal}</span>
        <span className="cursor-blink" />
      </div>

      <AnimatePresence>
        {flash && (
          <motion.div
            key={flash}
            initial={{ opacity: 0.04 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 pointer-events-none z-50"
            style={{ backgroundColor: flash }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}