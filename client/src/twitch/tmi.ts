import { ChatUserstate, Client } from 'tmi.js';
import utilities from 'utilities';
import channels from '../channels';
import { doWrite } from '../config';
import logger from '../logger';
import chatLoggers from '../logger/chat_logger';
import * as queue from '../queue';

const client = new Client({
  connection: {
    reconnect: true,
    secure: true,
  },
  channels: [...channels],
});

const ignoredCommands = [
  'CAP',
  'PING',
  'PONG',
  'RECONNECT',
  'SERVERCHANGE',
  'MODE',
  'JOIN',
  'PART',
];
let skip = false;

client.on('raw_message', async (msg: ChatUserstate) => {
  // Don't process messages for the first 10 seconds after connection (CAP)
  // as these contain reoccurring HOSTTARGET | NOTICE | ROOMSTATE | USERSTATE messages
  // when first joining a channel
  if (msg.command === 'CAP') {
    skip = true;
    setTimeout(() => {
      skip = false;
    }, 10000);
  }
  if (skip) return;
  if (ignoredCommands.includes(msg.command)) return;
  if (/^\d+$/.test(msg.command)) return;

  const channel = msg.params[0];
  if (!channel) return;

  if (chatLoggers[channel]) chatLoggers[channel].info(msg.raw, { command: msg.command });

  if (doWrite) {
    const message = utilities.parser(msg);
    queue.add(channel, message);
  }
});

export async function connect(): Promise<void> {
  return client.connect().then(() => {
    logger.info('Connected to TMI');
  });
}

export function isConnected(): boolean {
  return client.readyState() === 'OPEN';
}

export async function disconnect(): Promise<void> {
  return client.disconnect().then(() => {
    logger.info('Disconnected from TMI');
  });
}
