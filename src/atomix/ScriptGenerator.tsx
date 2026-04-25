import { useMemo, useState } from "react";
import { Copy, Download, Check } from "lucide-react";
import JSZip from "jszip";
import { generateAllScripts } from "./scripts";
import { Highlight } from "./Highlight";
import type { AtomixConfig } from "./types";

const TABS = ["gaming.sh", "work.sh", "creator.sh", "reset.sh"] as const;
type Tab = (typeof TABS)[number];

const TAB_ACCENT: Record<Tab, string> = {
  "gaming.sh": "#DC2626",
  "work.sh": "#0EA5E9",
  "creator.sh": "#F59E0B",
  "reset.sh": "#A78BFA",
};

export function ScriptGenerator({ config }: { config: AtomixConfig }) {
  const [tab, setTab] = useState<Tab>("gaming.sh");
  const [copied, setCopied] = useState(false);
  const scripts = useMemo(() => generateAllScripts(config), [config]);
  const accent = TAB_ACCENT[tab];
  const code = scripts[tab];

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadZip = async () => {
    const zip = new JSZip();
    for (const [name, content] of Object.entries(scripts)) {
      zip.file(name, content);
    }
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "atomixos-scripts.zip";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-widest text-white/40">
            Script Generator
          </div>
          <div className="text-xs text-white/50 mt-1 font-mono">
            Copy scripts to <span className="text-white/70">~/.atomixos/scripts/</span>
          </div>
        </div>
        <button
          type="button"
          onClick={downloadZip}
          className="font-mono text-xs uppercase tracking-wider px-3 h-9 rounded-md border border-white/10 text-white/80 hover:text-white hover:border-white/25 flex items-center gap-2"
        >
          <Download size={13} /> .zip
        </button>
      </div>

      <div className="flex gap-1 border-b border-white/[0.06]">
        {TABS.map((t) => {
          const isActive = tab === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className="font-mono text-xs px-3 py-2 transition-colors"
              style={{
                color: isActive ? TAB_ACCENT[t] : "rgba(255,255,255,0.45)",
                backgroundColor: isActive
                  ? `color-mix(in oklab, ${TAB_ACCENT[t]} 8%, transparent)`
                  : "transparent",
                borderBottom: isActive
                  ? `2px solid ${TAB_ACCENT[t]}`
                  : "2px solid transparent",
                marginBottom: "-1px",
              }}
            >
              {t}
            </button>
          );
        })}
      </div>

      <div className="relative rounded-md border border-white/[0.06] bg-[#060608] overflow-hidden">
        <button
          type="button"
          onClick={copy}
          className="absolute top-2 right-2 z-10 font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm border border-white/10 bg-black/40 text-white/70 hover:text-white flex items-center gap-1.5"
        >
          {copied ? <Check size={11} style={{ color: accent }} /> : <Copy size={11} />}
          {copied ? "copied" : "copy"}
        </button>
        <div className="p-4 max-h-[400px] overflow-auto">
          <Highlight code={code} />
        </div>
      </div>
    </section>
  );
}