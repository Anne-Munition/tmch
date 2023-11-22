import channels from '../../channels';
import * as tmi from '../../twitch/tmi';
import uptime from '../uptime';
import version from '../version';

export default function getStatus() {
  return {
    channels,
    connected: { tmi: tmi.isConnected() },
    system_ts: Date.now(),
    uptime: uptime(),
    version: version(),
  };
}
