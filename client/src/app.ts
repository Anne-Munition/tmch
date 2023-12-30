import { database, elastic, logger } from 'utilities';
import { twitchChannels as channels } from './channels';
import * as config from './config';
import * as queue from './queue';
import server from './server';
import * as tmi from './tmi';
import * as yt from './yt';

async function start() {
  config.verify();
  logger.info(`Channels: ${channels.join(' | ')}`);
  if (config.doWrite) {
    logger.info('THIS CLIENT IS IN WRITE MODE');
    // await database.connect();
    // elastic.init();
    // await elastic.ping();
    // queue.start();
  }
  // await tmi.connect();
  // server.start();
  yt.start();
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
