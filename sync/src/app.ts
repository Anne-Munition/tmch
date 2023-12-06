import * as config from './config';
import cron from './cron';
import * as elastic from './elastic';
import logger from './logger';
import * as pushover from './pushover';
import version from './server/version';
import * as status from './status';

logger.info(`Starting Client Application v${version()}...`);

async function start() {
  config.validate();
  elastic.init();
  await elastic.ping();
  pushover.init();
  status.start();
  cron();
}

async function stop() {
  const shutdownSequence = [status.stop];

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
