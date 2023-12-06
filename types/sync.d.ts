interface Result {
  date: string;
  cycleTime: number;
  logCount: number;
  logLines: number;
  linesPerSecond: number;
  missingCount: number;
  addedCount: number;
}

interface LogLine {
  command: string;
  message: string;
  timestamp: string;
  tmiTs?: string;
  tmiId?: string;
}

declare module 'tmi-parser';
