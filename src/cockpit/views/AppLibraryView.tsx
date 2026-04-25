import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { Button, Pill } from "../components/primitives";
import { AppSearch } from "../components/AppSearch";
import type { useCockpitStore } from "../store";

type Store = ReturnType<typeof useCockpitStore>;

export function AppLibraryView({ store }: { store: Store }) {
  const [adding, setAdding] = useState(false);
  const apps = store.state.appLibrary;

  return (
    <>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">App Library</h1>
          <p className="text-sm text-[#64748B] mt-1">Global registry of apps available to scenarios</p>
        </div>
        <Button onClick={() => setAdding((a) => !a)}>
          <Plus className="w-4 h-4" />
          Add App
        </Button>
      </div>

      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-6"
          >
            <AppSearch
              onAdd={(entry) => {
                store.addLibraryApp(entry);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {apps.length === 0 ? (
        <div
          className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center py-24 text-center"
          style={{ borderColor: "rgba(59,130,246,0.3)" }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
            style={{ backgroundColor: "rgba(59,130,246,0.1)" }}
          >
            <Plus className="w-7 h-7 text-[#3B82F6]" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Build your library</h2>
          <p className="text-sm text-[#64748B]">Add apps once and reuse them across scenarios.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence initial={false}>
            {apps.map((app) => (
              <motion.div
                key={app.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                whileHover={{ scale: 1.01 }}
                className="rounded-xl border p-5 transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.08)]"
                style={{ backgroundColor: "#0D1526", borderColor: "rgba(99,179,237,0.08)" }}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{app.emoji}</span>
                  <Pill color="gray">Will install</Pill>
                </div>
                <div className="font-semibold text-white mb-1 truncate">{app.name}</div>
                <div className="text-xs text-[#64748B] font-mono mb-3 truncate">
                  {app.flatpakId || app.command}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Pill color={app.installMethod === "flatpak" ? "blue" : "gray"}>
                    {app.installMethod === "flatpak" ? "Flatpak" : "System"}
                  </Pill>
                  <button
                    type="button"
                    onClick={() => store.removeLibraryApp(app.id)}
                    className="p-1.5 rounded text-[#64748B] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}