import { motion } from "framer-motion";
import { Activity, BarChart3, Layers, Clock } from "lucide-react";
import { useApp } from "../context/AppContext";
import { MOCK_RESULTS, MOCK_VOTER_TURNOUT } from "../constants";

export default function LiveResultsTab() {
  const { t, effectiveOnline } = useApp();
  const maxVotes = Math.max(...MOCK_RESULTS.map((r) => r.voteCount));

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-400" />
            <span className="text-sm font-medium">{t("voterTurnout")}</span>
          </div>
          {!effectiveOnline && (
            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-300">
              {t("offline")}
            </span>
          )}
        </div>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-4xl font-bold tracking-tight">{MOCK_VOTER_TURNOUT.percentage}%</span>
          <span className="text-sm text-slate-400">{t("totalVotes")}</span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-700">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${MOCK_VOTER_TURNOUT.percentage}%` }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
          />
        </div>
        <p className="mt-2 text-xs text-slate-400">
          {MOCK_VOTER_TURNOUT.total.toLocaleString()} / {MOCK_VOTER_TURNOUT.eligible.toLocaleString()} {t("totalVotes")}
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
          <BarChart3 className="h-4 w-4 text-emerald-600" />
          Mayoral Race
        </h3>
        {MOCK_RESULTS.filter((r) => r.precinct === "All Precincts").map((r) => (
          <div key={r.candidateId} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                  {r.candidateName.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{r.candidateName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{r.party}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-slate-900 dark:text-white">{r.percentage}%</p>
                <p className="text-xs text-slate-400">{r.voteCount.toLocaleString()} {t("vote")}s</p>
              </div>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(r.voteCount / maxVotes) * 100}%` }}
                transition={{ duration: 1.2, delay: 0.2, ease: "easeInOut" }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
              />
            </div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
          <Layers className="h-4 w-4 text-emerald-600" />
          District 3 Race
        </h3>
        {MOCK_RESULTS.filter((r) => r.precinct === "District 3").map((r) => (
          <div key={r.candidateId} className="mb-2 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <p className="font-medium text-slate-900 dark:text-white">{r.candidateName}</p>
              <p className="font-bold text-slate-900 dark:text-white">{r.percentage}%</p>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${r.percentage}%` }}
                transition={{ duration: 1, delay: 0.3, ease: "easeInOut" }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
              />
            </div>
          </div>
        ))}
      </div>

      <p className="flex items-center gap-1 text-center text-xs text-slate-400">
        <Clock className="h-3 w-3" />
        {t("lastUpdated")}: {new Date().toLocaleTimeString()}
        {!effectiveOnline && (
          <span className="ml-2 rounded bg-amber-50 px-2 py-0.5 text-amber-600 dark:bg-amber-950 dark:text-amber-300">
            Cached data
          </span>
        )}
      </p>
    </div>
  );
}