import { Building2, Database, FileText, ListChecks, RefreshCw, Vote, Clock, Wifi } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function WorkerSyncTab() {
  const { t, effectiveOnline, offlineQueue, addToQueue, syncQueue, clearQueue, user } = useApp();
  const pendingCount = offlineQueue.filter((i) => !i.synced).length;

  const handleCheckIn = () => {
    addToQueue({
      type: "checkin",
      payload: { precinct: user?.precinct ?? "Unknown", timestamp: Date.now() },
    });
  };

  const handleMockVote = () => {
    addToQueue({
      type: "vote",
      payload: { voterId: user?.voterId ?? "Unknown", measure: "Proposition A", choice: "Yes" },
    });
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 p-5 dark:from-amber-950 dark:to-amber-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <span className="font-semibold text-amber-800 dark:text-amber-200">
              {effectiveOnline ? t("onlineMode") : t("offlineMode")}
            </span>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              effectiveOnline
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                : "bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200"
            }`}
          >
            {effectiveOnline ? t("online") : t("offline")}
          </span>
        </div>
        <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
          {pendingCount} {t("pendingSync")} {t("queued")}
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleCheckIn}
          disabled={!user}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition-all hover:bg-emerald-500 disabled:opacity-50 active:scale-[0.98]"
        >
          <Building2 className="h-4 w-4" />
          {t("checkIn")}
        </button>
        <button
          onClick={handleMockVote}
          disabled={!user}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-700 px-4 py-3 text-sm font-medium text-white transition-all hover:bg-slate-600 disabled:opacity-50 active:scale-[0.98]"
        >
          <FileText className="h-4 w-4" />
          {t("submitVote")}
        </button>
      </div>

      {effectiveOnline && pendingCount > 0 && (
        <div className="flex gap-3">
          <button
            onClick={syncQueue}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition-all hover:bg-emerald-500 active:scale-[0.98]"
          >
            <RefreshCw className="h-4 w-4" />
            {t("syncNow")} ({pendingCount})
          </button>
          <button
            onClick={clearQueue}
            className="rounded-xl border border-red-200 px-4 py-3 text-sm text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400"
          >
            {t("cancel")}
          </button>
        </div>
      )}

      <div className="space-y-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
          <ListChecks className="h-4 w-4 text-emerald-600" />
          Sync Queue
        </h3>
        {offlineQueue.length === 0 && (
          <div className="flex flex-col items-center py-8 text-slate-400">
            <Database className="mb-2 h-8 w-8" />
            <p className="text-sm">{t("noResults")}</p>
          </div>
        )}
        {[...offlineQueue].reverse().map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="flex items-center gap-3">
              {item.type === "checkin" ? (
                <Building2 className="h-4 w-4 text-blue-500" />
              ) : item.type === "vote" ? (
                <Vote className="h-4 w-4 text-emerald-500" />
              ) : (
                <Clock className="h-4 w-4 text-amber-500" />
              )}
              <div>
                <p className="text-sm font-medium text-slate-900 capitalize dark:text-white">{item.type}</p>
                <p className="text-[10px] text-slate-400">{new Date(item.timestamp).toLocaleTimeString()}</p>
              </div>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                item.synced
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
              }`}
            >
              {item.synced ? t("synced") : t("queued")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}