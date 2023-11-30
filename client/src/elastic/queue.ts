import logger from '../logger';
import { bulkIndexTmi } from './index';

const queue: TmiMessage[] = [];
let processing = false;
const length = 100;
const minutes = 5;

let timer: NodeJS.Timeout;

export function start() {
  timer = setTimeout(process, 1000 * 60 * minutes);
}

export function add(message: TmiMessage) {
  queue.push(message);
  if (queue.length >= length) process();
}

// Do NOT return early out of this function
async function process() {
  if (processing) return;
  processing = true;
  if (timer) clearTimeout(timer);
  try {
    const messages = queue.splice(0, length);
    if (messages.length) await bulkIndexTmi(messages);
  } catch (e) {
    logger.error('Bulk Index Tmi Error');
    logger.error(e);
  }
  processing = false;
  start();
}

export async function empty(): Promise<void> {
  logger.info('Emptying the queue...');
  while (queue.length) {
    await process();
  }
  logger.info('Queue emptied.');
}
