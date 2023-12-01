import logger from '../logger';
import { bulkIndexTmi } from './index';

const queue: { channel: string; message: TmiMessage }[] = [];
let processing = false;
const length = 100;
const minutes = 5;

let timer: NodeJS.Timeout;

export function start() {
  timer = setTimeout(process, 1000 * 60 * minutes);
}

export function add(channel: string, message: TmiMessage) {
  queue.push({ channel, message });
  if (queue.length >= length) process();
}

// Do NOT return early out of this function
function process() {
  if (processing) return;
  processing = true;
  if (timer) clearTimeout(timer);
  const messages = queue.splice(0, length);
  if (messages.length) bulkIndexTmi(messages);
  processing = false;
  start();
}

export async function empty(): Promise<void> {
  logger.info('Emptying the queue...');
  while (queue.length) {
    process();
  }
  logger.info('Queue emptied');
}
