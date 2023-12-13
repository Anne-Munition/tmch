import { uptime, version } from 'utilities';
import channels from '../../channels';
import { doWrite } from '../../config';
import * as tmi from '../../twitch/tmi';

export default function getStatus(): Status {
  return {
    module: 'client',
    channels,
    writeable: doWrite,
    connected: { tmi: tmi.isConnected() },
    system_ts: Date.now(),
    uptime: uptime(),
    version: version(),
  };
}
