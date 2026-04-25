import type { Scenario } from "./types";

export function generateScenarioScript(scenario: Scenario): string {
  const lines: string[] = [];
  lines.push("#!/usr/bin/env bash");
  lines.push(`# AtomixOS Cockpit — ${scenario.name}`);
  lines.push(`# Generated ${new Date().toISOString()}`);
  lines.push("");
  lines.push('set -euo pipefail');
  lines.push("");
  lines.push('ATOMIX="$HOME/.atomixos"');
  lines.push(`SCENARIO="${scenario.name}"`);
  lines.push("");

  if (scenario.behavior.killAppsOnStart) {
    lines.push("# Kill running graphical apps before starting");
    lines.push("pkill -u $USER -TERM -f 'firefox|chromium|steam|discord|obs' || true");
    lines.push("");
  }

  if (scenario.behavior.switchVirtualDesktop) {
    lines.push("# Switch to virtual desktop");
    lines.push(
      `qdbus org.kde.KWin /KWin setCurrentDesktop ${scenario.behavior.virtualDesktopNumber}`,
    );
    lines.push("");
  }

  const flatpakApps = scenario.apps.filter(
    (a) => a.installMethod === "flatpak" && a.flatpakId,
  );
  if (flatpakApps.length) {
    lines.push("# Ensure Flatpak apps are installed");
    for (const app of flatpakApps) {
      lines.push(
        `flatpak info ${app.flatpakId} >/dev/null 2>&1 || flatpak install -y --noninteractive flathub ${app.flatpakId}`,
      );
    }
    lines.push("");
  }

  if (scenario.behavior.applyThemeFirst) {
    const t = scenario.themeConfig;
    lines.push("# Apply Plasma theme");
    lines.push(`plasma-apply-lookandfeel -a "${t.globalTheme}" || true`);
    lines.push(`plasma-apply-colorscheme "${t.globalTheme}" || true`);
    lines.push(`plasma-apply-cursortheme "${t.cursorTheme}" || true`);
    if (t.wallpaperPath) {
      lines.push("# Wallpaper");
      lines.push(
        `qdbus org.kde.plasmashell /PlasmaShell evaluateScript "var allDesktops = desktops(); for (i=0;i<allDesktops.length;i++) { d = allDesktops[i]; d.wallpaperPlugin = 'org.kde.image'; d.currentConfigGroup = ['Wallpaper','org.kde.image','General']; d.writeConfig('Image','file://${t.wallpaperPath}'); }"`,
      );
    }
    lines.push("");
  }

  if (scenario.behavior.appStartDelay > 0) {
    lines.push(`sleep ${scenario.behavior.appStartDelay}`);
    lines.push("");
  }

  if (scenario.apps.length) {
    lines.push("# Launch apps");
    for (const app of scenario.apps) {
      const cmd =
        app.command ||
        (app.installMethod === "flatpak" && app.flatpakId
          ? `flatpak run ${app.flatpakId}`
          : app.name.toLowerCase());
      if (app.startDelay > 0) lines.push(`sleep ${app.startDelay}`);
      lines.push(`# ${app.name} — ${app.position} · monitor ${app.monitor} · ${app.priority}`);
      lines.push(`${cmd} &`);
      if (app.waitForPrevious) lines.push("wait $!");
    }
    lines.push("");
  }

  if (scenario.behavior.showNotification) {
    lines.push("# Notify user");
    lines.push(
      `notify-send "AtomixOS" "${scenario.behavior.notificationText.replace(/"/g, '\\"')}"`,
    );
  }

  return lines.join("\n") + "\n";
}

export function generateThemeScript(theme: import("./types").ThemeConfig): string {
  const lines = [
    "#!/usr/bin/env bash",
    `# AtomixOS Theme — ${theme.name}`,
    "set -euo pipefail",
    "",
    `plasma-apply-lookandfeel -a "${theme.globalTheme}" || true`,
    `plasma-apply-colorscheme "${theme.globalTheme}" || true`,
    `plasma-apply-cursortheme "${theme.cursorTheme}" || true`,
  ];
  if (theme.wallpaperPath) {
    lines.push(
      `qdbus org.kde.plasmashell /PlasmaShell evaluateScript "var d = desktops()[0]; d.wallpaperPlugin='org.kde.image'; d.currentConfigGroup=['Wallpaper','org.kde.image','General']; d.writeConfig('Image','file://${theme.wallpaperPath}');"`,
    );
  }
  return lines.join("\n") + "\n";
}