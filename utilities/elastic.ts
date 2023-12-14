import { Client } from '@elastic/elasticsearch';
import { ChatUserstate } from 'tmi.js';
import logger from './logger';

let client: Client;

export function getUrl(): string {
  if (!process.env.ES_URL) throw new Error('Missing ES_URL');
  return process.env.ES_URL;
}

export function init() {
  client = new Client({
    node: getUrl(),
    /*auth: {
      username: process.env.ES_USERNAME as string,
      password: process.env.ES_PASSWORD as string,
    },*/
  });
}

export async function ping(): Promise<void> {
  const { hostname, pathname } = new URL(getUrl());
  const response = await client.ping();
  if (!response)
    throw new Error(`Unable to connect to ElasticSearch server: '${hostname}${pathname}'`);
  logger.info(`Connected to ElasticSearch: '${hostname}'`);
}

export function tmiMessage(msg: ChatUserstate): ElasticTmi {
  for (const tag in msg.tags) {
    if (msg.tags[tag] === true) msg.tags[tag] = null;
  }

  const timestamp = msg.tags['tmi-sent-ts']
    ? new Date(parseInt(msg.tags['tmi-sent-ts']))
    : new Date();

  let name = msg.tags['display-name'];
  // Edge case where display-name ends in a space
  if (name) name = name.trim();

  return {
    '@timestamp': timestamp.toISOString(),
    id: msg.tags['id'],
    raw: msg.raw,
    command: msg.command,
    message: msg.params[1],
    msg_id: msg.tags['msg-id'],
    user_id: msg.tags['user-id'],
    display_name: name,
    login: name ? name.toLowerCase() : undefined,
  };
}

export function getIndex(channel: string) {
  return process.env.NODE_ENV === 'production'
    ? `tmi-${channel.slice(1)}`
    : `dev-tmi-${channel.slice(1)}`;
}

export async function bulkIndexTmi(data: { channel: string; message: ElasticTmi }[]) {
  const operations = data.map((x) => {
    const meta = { create: { _index: getIndex(x.channel) } };
    return JSON.stringify(meta) + '\n' + JSON.stringify(x.message);
  });
  return client.bulk({ operations });
}

export function getClient(): Client {
  return client;
}
