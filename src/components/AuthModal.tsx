import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Fingerprint, Key, Shield, BadgeCheck, CircleCheck, Loader2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { MOCK_PRECINCTS, TRANSLATIONS } from "../constants";

type AuthTab = "online" | "offline" | "staff";

export default function AuthModal() {
  const { showAuthModal, setShowAuthModal, setUser, language, t } = useApp();
  const [tab, setTab] = useState<AuthTab>("online");
  const [voterId, setVoterId] = useState("");
  const [passcode, setPasscode] = useState("");
  const [name, setName] = useState("");
  const [staffCode, setStaffCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));

    if (tab === "online") {
      if (!voterId.trim() || !name.trim()) {
        setError("Please enter your Voter ID and full name.");
        setLoading(false);
        return;
      }
      setUser({
        id: crypto.randomUUID(),
        name: name.trim(),
        voterId: voterId.trim(),
        precinct: MOCK_PRECINCTS[Math.floor(Math.random() * MOCK_PRECINCTS.length)],
        authMode: "online",
        isStaff: false,
      });
    } else if (tab === "offline") {
      if (!voterId.trim() || !passcode.trim()) {
        setError("Voter ID and passcode are required for offline login.");
        setLoading(false);
        return;
      }
      setUser({
        id: crypto.randomUUID(),
        name: "Offline Voter",
        voterId: voterId.trim(),
        precinct: MOCK_PRECINCTS[Math.floor(Math.random() * MOCK_PRECINCTS.length)],
        authMode: "offline",
        isStaff: false,
      });
    } else {
      if (!staffCode.trim() || !name.trim()) {
        setError("Staff code and name are required.");
        setLoading(false);
        return;
      }
      setUser({
        id: crypto.randomUUID(),
        name: name.trim(),
        voterId: `STAFF-${staffCode.trim()}`,
        precinct: "All Precincts",
        authMode: "offline",
        isStaff: true,
      });
    }

    setLoading(false);
    setShowAuthModal(false);
    setVoterId("");
    setPasscode("");
    setName("");
    setStaffCode("");
  };

  const tabs: { key: AuthTab; icon: typeof Fingerprint; labelKey: keyof typeof TRANSLATIONS["en"] }[] = [
    { key: "online", icon: Fingerprint, labelKey: "loginOnline" },
    { key: "offline", icon: Key, labelKey: "loginOffline" },
    { key: "staff", icon: Shield, labelKey: "loginStaff" },
  ];

  return (
    <AnimatePresence>
      {showAuthModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAuthModal(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            {/* Close button */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute right-4 top-4 z-10 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="bg-gradient-to-br from-emerald-800 to-emerald-900 px-6 pb-8 pt-8 text-white">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <BadgeCheck className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold">{t("loginTitle")}</h2>
              <p className="mt-1 text-sm text-emerald-100/80">{t("appSubtitle")}</p>
            </div>

            {/* Tab selector */}
            <div className="flex border-b border-slate-200 dark:border-slate-700">
              {tabs.map((tb) => {
                const Icon = tb.icon;
                const isActive = tab === tb.key;
                return (
                  <button
                    key={tb.key}
                    onClick={() => {
                      setTab(tb.key);
                      setError("");
                    }}
                    className={`flex flex-1 items-center justify-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-300"
                        : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tb.labelKey === "loginOnline" ? t("loginOnline") : tb.labelKey === "loginOffline" ? t("loginOffline") : t("loginStaff")}</span>
                  </button>
                );
              })}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-300"
                >
                  {error}
                </motion.div>
              )}

              {(tab === "online" || tab === "offline") && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t("voterId")}
                  </label>
                  <input
                    type="text"
                    value={voterId}
                    onChange={(e) => setVoterId(e.target.value)}
                    placeholder="e.g. VID-2024-XXXX"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                  />
                </div>
              )}

              {(tab === "online" || tab === "staff") && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                  />
                </div>
              )}

              {tab === "offline" && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t("passcode")}
                  </label>
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter your 6-digit PIN"
                    maxLength={6}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                  />
                </div>
              )}

              {tab === "staff" && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Staff Emergency Code
                  </label>
                  <input
                    type="text"
                    value={staffCode}
                    onChange={(e) => setStaffCode(e.target.value)}
                    placeholder="Enter staff emergency code"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                  />
                </div>
              )}

              {/* Auth mode info */}
              {tab === "offline" && (
                <div className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                  <CircleCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>
                    Offline mode uses a cached voter token. Your ballot
                    selections will sync when you reconnect to the internet.
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-800 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CircleCheck className="h-4 w-4" />
                )}
                {t("login")}
              </button>

              <p className="text-center text-xs text-slate-400 dark:text-slate-500">
                This is a demo portal. No real authentication is performed.
              </p>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}