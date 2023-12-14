import { ViewerService, elastic, logger } from 'utilities';

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
async function process() {
  if (processing) return;
  logger.debug('processing tmi queue');
  processing = true;
  if (timer) clearTimeout(timer);
  const messages = queue.splice(0, length);
  if (messages.length) {
    await elastic.bulkIndexTmi(messages).catch((e) => {
      logger.error(e);
    });
    await ViewerService.store(messages.map((x) => x.message)).catch((e) => {
      logger.error(e);
    });
  }
  processing = false;
  logger.debug('done processing tmi queue');
  start();
}

export async function empty(): Promise<void> {
  logger.info('Emptying the queue...');
  while (queue.length) {
    await process();
  }
  logger.info('Queue emptied');
}
