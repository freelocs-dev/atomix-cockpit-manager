import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input, Select, Toggle, SectionLabel } from "./primitives";
import type { ThemeConfig } from "../types";

const GLOBAL_THEMES = [
  "Breeze", "Breeze Dark", "Oxygen", "Nordic", "Layan", "Sweet",
  "Orchis", "McMojave-dark", "WhiteSur-dark", "Materia", "Adapta", "Arc Dark",
];
const ICON_THEMES = ["Papirus", "Papirus-Dark", "Breeze", "Tela", "Numix", "Flat-Remix", "Fluent"];
const CURSOR_THEMES = ["Breeze", "Adwaita", "Bibata", "McMojave", "Capitaine"];
const WINDOW_DECOS = ["Breeze", "Plastik", "Oxygen", "Sweet", "Custom"];

function Section({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border" style={{ backgroundColor: "#0D1526", borderColor: "rgba(99,179,237,0.08)" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-sm font-semibold text-white">{title}</span>
        <ChevronDown className={`w-4 h-4 text-[#64748B] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-[rgba(59,130,246,0.2)]"
        />
        <Input value={value} onChange={(e) => onChange(e.target.value)} className="flex-1" />
      </div>
    </Field>
  );
}

export function ThemeEditor({
  theme,
  onChange,
}: {
  theme: ThemeConfig;
  onChange: (patch: Partial<ThemeConfig>) => void;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-3">
        <Section title="Global Theme" defaultOpen>
          <Field label="Look and Feel">
            <Select
              value={theme.globalTheme}
              onChange={(e) => onChange({ globalTheme: e.target.value })}
            >
              {GLOBAL_THEMES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </Select>
          </Field>
        </Section>

        <Section title="Color Scheme" defaultOpen>
          <div className="grid grid-cols-3 gap-3">
            <ColorField label="Accent" value={theme.accentColor} onChange={(v) => onChange({ accentColor: v })} />
            <ColorField label="Background" value={theme.backgroundColor} onChange={(v) => onChange({ backgroundColor: v })} />
            <ColorField label="Text" value={theme.textColor} onChange={(v) => onChange({ textColor: v })} />
          </div>
        </Section>

        <Section title="Wallpaper">
          <Field label="Image path">
            <Input
              value={theme.wallpaperPath}
              onChange={(e) => onChange({ wallpaperPath: e.target.value })}
              placeholder="~/Pictures/wallpaper.png"
            />
          </Field>
          <Toggle
            checked={theme.randomizeWallpaper}
            onChange={(v) => onChange({ randomizeWallpaper: v })}
            label="Randomize from folder"
          />
          {theme.randomizeWallpaper && (
            <Field label="Folder path">
              <Input
                value={theme.wallpaperFolder ?? ""}
                onChange={(e) => onChange({ wallpaperFolder: e.target.value })}
                placeholder="~/Pictures/wallpapers"
              />
            </Field>
          )}
        </Section>

        <Section title="Icons">
          <Field label="Icon theme">
            <Select value={theme.iconTheme} onChange={(e) => onChange({ iconTheme: e.target.value })}>
              {ICON_THEMES.map((t) => <option key={t}>{t}</option>)}
            </Select>
          </Field>
        </Section>

        <Section title="Cursor">
          <Field label="Cursor theme">
            <Select value={theme.cursorTheme} onChange={(e) => onChange({ cursorTheme: e.target.value })}>
              {CURSOR_THEMES.map((t) => <option key={t}>{t}</option>)}
            </Select>
          </Field>
        </Section>

        <Section title="Fonts">
          <div className="grid grid-cols-2 gap-3">
            <Field label="UI Font">
              <Input value={theme.uiFont} onChange={(e) => onChange({ uiFont: e.target.value })} />
            </Field>
            <Field label="Monospace Font">
              <Input value={theme.monoFont} onChange={(e) => onChange({ monoFont: e.target.value })} />
            </Field>
          </div>
          <Field label="Font size">
            <Input
              type="number"
              value={theme.fontSize}
              onChange={(e) => onChange({ fontSize: Number(e.target.value) || 10 })}
            />
          </Field>
        </Section>

        <Section title="Window Decorations">
          <Field label="Style">
            <Select value={theme.windowDecoration} onChange={(e) => onChange({ windowDecoration: e.target.value })}>
              {WINDOW_DECOS.map((t) => <option key={t}>{t}</option>)}
            </Select>
          </Field>
          <Field label="Button position">
            <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: "rgba(59,130,246,0.2)" }}>
              {(["left", "right"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => onChange({ buttonPosition: p })}
                  className="flex-1 py-2 text-sm capitalize transition-colors"
                  style={{
                    backgroundColor: theme.buttonPosition === p ? "#3B82F6" : "transparent",
                    color: theme.buttonPosition === p ? "white" : "#94A3B8",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </Field>
        </Section>
      </div>

      <div className="lg:sticky lg:top-6 self-start">
        <SectionLabel>Preview (schematic)</SectionLabel>
        <div
          className="rounded-xl overflow-hidden border aspect-[4/3] flex flex-col"
          style={{
            backgroundColor: theme.backgroundColor,
            borderColor: "rgba(99,179,237,0.08)",
          }}
        >
          <div className="flex-1 p-4">
            <div
              className="h-full rounded-lg shadow-lg flex flex-col overflow-hidden"
              style={{ backgroundColor: "#0D1526", border: `1px solid ${theme.accentColor}33` }}
            >
              <div
                className="h-7 flex items-center px-2 gap-1.5"
                style={{
                  backgroundColor: theme.accentColor,
                  flexDirection: theme.buttonPosition === "left" ? "row" : "row-reverse",
                }}
              >
                <span className="w-2 h-2 rounded-full bg-white/60" />
                <span className="w-2 h-2 rounded-full bg-white/60" />
                <span className="w-2 h-2 rounded-full bg-white/60" />
              </div>
              <div className="flex-1 p-3 space-y-1.5">
                <div className="h-2 rounded w-1/2" style={{ backgroundColor: theme.textColor, opacity: 0.7 }} />
                <div className="h-2 rounded w-3/4" style={{ backgroundColor: theme.textColor, opacity: 0.4 }} />
                <div className="h-2 rounded w-2/3" style={{ backgroundColor: theme.textColor, opacity: 0.4 }} />
              </div>
            </div>
          </div>
          <div
            className="h-9 flex items-center px-3 gap-2"
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          >
            <span className="w-4 h-4 rounded" style={{ backgroundColor: theme.accentColor }} />
            <span className="w-4 h-4 rounded bg-white/20" />
            <span className="w-4 h-4 rounded bg-white/20" />
            <span className="ml-auto text-[10px]" style={{ color: theme.textColor, opacity: 0.7, fontFamily: theme.uiFont }}>
              {theme.uiFont}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}