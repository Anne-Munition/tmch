import logger from './logger';
import * as server from './server';
import * as tmi from './twitch/tmi';

async function start() {
  if (!process.env.CHANNELS) throw new Error('Missing CHANNELS environment variable.');

  await tmi.connect();
  server.start();
}

async function stop() {
  const shutdownSequence = [server.stop, tmi.disconnect];

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
