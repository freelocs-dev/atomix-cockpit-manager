export type ModeKey = "gaming" | "work" | "creator";

export type AppEntry = {
  id: string;
  name: string;
  command: string;
  emoji: string;
  enabled: boolean;
};

export type ModeConfig = {
  apps: AppEntry[];
  wallpaperPath: string;
  notifications: boolean;
  autoCloseApps: boolean;
};

export type AtomixConfig = {
  activeMode: ModeKey;
  modes: Record<ModeKey, ModeConfig>;
};

export const MODE_META: Record<
  ModeKey,
  { label: string; subtitle: string; accent: string; accentVar: string }
> = {
  gaming: {
    label: "Gaming",
    subtitle: "Performance · Focus · Immersion",
    accent: "#DC2626",
    accentVar: "var(--gaming)",
  },
  work: {
    label: "Work",
    subtitle: "Focus · Clarity · Flow",
    accent: "#0EA5E9",
    accentVar: "var(--work)",
  },
  creator: {
    label: "Creator",
    subtitle: "Expression · Energy · Craft",
    accent: "#F59E0B",
    accentVar: "var(--creator)",
  },
};

export const DEFAULT_CONFIG: AtomixConfig = {
  activeMode: "work",
  modes: {
    gaming: {
      apps: [
        { id: "g1", name: "Steam", command: "/usr/bin/steam", emoji: "🎮", enabled: true },
        { id: "g2", name: "Heroic", command: "/usr/bin/heroic", emoji: "🦸", enabled: true },
      ],
      wallpaperPath: "~/.atomixos/wallpapers/gaming.png",
      notifications: true,
      autoCloseApps: false,
    },
    work: {
      apps: [
        { id: "w1", name: "Cursor", command: "/usr/bin/cursor", emoji: "💻", enabled: true },
        { id: "w2", name: "Firefox", command: "/usr/bin/firefox", emoji: "🦊", enabled: true },
        { id: "w3", name: "Terminal", command: "distrobox enter AtomixOS", emoji: "📦", enabled: true },
      ],
      wallpaperPath: "~/.atomixos/wallpapers/work.png",
      notifications: true,
      autoCloseApps: false,
    },
    creator: {
      apps: [
        { id: "c1", name: "Kdenlive", command: "/usr/bin/kdenlive", emoji: "🎬", enabled: true },
        { id: "c2", name: "Krita", command: "/usr/bin/krita", emoji: "🎨", enabled: true },
      ],
      wallpaperPath: "~/.atomixos/wallpapers/creator.png",
      notifications: true,
      autoCloseApps: false,
    },
  },
};

export const STORAGE_KEY = "atomixos-config";