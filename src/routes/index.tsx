import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CockpitSidebar } from "@/cockpit/components/Sidebar";
import { useCockpitStore } from "@/cockpit/store";
import type { CockpitView } from "@/cockpit/types-ui";
import { ScenariosView } from "@/cockpit/views/ScenariosView";
import { EditScenarioView } from "@/cockpit/views/EditScenarioView";
import { ThemeBuilderView } from "@/cockpit/views/ThemeBuilderView";
import { AppLibraryView } from "@/cockpit/views/AppLibraryView";
import { SettingsView } from "@/cockpit/views/SettingsView";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "AtomixOS Cockpit Manager" },
      {
        name: "description",
        content:
          "Modern scenario automation manager for KDE Plasma — apps, themes, behavior in one cockpit.",
      },
    ],
  }),
});

function Index() {
  const store = useCockpitStore();
  const [view, setView] = useState<CockpitView>("scenarios");
  const [editingId, setEditingId] = useState<string | null>(null);

  const editingScenario = editingId
    ? store.state.scenarios.find((s) => s.id === editingId) ?? null
    : null;

  return (
    <div className="flex min-h-screen w-full" style={{ backgroundColor: "#05080F" }}>
      <CockpitSidebar
        view={view}
        onChange={(v) => {
          setView(v);
          setEditingId(null);
        }}
      />
      <main className="flex-1 min-w-0 px-8 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${view}-${editingId ?? "list"}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {view === "scenarios" && editingScenario ? (
              <EditScenarioView
                scenario={editingScenario}
                store={store}
                onBack={() => setEditingId(null)}
              />
            ) : view === "scenarios" ? (
              <ScenariosView store={store} onEditScenario={(id) => setEditingId(id)} />
            ) : view === "themes" ? (
              <ThemeBuilderView store={store} />
            ) : view === "library" ? (
              <AppLibraryView store={store} />
            ) : (
              <SettingsView store={store} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
