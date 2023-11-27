import * as elastic from './elastic';
import logger from './logger';
import * as queue from './queue';
import * as server from './server';
import * as tmi from './twitch/tmi';

async function start() {
  await elastic.ping();
  await tmi.connect();
  queue.start();
  server.start();
}

async function stop() {
  const shutdownSequence = [server.stop, tmi.disconnect, queue.empty];

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
