import { Fragment } from "react";

const TOKEN_COLORS = {
  comment: "#6B7280",
  command: "#0EA5E9",
  string: "#F59E0B",
  variable: "#A78BFA",
  plain: "#E5E7EB",
};

const COMMANDS = new Set([
  "qdbus",
  "notify-send",
  "plasma-apply-colorscheme",
  "pkill",
  "echo",
  "distrobox",
]);

type Token = { type: keyof typeof TOKEN_COLORS; text: string };

function tokenizeLine(line: string): Token[] {
  const trimmed = line.trimStart();
  if (trimmed.startsWith("#") && !trimmed.startsWith("#!")) {
    return [{ type: "comment", text: line }];
  }
  if (trimmed.startsWith("#!")) {
    return [{ type: "comment", text: line }];
  }
  const tokens: Token[] = [];
  // Split preserving quoted strings and $vars
  const regex = /("(?:[^"\\]|\\.)*")|(\$[A-Z_][A-Z0-9_]*|\$\{[^}]+\})|([A-Za-z_][A-Za-z0-9_-]*)|([^\s"$A-Za-z_]+|\s+)/g;
  let m: RegExpExecArray | null;
  let first = true;
  while ((m = regex.exec(line)) !== null) {
    if (m[1]) tokens.push({ type: "string", text: m[1] });
    else if (m[2]) tokens.push({ type: "variable", text: m[2] });
    else if (m[3]) {
      if (first && COMMANDS.has(m[3])) tokens.push({ type: "command", text: m[3] });
      else if (COMMANDS.has(m[3])) tokens.push({ type: "command", text: m[3] });
      else tokens.push({ type: "plain", text: m[3] });
    } else if (m[4]) tokens.push({ type: "plain", text: m[4] });
    if (m[3] || m[1]) first = false;
  }
  return tokens;
}

export function Highlight({ code }: { code: string }) {
  const lines = code.split("\n");
  return (
    <pre className="font-mono text-sm leading-relaxed whitespace-pre">
      {lines.map((line, i) => (
        <Fragment key={i}>
          {tokenizeLine(line).map((t, j) => (
            <span key={j} style={{ color: TOKEN_COLORS[t.type] }}>
              {t.text}
            </span>
          ))}
          {"\n"}
        </Fragment>
      ))}
    </pre>
  );
}