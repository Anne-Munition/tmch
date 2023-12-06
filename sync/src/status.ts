import axios from 'axios';
import lodash from 'lodash';
import * as pushover from './pushover';
import servers from './servers';

let timer: NodeJS.Timeout;
let lastState: Status[];

export function start() {
  if (timer) clearInterval(timer);
  checkStatus();
  timer = setInterval(checkStatus, 1000 * 60 * 5);
}

export async function stop() {
  if (timer) clearInterval(timer);
}

export async function getStatuses(): Promise<Status[]> {
  const requests = servers.map((server) => {
    return axios
      .get(`${server}/status`)
      .then(({ data }) => {
        return { ...data, server, online: true };
      })
      .catch(() => {
        return { server, online: false };
      });
  });
  return Promise.all(requests);
}

async function checkStatus() {
  const statuses = await getStatuses();
  if (!lastState) lastState = statuses;

  let message = '';

  const cameOnline = lodash.differenceBy(lastState, statuses, 'online');
  const wentOffline = lodash.differenceBy(statuses, lastState, 'online');

  if (cameOnline.length) {
    if (message) message += '\n';
    message += '<b><font color="#00ff00">Came Online:</></b>\n';
    message += cameOnline.map((x) => `\t${x.server}`).join('\n');
  }
  if (wentOffline.length) {
    if (message) message += '\n';
    message += '<b><font color="#ff0000">Went Offline:</></b>\n';
    message += wentOffline.map((x) => `\t${x.server}`).join('\n');
  }

  const diffState: string[] = [];
  lodash.differenceBy(statuses, cameOnline, wentOffline, 'server').forEach((result) => {
    if (!result.connected) return;
    const last = lastState.find((x) => x.server === result.server);
    if (!last) return;
    if (lodash.isEqual(result.connected, last.connected)) return;
    const state = JSON.stringify(result.connected).replace(/"/g, '');
    diffState.push(`\t${result.server}\n\t\t${state}`);
  });

  if (diffState.length) {
    if (message) message += '\n';
    message += '<b><font color="#ffff00">State Change:</font></b>\n';
    message += diffState.join('\n');
  }

  lastState = statuses;

  if (!message) return;
  pushover.send({
    title: 'TMCH Logger - Server Status Change',
    message: message,
    priority: 1,
    html: 1,
  });
}
