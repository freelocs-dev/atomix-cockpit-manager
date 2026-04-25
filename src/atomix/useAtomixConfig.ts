import { useEffect, useState, useCallback } from "react";
import { DEFAULT_CONFIG, STORAGE_KEY, type AtomixConfig, type ModeKey, type ModeConfig, type AppEntry } from "./types";

function load(): AtomixConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONFIG;
    const parsed = JSON.parse(raw) as AtomixConfig;
    return { ...DEFAULT_CONFIG, ...parsed, modes: { ...DEFAULT_CONFIG.modes, ...parsed.modes } };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function useAtomixConfig() {
  const [config, setConfig] = useState<AtomixConfig>(DEFAULT_CONFIG);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setConfig(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {}
  }, [config, hydrated]);

  const setActiveMode = useCallback((mode: ModeKey) => {
    setConfig((c) => ({ ...c, activeMode: mode }));
  }, []);

  const updateMode = useCallback((mode: ModeKey, patch: Partial<ModeConfig>) => {
    setConfig((c) => ({ ...c, modes: { ...c.modes, [mode]: { ...c.modes[mode], ...patch } } }));
  }, []);

  const addApp = useCallback((mode: ModeKey, app: Omit<AppEntry, "id">) => {
    setConfig((c) => ({
      ...c,
      modes: {
        ...c.modes,
        [mode]: {
          ...c.modes[mode],
          apps: [...c.modes[mode].apps, { ...app, id: crypto.randomUUID() }],
        },
      },
    }));
  }, []);

  const removeApp = useCallback((mode: ModeKey, id: string) => {
    setConfig((c) => ({
      ...c,
      modes: {
        ...c.modes,
        [mode]: { ...c.modes[mode], apps: c.modes[mode].apps.filter((a) => a.id !== id) },
      },
    }));
  }, []);

  const toggleApp = useCallback((mode: ModeKey, id: string) => {
    setConfig((c) => ({
      ...c,
      modes: {
        ...c.modes,
        [mode]: {
          ...c.modes[mode],
          apps: c.modes[mode].apps.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)),
        },
      },
    }));
  }, []);

  return { config, setActiveMode, updateMode, addApp, removeApp, toggleApp };
}