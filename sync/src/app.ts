import { database, elastic, logger } from 'utilities';
import * as config from './config';
import cron from './cron';
import * as pushover from './pushover';
import servers from './servers';
import * as status from './status';

async function start() {
  config.verify();
  logger.info(`Running checks on ${servers.length} servers`);
  await database.connect();
  elastic.init();
  await elastic.ping();
  pushover.init();
  status.start();
  cron();
}

async function stop() {
  const shutdownSequence = [status.stop, database.disconnect];

  for (let i = 0; i < shutdownSequence.length; i++) {
    try {
      await shutdownSequence[i]();
    } catch (e) {
      logger.error(e);
    }
  }
}

export default {
  start,
  stop,
};
