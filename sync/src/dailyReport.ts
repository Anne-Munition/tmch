import * as pushover from './pushover';
import { getStatuses } from './status';

export default async function (): Promise<void> {
  const status = await getStatuses();
  const message = status
    .map((x) => {
      if (x.online) return `<b>${x.server}</b> - ${x.version}\n\t${x.uptime}`;
      else return `<b>${x.server} - <font color="#ff0000">OFFLINE</font></b>`;
    })
    .join('\n');
  pushover.send({ title: 'TMCH Logger - Daily Status Report', message, html: 1 });
}
