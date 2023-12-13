import channels from './channels';
import * as config from './config';
import database from './database';
import * as elastic from './elastic';
import logger from './logger';
import * as queue from './queue';
import * as server from './server';
import * as tmi from './twitch/tmi';

async function start() {
  config.verify();
  logger.info(`Channels: ${channels.join(' | ')}`);
  if (config.doWrite) {
    logger.info('THIS CLIENT IS IN WRITE MODE');
    await database.connect();
    elastic.init();
    await elastic.ping();
    queue.start();
  }
  await tmi.connect();
  server.start();
}

async function stop() {
  const emptyFunction = async () => {};
  const shutdownSequence = [
    server.stop,
    tmi.disconnect,
    config.doWrite ? queue.empty : emptyFunction,
    config.doWrite ? database.disconnect : emptyFunction,
  ];

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
