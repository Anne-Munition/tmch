import { Client } from '@elastic/elasticsearch';
import logger from '../logger';

const esUrl = 'http://10.8.4.2:9200';

const client = new Client({
  node: esUrl,
  /*auth: {
    username: esUser,
    password: esPass,
  },*/
});

export async function ping(): Promise<void> {
  const { hostname } = new URL(esUrl);
  const response = await client.ping();
  if (!response) throw new Error(`Unable to connect to ElasticSearch server: '${hostname}'`);
  logger.info(`Connected to ElasticSearch: '${hostname}'`);
}

export async function bulkIndexTmi(messages: TmiMessage[]) {}
