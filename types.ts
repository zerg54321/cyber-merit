
export type EntryType = 'plus' | 'minus';

export interface LedgerEntry {
  id: string;
  type: EntryType;
  content: string;
  timestamp: number;
}

export interface ArchivedLedger {
  id: string;
  title: string; // The user-defined name for this ledger
  targetMerit: number;
  entries: LedgerEntry[];
  startedAt: number; // The timestamp of the first entry or creation
  completedAt: number; // The timestamp when it was archived
}

export interface AppState {
  entries: LedgerEntry[];
  targetMerit: number;
  isInitialized: boolean;
  isFinished: boolean; // Tracks if current goal is met
  archive: ArchivedLedger[]; // Stores completed books
}
