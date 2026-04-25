import { useMemo } from "react";

const CMDS = [
  "qdbus",
  "notify-send",
  "plasma-apply-colorscheme",
  "plasma-apply-lookandfeel",
  "plasma-apply-cursortheme",
  "flatpak",
  "pkill",
  "sleep",
  "wait",
  "set",
];

export function ScriptHighlight({ code }: { code: string }) {
  const lines = useMemo(() => code.split("\n"), [code]);
  return (
    <pre
      className="font-mono text-xs leading-relaxed overflow-auto rounded-lg p-4"
      style={{
        backgroundColor: "#04070D",
        border: "1px solid rgba(59,130,246,0.08)",
        color: "#E5E7EB",
        maxHeight: 480,
      }}
    >
      <code>
        {lines.map((line, i) => (
          <div key={i}>{renderLine(line)}</div>
        ))}
      </code>
    </pre>
  );
}

function renderLine(line: string) {
  if (line.trim().startsWith("#")) {
    return <span style={{ color: "#6B7280" }}>{line || "\u00A0"}</span>;
  }
  type Token = { start: number; end: number; color: string };
  const tokens: Token[] = [];
  let m: RegExpExecArray | null;
  const stringRe = /"([^"\\]|\\.)*"/g;
  while ((m = stringRe.exec(line))) {
    tokens.push({ start: m.index, end: m.index + m[0].length, color: "#F59E0B" });
  }
  const varRe = /\$[A-Za-z_][A-Za-z0-9_]*|\$\{[^}]+\}/g;
  while ((m = varRe.exec(line))) {
    tokens.push({ start: m.index, end: m.index + m[0].length, color: "#A78BFA" });
  }
  for (const cmd of CMDS) {
    const re = new RegExp(`\\b${cmd}\\b`, "g");
    while ((m = re.exec(line))) {
      tokens.push({ start: m.index, end: m.index + cmd.length, color: "#0EA5E9" });
    }
  }
  tokens.sort((a, b) => a.start - b.start);
  const merged: Token[] = [];
  for (const t of tokens) {
    if (merged.length && t.start < merged[merged.length - 1].end) continue;
    merged.push(t);
  }
  const parts: { text: string; color?: string }[] = [];
  let cursor = 0;
  for (const t of merged) {
    if (t.start > cursor) parts.push({ text: line.slice(cursor, t.start) });
    parts.push({ text: line.slice(t.start, t.end), color: t.color });
    cursor = t.end;
  }
  if (cursor < line.length) parts.push({ text: line.slice(cursor) });
  if (!parts.length) return <span>{"\u00A0"}</span>;
  return (
    <>
      {parts.map((p, i) => (
        <span key={i} style={p.color ? { color: p.color } : undefined}>
          {p.text}
        </span>
      ))}
    </>
  );
}