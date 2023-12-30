import { database, uptime, version } from 'utilities';
import { twitchChannels as channels } from '../../channels';
import { doWrite } from '../../config';
import * as tmi from '../../tmi';

export default function getStatus(): Status {
  const connected: ConnectedStatus = { tmi: tmi.isConnected() };
  if (doWrite) connected.database = database.isConnected();
  return {
    module: 'client',
    channels,
    writeable: doWrite,
    connected,
    system_ts: Date.now(),
    uptime: uptime(),
    version: version(),
  };
}
