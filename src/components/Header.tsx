import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Wifi,
  WifiOff,
  User,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  Vote,
  Smartphone,
  Signal,
  Menu,
  X,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import type { Language } from "../types";

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "tl", label: "Tagalog", flag: "🇵🇭" },
];

export default function Header() {
  const {
    language,
    setLanguage,
    effectiveOnline,
    simulatedOffline,
    setSimulatedOffline,
    user,
    setUser,
    setShowAuthModal,
    t,
  } = useApp();
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
  };

  const currentLang = LANGUAGES.find((l) => l.code === language);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-800/10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-800 text-white">
            <Vote className="h-5 w-5" />
          </div>
          <span className="hidden text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:block">
            {t("appTitle")}
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-3 md:flex">
          {/* Network toggle */}
          <button
            onClick={() => setSimulatedOffline(!simulatedOffline)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              effectiveOnline
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
            }`}
            title={t("toggleOffline")}
          >
            {effectiveOnline ? (
              <Wifi className="h-3.5 w-3.5" />
            ) : (
              <WifiOff className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">
              {effectiveOnline ? t("onlineMode") : t("offlineMode")}
            </span>
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Language switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden lg:inline">{currentLang?.flag} {currentLang?.label}</span>
              <span className="lg:hidden">{currentLang?.flag}</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute right-0 top-full mt-1 w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-900"
                >
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setLangOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        language === l.code
                          ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span className="text-base">{l.flag}</span>
                      <span>{l.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 dark:bg-emerald-950">
                <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                  {user.name}
                </span>
                <span className="rounded bg-emerald-200 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-800 dark:text-emerald-200">
                  {user.authMode === "online" ? (
                    <Signal className="inline h-3 w-3" />
                  ) : (
                    <Smartphone className="inline h-3 w-3" />
                  )}
                </span>
              </div>
              <button
                onClick={() => {
                  setUser(null);
                  setSimulatedOffline(false);
                }}
                className="rounded-full p-2 text-slate-400 transition-colors hover:text-red-500"
                title={t("logout")}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-emerald-700 active:scale-[0.98]"
            >
              <User className="h-4 w-4" />
              {t("login")}
            </button>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-200 bg-white px-4 pb-4 dark:border-slate-700 dark:bg-slate-950 md:hidden"
          >
            <div className="flex flex-col gap-2 pt-3">
              {/* Network toggle */}
              <button
                onClick={() => {
                  setSimulatedOffline(!simulatedOffline);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                  effectiveOnline
                    ? "text-emerald-700 dark:text-emerald-300"
                    : "text-amber-700 dark:text-amber-300"
                }`}
              >
                {effectiveOnline ? (
                  <Wifi className="h-4 w-4" />
                ) : (
                  <WifiOff className="h-4 w-4" />
                )}
                {effectiveOnline ? t("onlineMode") : t("offlineMode")}
              </button>

              {/* Language */}
              <div className="flex flex-wrap gap-1">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setMobileMenuOpen(false);
                    }}
                    className={`rounded-lg px-3 py-1.5 text-sm ${
                      language === l.code
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                        : "text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {l.flag} {l.label}
                  </button>
                ))}
              </div>

              {/* Dark mode */}
              <button
                onClick={toggleDark}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 dark:text-slate-300"
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>

              {/* Auth */}
              {user ? (
                <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 dark:bg-emerald-950">
                  <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                    {user.name}
                  </span>
                  <button
                    onClick={() => {
                      setUser(null);
                      setMobileMenuOpen(false);
                    }}
                    className="text-sm text-red-500"
                  >
                    {t("logout")}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-lg bg-emerald-800 px-3 py-2 text-sm font-medium text-white"
                >
                  <User className="h-4 w-4" />
                  {t("login")}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}