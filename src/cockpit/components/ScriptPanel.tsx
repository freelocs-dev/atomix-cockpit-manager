import { Copy, Download } from "lucide-react";
import { useState } from "react";
import { Drawer } from "./Drawer";
import { Button } from "./primitives";
import { ScriptHighlight } from "./ScriptHighlight";

export function ScriptPanel({
  open,
  onClose,
  title,
  filename,
  script,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  filename: string;
  script: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(script);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  };

  const download = () => {
    const blob = new Blob([script], { type: "text/x-shellscript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Drawer open={open} onClose={onClose} title={title} width={620}>
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" onClick={copy}>
          <Copy className="w-3.5 h-3.5" />
          {copied ? "Copied" : "Copy"}
        </Button>
        <Button variant="primary" size="sm" onClick={download}>
          <Download className="w-3.5 h-3.5" />
          Download .sh
        </Button>
      </div>
      <ScriptHighlight code={script} />
    </Drawer>
  );
}