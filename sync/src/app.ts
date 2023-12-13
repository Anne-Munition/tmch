import * as config from './config';
import cron from './cron';
import database from './database';
import * as elastic from './elastic';
import logger from './logger';
import * as pushover from './pushover';
import * as status from './status';

async function start() {
  config.validate();
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
