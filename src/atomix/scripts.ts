import type { AtomixConfig, ModeKey, ModeConfig } from "./types";

export function generateModeScript(mode: ModeKey, cfg: ModeConfig): string {
  const enabledApps = cfg.apps.filter((a) => a.enabled);
  const lines: string[] = [];
  lines.push("#!/usr/bin/env bash");
  lines.push(`# AtomixOS — ${mode}.sh`);
  lines.push(`# Activates the ${mode} experience layer`);
  lines.push("");
  lines.push('ATOMIX="$HOME/.atomixos"');
  lines.push("");
  lines.push(`# Apply wallpaper`);
  lines.push(`qdbus org.kde.plasmashell /PlasmaShell evaluateScript "var d = desktops()[0]; d.wallpaperPlugin = 'org.kde.image'; d.currentConfigGroup = ['Wallpaper','org.kde.image','General']; d.writeConfig('Image','file://${cfg.wallpaperPath}')"`);
  lines.push("");
  lines.push(`# Apply color scheme`);
  lines.push(`plasma-apply-colorscheme "Atomix${mode.charAt(0).toUpperCase()}${mode.slice(1)}"`);
  lines.push("");
  if (cfg.autoCloseApps) {
    lines.push("# Close previous session apps");
    lines.push('pkill -f "atomix-session" || true');
    lines.push("");
  }
  lines.push("# Launch apps");
  for (const app of enabledApps) {
    lines.push(`# ${app.emoji} ${app.name}`);
    lines.push(`${app.command} &`);
  }
  lines.push("");
  if (cfg.notifications) {
    lines.push(`notify-send "AtomixOS" "${mode.charAt(0).toUpperCase()}${mode.slice(1)} mode activated" -i preferences-system`);
  }
  lines.push("");
  lines.push(`echo "[atomix] ${mode} mode ready"`);
  return lines.join("\n");
}

export function generateResetScript(): string {
  return [
    "#!/usr/bin/env bash",
    "# AtomixOS — reset.sh",
    "# Restores default desktop state",
    "",
    'ATOMIX="$HOME/.atomixos"',
    "",
    "# Kill all mode-launched apps",
    'pkill -f "atomix-session" || true',
    "",
    "# Restore default wallpaper",
    `qdbus org.kde.plasmashell /PlasmaShell evaluateScript "var d = desktops()[0]; d.wallpaperPlugin = 'org.kde.image'; d.writeConfig('Image','file://$ATOMIX/wallpapers/default.png')"`,
    "",
    "# Restore default color scheme",
    'plasma-apply-colorscheme "BreezeDark"',
    "",
    'notify-send "AtomixOS" "Reset to defaults" -i system-reboot',
    'echo "[atomix] reset complete"',
  ].join("\n");
}

export function generateAllScripts(config: AtomixConfig): Record<string, string> {
  return {
    "gaming.sh": generateModeScript("gaming", config.modes.gaming),
    "work.sh": generateModeScript("work", config.modes.work),
    "creator.sh": generateModeScript("creator", config.modes.creator),
    "reset.sh": generateResetScript(),
  };
}