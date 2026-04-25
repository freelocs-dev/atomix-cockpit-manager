import { LayoutGrid, Paintbrush, Package, Settings, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CockpitView } from "../types-ui";

const NAV: { key: CockpitView; label: string; icon: LucideIcon }[] = [
  { key: "scenarios", label: "Scenarios", icon: LayoutGrid },
  { key: "themes", label: "Theme Builder", icon: Paintbrush },
  { key: "library", label: "App Library", icon: Package },
  { key: "settings", label: "Settings", icon: Settings },
];

export function CockpitSidebar({
  view,
  onChange,
}: {
  view: CockpitView;
  onChange: (v: CockpitView) => void;
}) {
  return (
    <aside
      className="w-60 shrink-0 h-screen sticky top-0 flex flex-col"
      style={{
        backgroundColor: "#08101F",
        borderRight: "1px solid rgba(59,130,246,0.1)",
      }}
    >
      <div className="px-6 py-6">
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-white tracking-tight">Atomix</span>
          <span className="text-xl font-bold text-[#3B82F6]">OS</span>
        </div>
        <div className="text-xs text-[#64748B] mt-0.5">Cockpit Manager</div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV.map((item) => {
          const active = view === item.key;
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange(item.key)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors relative",
                active
                  ? "text-white"
                  : "text-[#94A3B8] hover:text-white hover:bg-white/[0.03]",
              )}
              style={
                active
                  ? {
                      backgroundColor: "rgba(59,130,246,0.1)",
                    }
                  : undefined
              }
            >
              {active && (
                <span
                  className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-r"
                  style={{ backgroundColor: "#3B82F6" }}
                />
              )}
              <Icon className="w-4 h-4" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t" style={{ borderColor: "rgba(59,130,246,0.08)" }}>
        <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
          <span
            className="w-1.5 h-1.5 rounded-full bg-emerald-400"
            style={{ boxShadow: "0 0 8px rgba(16,185,129,0.6)" }}
          />
          <span>KDE Plasma 6</span>
        </div>
        <div className="text-[10px] text-[#475569] mt-1.5 uppercase tracking-widest">v0.2 beta</div>
      </div>
    </aside>
  );
}