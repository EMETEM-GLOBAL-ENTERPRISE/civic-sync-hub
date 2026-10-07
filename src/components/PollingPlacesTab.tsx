import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Clock, Flag, Map, Send, CheckCheck } from "lucide-react";
import { useApp } from "../context/AppContext";
import { MOCK_POLLING_STATIONS } from "../constants";
import type { PollingStation } from "../types";

export default function PollingPlacesTab() {
  const { t, effectiveOnline, reportedWaitTimes, reportWaitTime, addToQueue } = useApp();
  const [query, setQuery] = useState("");
  const [reportingId, setReportingId] = useState<string | null>(null);
  const [reportVal, setReportVal] = useState("");

  const filtered = useMemo(
    () =>
      MOCK_POLLING_STATIONS.filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.address.toLowerCase().includes(query.toLowerCase()) ||
          s.precinct.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  const handleReportWait = (station: PollingStation) => {
    const mins = parseInt(reportVal, 10);
    if (isNaN(mins) || mins < 0) return;
    reportWaitTime(station.id, mins);
    if (!effectiveOnline) {
      addToQueue({ type: "report", payload: { stationId: station.id, minutes: mins } });
    }
    setReportingId(null);
    setReportVal("");
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("search")}
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.length === 0 && (
          <div className="col-span-full flex flex-col items-center py-12 text-slate-400">
            <MapPin className="mb-2 h-8 w-8" />
            <p className="text-sm">{t("noResults")}</p>
          </div>
        )}
        {filtered.map((station) => {
          const wait = reportedWaitTimes[station.id] ?? station.waitTime;
          const color =
            wait <= 10
              ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300"
              : wait <= 30
                ? "text-amber-600 bg-amber-50 dark:bg-amber-950 dark:text-amber-300"
                : "text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-300";
          return (
            <motion.div
              key={station.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{station.name}</h3>
                  <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{station.address}</p>
                  <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{station.precinct}</p>
                </div>
                <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${color}`}>
                  <Clock className="h-3 w-3" />
                  {wait} {t("minutes")}
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                {station.accessibility && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                    <Flag className="h-3 w-3" />
                    {t("accessibility")}
                  </span>
                )}
                <a
                  href={`https://maps.google.com/?q=${station.lat},${station.lng}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300"
                >
                  <Map className="h-3 w-3" />
                  {t("directions")}
                </a>
              </div>
              {reportingId === station.id ? (
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="number" min={0} max={120}
                    value={reportVal}
                    onChange={(e) => setReportVal(e.target.value)}
                    placeholder="Minutes"
                    className="w-24 rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-700"
                    autoFocus
                  />
                  <button onClick={() => handleReportWait(station)} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500">
                    <CheckCheck className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => setReportingId(null)} className="text-xs text-slate-400">{t("cancel")}</button>
                </div>
              ) : (
                <button
                  onClick={() => { setReportingId(station.id); setReportVal(String(wait)); }}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-emerald-600 transition-colors hover:text-emerald-500 dark:text-emerald-400"
                >
                  <Send className="h-3 w-3" />
                  {t("reportWait")}
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}