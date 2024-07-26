export interface LogEntry {
  name: string;
  calories: number;
  carbs: number;
  fat: number;
  protein: number;
}

export interface EntryGroup {
  name: string;
  entries: LogEntry[]
}
