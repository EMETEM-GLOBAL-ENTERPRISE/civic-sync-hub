import { useApp } from "../context/AppContext";
import { MOCK_CANDIDATES, MOCK_BALLOT_MEASURES } from "../constants";
import { BookOpen, CircleCheck, Users, ListChecks, CheckCheck } from "lucide-react";

export default function SampleBallotTab() {
  const { t, sampleBallotSelections, setBallotSelection, effectiveOnline, addToQueue } = useApp();

  const handleSelect = (measureId: string, value: string) => {
    setBallotSelection(measureId, value);
    if (!effectiveOnline) {
      addToQueue({ type: "vote", payload: { measureId, value } });
    }
  };

  const selectionsCount = Object.keys(sampleBallotSelections).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-900 px-5 py-4 text-white">
        <div className="flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-emerald-200" />
          <div>
            <p className="text-sm font-medium">{t("yourSelection")}</p>
            <p className="text-2xl font-bold">{selectionsCount} / {MOCK_BALLOT_MEASURES.length}</p>
          </div>
        </div>
        {selectionsCount > 0 && (
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm">
            <CircleCheck className="mr-1 inline h-3 w-3" />
            {t("synced")}
          </span>
        )}
      </div>

      <div>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
          <Users className="h-4 w-4 text-emerald-600" />
          {t("candidate")}s
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {MOCK_CANDIDATES.slice(0, 3).map((c) => (
            <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                  {c.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{c.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{c.party} &middot; {c.office}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
          <ListChecks className="h-4 w-4 text-emerald-600" />
          {t("measure")}s
        </h3>
        <div className="space-y-3">
          {MOCK_BALLOT_MEASURES.map((m) => (
            <div key={m.id} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <h4 className="font-semibold text-slate-900 dark:text-white">{m.title}</h4>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{m.description}</p>
              <div className="mt-3 flex gap-2">
                {m.options.map((opt) => {
                  const selected = sampleBallotSelections[m.id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(m.id, opt.value)}
                      className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                        selected
                          ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-950 dark:text-emerald-300"
                          : "border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {selected && <CheckCheck className="mr-1.5 inline h-4 w-4" />}
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}