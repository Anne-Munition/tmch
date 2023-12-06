import PushoverNotifications from 'pushover-notifications';
import logger from './logger';

let client: PushoverNotifications;

export function init(): void {
  if (!process.env.PUSHOVER_USER || !process.env.PUSHOVER_TOKEN) {
    logger.warn('Missing Pushover credentials. Unable to send push notifications.');
    return;
  }

  client = new PushoverNotifications({
    user: process.env.PUSHOVER_USER,
    token: process.env.PUSHOVER_TOKEN,
  });

  if (process.env.NODE_ENV === 'production') {
    send({ message: 'Sync application started.' });
  }
}

interface PushoverData {
  message: string;
  title?: string;
  priority?: -2 | -1 | 0 | 1 | 2;
  html?: 1;
  sound?: string;
}

// https://pushover.net/api
export function send(data: PushoverData): void {
  if (!client) return;
  client.send({
    sound: 'gamelan',
    ...data,
  });
}
