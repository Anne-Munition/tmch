interface Status {
  module: 'client';
  channels: string[];
  writeable: boolean;
  connected: ConnectedStatus;
  system_ts: number;
  uptime: string;
  version: string;
  server?: string;
  online?: boolean;
}

interface ConnectedStatus {
  tmi?: boolean;
  database?: boolean;
}
