import { useEffect, useState, useCallback } from "react";
import {
  EMPTY_STATE,
  STORAGE_KEY,
  DEFAULT_THEME_CONFIG,
  DEFAULT_BEHAVIOR,
  type GlobalState,
  type Scenario,
  type AppConfig,
  type ThemeConfig,
  type AppLibraryEntry,
  type ScenarioBehavior,
} from "./types";

function load(): GlobalState {
  if (typeof window === "undefined") return EMPTY_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw) as GlobalState;
    return {
      scenarios: Array.isArray(parsed.scenarios) ? parsed.scenarios : [],
      appLibrary: Array.isArray(parsed.appLibrary) ? parsed.appLibrary : [],
      themes: Array.isArray(parsed.themes) ? parsed.themes : [],
    };
  } catch {
    return EMPTY_STATE;
  }
}

function uid() {
  return crypto.randomUUID();
}

export function useCockpitStore() {
  const [state, setState] = useState<GlobalState>(EMPTY_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state, hydrated]);

  const createScenario = useCallback(
    (input: { name: string; description: string; emoji: string }) => {
      const id = uid();
      const scenario: Scenario = {
        id,
        name: input.name || "Untitled Scenario",
        description: input.description,
        emoji: input.emoji || "⚡",
        apps: [],
        themeConfig: { ...DEFAULT_THEME_CONFIG, id: uid(), name: `${input.name || "Scenario"} Theme` },
        behavior: { ...DEFAULT_BEHAVIOR, notificationText: `${input.name || "Scenario"} started` },
        isRunning: false,
        createdAt: new Date().toISOString(),
      };
      setState((s) => ({ ...s, scenarios: [scenario, ...s.scenarios] }));
      return id;
    },
    [],
  );

  const updateScenario = useCallback((id: string, patch: Partial<Scenario>) => {
    setState((s) => ({
      ...s,
      scenarios: s.scenarios.map((sc) => (sc.id === id ? { ...sc, ...patch } : sc)),
    }));
  }, []);

  const deleteScenario = useCallback((id: string) => {
    setState((s) => ({ ...s, scenarios: s.scenarios.filter((sc) => sc.id !== id) }));
  }, []);

  const toggleScenarioRunning = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      scenarios: s.scenarios.map((sc) => (sc.id === id ? { ...sc, isRunning: !sc.isRunning } : sc)),
    }));
  }, []);

  const addAppToScenario = useCallback((scenarioId: string, app: Omit<AppConfig, "id">) => {
    setState((s) => ({
      ...s,
      scenarios: s.scenarios.map((sc) =>
        sc.id === scenarioId ? { ...sc, apps: [...sc.apps, { ...app, id: uid() }] } : sc,
      ),
    }));
  }, []);

  const updateScenarioApp = useCallback(
    (scenarioId: string, appId: string, patch: Partial<AppConfig>) => {
      setState((s) => ({
        ...s,
        scenarios: s.scenarios.map((sc) =>
          sc.id === scenarioId
            ? { ...sc, apps: sc.apps.map((a) => (a.id === appId ? { ...a, ...patch } : a)) }
            : sc,
        ),
      }));
    },
    [],
  );

  const removeScenarioApp = useCallback((scenarioId: string, appId: string) => {
    setState((s) => ({
      ...s,
      scenarios: s.scenarios.map((sc) =>
        sc.id === scenarioId ? { ...sc, apps: sc.apps.filter((a) => a.id !== appId) } : sc,
      ),
    }));
  }, []);

  const reorderScenarioApps = useCallback((scenarioId: string, fromIndex: number, toIndex: number) => {
    setState((s) => ({
      ...s,
      scenarios: s.scenarios.map((sc) => {
        if (sc.id !== scenarioId) return sc;
        const apps = [...sc.apps];
        const [moved] = apps.splice(fromIndex, 1);
        apps.splice(toIndex, 0, moved);
        return { ...sc, apps };
      }),
    }));
  }, []);

  const updateScenarioTheme = useCallback((scenarioId: string, patch: Partial<ThemeConfig>) => {
    setState((s) => ({
      ...s,
      scenarios: s.scenarios.map((sc) =>
        sc.id === scenarioId ? { ...sc, themeConfig: { ...sc.themeConfig, ...patch } } : sc,
      ),
    }));
  }, []);

  const updateScenarioBehavior = useCallback(
    (scenarioId: string, patch: Partial<ScenarioBehavior>) => {
      setState((s) => ({
        ...s,
        scenarios: s.scenarios.map((sc) =>
          sc.id === scenarioId ? { ...sc, behavior: { ...sc.behavior, ...patch } } : sc,
        ),
      }));
    },
    [],
  );

  // App Library
  const addLibraryApp = useCallback((entry: Omit<AppLibraryEntry, "id">) => {
    setState((s) => ({ ...s, appLibrary: [{ ...entry, id: uid() }, ...s.appLibrary] }));
  }, []);

  const updateLibraryApp = useCallback((id: string, patch: Partial<AppLibraryEntry>) => {
    setState((s) => ({
      ...s,
      appLibrary: s.appLibrary.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    }));
  }, []);

  const removeLibraryApp = useCallback((id: string) => {
    setState((s) => ({ ...s, appLibrary: s.appLibrary.filter((a) => a.id !== id) }));
  }, []);

  // Themes
  const createTheme = useCallback((name: string) => {
    const id = uid();
    const theme: ThemeConfig = { ...DEFAULT_THEME_CONFIG, id, name: name || "Untitled Theme" };
    setState((s) => ({ ...s, themes: [theme, ...s.themes] }));
    return id;
  }, []);

  const updateTheme = useCallback((id: string, patch: Partial<ThemeConfig>) => {
    setState((s) => ({
      ...s,
      themes: s.themes.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
  }, []);

  const deleteTheme = useCallback((id: string) => {
    setState((s) => ({ ...s, themes: s.themes.filter((t) => t.id !== id) }));
  }, []);

  const assignThemeToScenario = useCallback((themeId: string, scenarioId: string) => {
    setState((s) => {
      const theme = s.themes.find((t) => t.id === themeId);
      if (!theme) return s;
      return {
        ...s,
        scenarios: s.scenarios.map((sc) =>
          sc.id === scenarioId
            ? { ...sc, themeId, themeConfig: { ...theme, id: sc.themeConfig.id } }
            : sc,
        ),
      };
    });
  }, []);

  return {
    state,
    hydrated,
    createScenario,
    updateScenario,
    deleteScenario,
    toggleScenarioRunning,
    addAppToScenario,
    updateScenarioApp,
    removeScenarioApp,
    reorderScenarioApps,
    updateScenarioTheme,
    updateScenarioBehavior,
    addLibraryApp,
    updateLibraryApp,
    removeLibraryApp,
    createTheme,
    updateTheme,
    deleteTheme,
    assignThemeToScenario,
  };
}