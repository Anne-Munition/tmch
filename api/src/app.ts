import { database, elastic, logger } from 'utilities';
import server from './server';

async function start() {
  await database.connect();
  elastic.init();
  await elastic.ping();
  server.start();
}

async function stop() {
  const shutdownSequence = [server.stop, database.disconnect];

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
