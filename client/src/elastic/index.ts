import { Client } from '@elastic/elasticsearch';
import { esUrl } from '../config';
import logger from '../logger';

let client: Client;

export function init() {
  client = new Client({
    node: esUrl,
    /*auth: {
          username: esUser,
          password: esPass,
        },*/
  });
}

export async function ping(): Promise<void> {
  const { hostname } = new URL(esUrl);
  const response = await client.ping();
  if (!response) throw new Error(`Unable to connect to ElasticSearch server: '${hostname}'`);
  logger.info(`Connected to ElasticSearch: '${hostname}'`);
}

export async function bulkIndexTmi(messages: TmiMessage[]) {}
