import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { Language, User, SyncQueueItem } from "../types";
import { TRANSLATIONS } from "../constants";

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  isOnline: boolean;
  simulatedOffline: boolean;
  setSimulatedOffline: (v: boolean) => void;
  effectiveOnline: boolean;
  user: User | null;
  setUser: (u: User | null) => void;
  showAuthModal: boolean;
  setShowAuthModal: (v: boolean) => void;
  offlineQueue: SyncQueueItem[];
  addToQueue: (item: Omit<SyncQueueItem, "id" | "timestamp" | "synced">) => void;
  syncQueue: () => void;
  clearQueue: () => void;
  sampleBallotSelections: Record<string, string>;
  setBallotSelection: (measureId: string, value: string) => void;
  reportedWaitTimes: Record<string, number>;
  reportWaitTime: (stationId: string, minutes: number) => void;
  t: (key: keyof (typeof TRANSLATIONS)["en"]) => string;
}

const AppContext = createContext<AppState | null>(null);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full */
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(
    () => (localStorage.getItem("election-lang") as Language) || "en"
  );
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [simulatedOffline, setSimulatedOffline] = useState(false);
  const [user, setUserState] = useState<User | null>(
    () => loadFromStorage<User | null>("election-user", null)
  );
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState<SyncQueueItem[]>(
    () => loadFromStorage<SyncQueueItem[]>("election-queue", [])
  );
  const [sampleBallotSelections, setBallotSelections] = useState<
    Record<string, string>
  >(() => loadFromStorage<Record<string, string>>("election-ballot", {}));
  const [reportedWaitTimes, setReportedWaitTimes] = useState<
    Record<string, number>
  >(() => loadFromStorage<Record<string, number>>("election-waits", {}));

  const effectiveOnline = isOnline && !simulatedOffline;

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("election-lang", language);
  }, [language]);

  const setLanguage = useCallback((lang: Language) => setLanguageState(lang), []);

  const setUser = useCallback(
    (u: User | null) => {
      setUserState(u);
      saveToStorage("election-user", u);
    },
    []
  );

  const addToQueue = useCallback(
    (item: Omit<SyncQueueItem, "id" | "timestamp" | "synced">) => {
      const newItem: SyncQueueItem = {
        ...item,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        synced: false,
      };
      setOfflineQueue((prev) => {
        const next = [...prev, newItem];
        saveToStorage("election-queue", next);
        return next;
      });
    },
    []
  );

  const syncQueue = useCallback(() => {
    setOfflineQueue((prev) => {
      const next = prev.map((item) => ({ ...item, synced: true }));
      saveToStorage("election-queue", next);
      return next;
    });
  }, []);

  const clearQueue = useCallback(() => {
    setOfflineQueue([]);
    saveToStorage("election-queue", []);
  }, []);

  const setBallotSelection = useCallback(
    (measureId: string, value: string) => {
      setBallotSelections((prev) => {
        const next = { ...prev, [measureId]: value };
        saveToStorage("election-ballot", next);
        return next;
      });
    },
    []
  );

  const reportWaitTime = useCallback(
    (stationId: string, minutes: number) => {
      setReportedWaitTimes((prev) => {
        const next = { ...prev, [stationId]: minutes };
        saveToStorage("election-waits", next);
        return next;
      });
    },
    []
  );

  const t = useCallback(
    (key: keyof (typeof TRANSLATIONS)["en"]) => TRANSLATIONS[language]?.[key] ?? key,
    [language]
  );

  const value = useMemo<AppState>(
    () => ({
      language,
      setLanguage,
      isOnline,
      simulatedOffline,
      setSimulatedOffline,
      effectiveOnline,
      user,
      setUser,
      showAuthModal,
      setShowAuthModal,
      offlineQueue,
      addToQueue,
      syncQueue,
      clearQueue,
      sampleBallotSelections,
      setBallotSelection,
      reportedWaitTimes,
      reportWaitTime,
      t,
    }),
    [
      language,
      setLanguage,
      isOnline,
      simulatedOffline,
      effectiveOnline,
      user,
      setUser,
      showAuthModal,
      offlineQueue,
      addToQueue,
      syncQueue,
      clearQueue,
      sampleBallotSelections,
      setBallotSelection,
      reportedWaitTimes,
      reportWaitTime,
      t,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}