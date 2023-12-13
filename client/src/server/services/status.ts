import { uptime, version } from 'utilities';
import channels from '../../channels';
import { doWrite } from '../../config';
import * as database from '../../database';
import * as tmi from '../../twitch/tmi';

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
