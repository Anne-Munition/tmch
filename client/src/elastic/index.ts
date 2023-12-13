import { Client } from '@elastic/elasticsearch';
import { esUrl } from '../config';
import logger from '../logger';

let client: Client;

export function init() {
  client = new Client({
    node: esUrl,
    /*auth: {
      username: process.env.ES_USERNAME as string,
      password: process.env.ES_PASSWORD as string,
    },*/
  });
}

export async function ping(): Promise<void> {
  const { hostname } = new URL(esUrl);
  const response = await client.ping();
  if (!response) throw new Error(`Unable to connect to ElasticSearch server: '${hostname}'`);
  logger.info(`Connected to ElasticSearch: '${hostname}'`);
}

export async function bulkIndexTmi(
  data: { channel: string; message: ElasticTmi }[],
): Promise<void> {
  const operations = data.map((x) => {
    const meta = { create: { _index: getIndex(x.channel) } };
    return JSON.stringify(meta) + '\n' + JSON.stringify(x.message);
  });
  await client.bulk({ operations });
}

function getIndex(channel: string) {
  return process.env.NODE_ENV === 'production'
    ? `tmi-${channel.slice(1)}`
    : `tmi-dev-${channel.slice(1)}`;
}
