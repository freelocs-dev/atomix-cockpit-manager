export type InstallMethod = "flatpak" | "system";
export type Position = "maximized" | "left-half" | "right-half" | "top-half" | "float" | "custom";
export type Priority = "low" | "normal" | "high";
export type MonitorChoice = "any" | "1" | "2" | "3";

export type AppConfig = {
  id: string;
  name: string;
  emoji: string;
  installMethod: InstallMethod;
  flatpakId?: string;
  command?: string;
  monitor: MonitorChoice;
  position: Position;
  priority: Priority;
  startDelay: number;
  waitForPrevious: boolean;
};

export type ThemeConfig = {
  id: string;
  name: string;
  globalTheme: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  wallpaperPath: string;
  wallpaperFolder?: string;
  randomizeWallpaper: boolean;
  iconTheme: string;
  cursorTheme: string;
  uiFont: string;
  monoFont: string;
  fontSize: number;
  windowDecoration: string;
  buttonPosition: "left" | "right";
};

export type ScenarioBehavior = {
  showNotification: boolean;
  notificationText: string;
  killAppsOnStart: boolean;
  switchVirtualDesktop: boolean;
  virtualDesktopNumber: number;
  applyThemeFirst: boolean;
  appStartDelay: number;
  saveStateOnStop: boolean;
  showStopNotification: boolean;
};

export type Scenario = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  apps: AppConfig[];
  themeId?: string;
  themeConfig: ThemeConfig;
  behavior: ScenarioBehavior;
  isRunning: boolean;
  createdAt: string;
};

export type AppLibraryEntry = {
  id: string;
  name: string;
  emoji: string;
  installMethod: InstallMethod;
  flatpakId?: string;
  command?: string;
};

export type GlobalState = {
  scenarios: Scenario[];
  appLibrary: AppLibraryEntry[];
  themes: ThemeConfig[];
};

export const STORAGE_KEY = "atomix-cockpit-v2";

export const EMPTY_STATE: GlobalState = {
  scenarios: [],
  appLibrary: [],
  themes: [],
};

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  id: "",
  name: "Untitled Theme",
  globalTheme: "Breeze Dark",
  accentColor: "#3B82F6",
  backgroundColor: "#0D1526",
  textColor: "#F0F4FF",
  wallpaperPath: "",
  randomizeWallpaper: false,
  iconTheme: "Papirus",
  cursorTheme: "Breeze",
  uiFont: "Noto Sans",
  monoFont: "JetBrains Mono",
  fontSize: 10,
  windowDecoration: "Breeze",
  buttonPosition: "right",
};

export const DEFAULT_BEHAVIOR: ScenarioBehavior = {
  showNotification: true,
  notificationText: "Scenario started",
  killAppsOnStart: false,
  switchVirtualDesktop: false,
  virtualDesktopNumber: 1,
  applyThemeFirst: true,
  appStartDelay: 0,
  saveStateOnStop: false,
  showStopNotification: false,
};

export const DEFAULT_APP_CONFIG: Omit<AppConfig, "id" | "name" | "emoji" | "installMethod"> = {
  flatpakId: undefined,
  command: undefined,
  monitor: "any",
  position: "maximized",
  priority: "normal",
  startDelay: 0,
  waitForPrevious: false,
};

export const FLATPAK_CATALOG: { name: string; emoji: string; flatpakId: string }[] = [
  { name: "Steam", emoji: "🎮", flatpakId: "com.valvesoftware.Steam" },
  { name: "Heroic Games Launcher", emoji: "🦸", flatpakId: "com.heroicgameslauncher.hgl" },
  { name: "Lutris", emoji: "🕹️", flatpakId: "net.lutris.Lutris" },
  { name: "Discord", emoji: "💬", flatpakId: "com.discordapp.Discord" },
  { name: "Firefox", emoji: "🦊", flatpakId: "org.mozilla.firefox" },
  { name: "Chromium", emoji: "🌐", flatpakId: "org.chromium.Chromium" },
  { name: "VS Code", emoji: "💻", flatpakId: "com.visualstudio.code" },
  { name: "Cursor", emoji: "🖱️", flatpakId: "com.cursor.Cursor" },
  { name: "OBS Studio", emoji: "🎥", flatpakId: "com.obsproject.Studio" },
  { name: "Kdenlive", emoji: "🎬", flatpakId: "org.kde.kdenlive" },
  { name: "Krita", emoji: "🎨", flatpakId: "org.kde.krita" },
  { name: "GIMP", emoji: "🖼️", flatpakId: "org.gimp.GIMP" },
  { name: "Inkscape", emoji: "✒️", flatpakId: "org.inkscape.Inkscape" },
  { name: "Blender", emoji: "🧊", flatpakId: "org.blender.Blender" },
  { name: "Spotify", emoji: "🎵", flatpakId: "com.spotify.Client" },
  { name: "Audacity", emoji: "🎧", flatpakId: "org.audacityteam.Audacity" },
  { name: "LibreOffice", emoji: "📄", flatpakId: "org.libreoffice.LibreOffice" },
  { name: "Obsidian", emoji: "🗒️", flatpakId: "md.obsidian.Obsidian" },
  { name: "Slack", emoji: "💼", flatpakId: "com.slack.Slack" },
  { name: "Telegram", emoji: "✈️", flatpakId: "org.telegram.desktop" },
];

export const SCENARIO_EMOJI_OPTIONS = ["🎮", "💼", "🎨", "📸", "🎵", "⚡", "🔬", "✍️", "🧠", "🎬", "🚀", "🛠️"];