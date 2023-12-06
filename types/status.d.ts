interface Status {
  module: 'client';
  channels: string[];
  writeable: boolean;
  connected: {
    tmi: boolean;
  };
  system_ts: number;
  uptime: string;
  version: string;
  server?: string;
  online?: boolean;
}
