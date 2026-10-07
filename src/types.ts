export type Language = "en" | "es" | "fr" | "vi" | "tl";
export type AuthMode = "online" | "offline";

export interface User {
  id: string;
  name: string;
  voterId: string;
  precinct: string;
  authMode: AuthMode;
  isStaff: boolean;
}

export interface PollingStation {
  id: string;
  name: string;
  address: string;
  precinct: string;
  waitTime: number; // minutes
  accessibility: boolean;
  lat: number;
  lng: number;
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
  office: string;
  description: string;
  imageUrl: string;
}

export interface BallotMeasure {
  id: string;
  title: string;
  description: string;
  options: { label: string; value: string }[];
}

export interface ElectionResult {
  candidateId: string;
  candidateName: string;
  party: string;
  voteCount: number;
  percentage: number;
  precinct: string;
}

export interface SyncQueueItem {
  id: string;
  type: "checkin" | "vote" | "report";
  timestamp: number;
  payload: Record<string, unknown>;
  synced: boolean;
}

export interface TranslationKeys {
  appTitle: string;
  appSubtitle: string;
  login: string;
  logout: string;
  online: string;
  offline: string;
  pollingPlaces: string;
  sampleBallot: string;
  liveResults: string;
  workerSync: string;
  search: string;
  reportWait: string;
  minutes: string;
  yourSelection: string;
  voterTurnout: string;
  pendingSync: string;
  syncNow: string;
  language: string;
  voterId: string;
  passcode: string;
  loginTitle: string;
  loginOnline: string;
  loginOffline: string;
  loginStaff: string;
  noResults: string;
  loading: string;
  error: string;
  accessibility: string;
  directions: string;
  candidate: string;
  measure: string;
  vote: string;
  totalVotes: string;
  lastUpdated: string;
  offlineMode: string;
  onlineMode: string;
  toggleOffline: string;
  welcome: string;
  precinct: string;
  authMode: string;
  checkIn: string;
  submitVote: string;
  queued: string;
  synced: string;
  close: string;
  submit: string;
  cancel: string;
}

export type Translations = Record<Language, TranslationKeys>;