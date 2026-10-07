import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Vote, BarChart3, Database, CircleCheck, Signal, Smartphone } from "lucide-react";
import { useApp } from "../context/AppContext";
import { TRANSLATIONS } from "../constants";
import PollingPlacesTab from "./PollingPlacesTab";
import SampleBallotTab from "./SampleBallotTab";
import LiveResultsTab from "./LiveResultsTab";
import WorkerSyncTab from "./WorkerSyncTab";

type DashboardTab = "polling" | "ballot" | "results" | "worker";

const TAB_ICONS: Record<DashboardTab, typeof MapPin> = {
  polling: MapPin,
  ballot: Vote,
  results: BarChart3,
  worker: Database,
};

const TAB_KEYS: { key: DashboardTab; labelKey: string }[] = [
  { key: "polling", labelKey: "pollingPlaces" },
  { key: "ballot", labelKey: "sampleBallot" },
  { key: "results", labelKey: "liveResults" },
  { key: "worker", labelKey: "workerSync" },
];

const TAB_COMPONENTS: Record<DashboardTab, React.ReactNode> = {
  polling: <PollingPlacesTab />,
  ballot: <SampleBallotTab />,
  results: <LiveResultsTab />,
  worker: <WorkerSyncTab />,
};

export default function ElectionDashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("polling");
  const { t, user } = useApp();

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
      {user && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-900 px-5 py-4 text-white shadow-lg"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <CircleCheck className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{t("welcome")}, {user.name}</p>
            <p className="text-xs text-emerald-200/80">
              {t("precinct")}: {user.precinct} &middot; {t("authMode")}: {user.authMode}
            </p>
          </div>
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
              user.authMode === "online"
                ? "bg-emerald-500/30 text-emerald-100"
                : "bg-amber-500/30 text-amber-100"
            }`}
          >
            {user.authMode === "online" ? (
              <Signal className="mr-1 inline h-3 w-3" />
            ) : (
              <Smartphone className="mr-1 inline h-3 w-3" />
            )}
            {user.authMode}
          </span>
        </motion.div>
      )}

      <div className="mb-6 flex overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        {TAB_KEYS.map((tab) => {
          const Icon = TAB_ICONS[tab.key];
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "text-emerald-700 dark:text-emerald-300"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="tab-bg"
                  className="absolute inset-0 rounded-lg bg-emerald-50 dark:bg-emerald-950"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{t(tab.labelKey as keyof typeof TRANSLATIONS["en"])}</span>
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
        >
          {TAB_COMPONENTS[activeTab]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}