import ViewerService from '../database/lib/viewers';
import logger from '../logger';
import { bulkIndexTmi } from './index';

const queue: { channel: string; message: ElasticTmi }[] = [];
let processing = false;
const length = 100;
const minutes = 5;

let timer: NodeJS.Timeout;

export function start() {
  timer = setTimeout(process, 1000 * 60 * minutes);
}

export function add(channel: string, message: ElasticTmi) {
  queue.push({ channel, message });
  if (queue.length >= length) process();
}

// Do NOT return early out of this function
function process() {
  if (processing) return;
  processing = true;
  if (timer) clearTimeout(timer);
  const messages = queue.splice(0, length);
  if (messages.length) {
    try {
      bulkIndexTmi(messages);
    } catch (e) {
      // Do Nothing
    }
    try {
      ViewerService.store(messages);
    } catch (e) {
      // Do Nothing
    }
  }
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
