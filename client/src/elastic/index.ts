import { Client } from '@elastic/elasticsearch';
import utilities from 'utilities';
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

export async function ping() {
  return utilities.elastic(client, logger, esUrl).ping();
}

export async function bulkIndexTmi(data: { channel: string; message: ElasticTmi }[]) {
  const operations = data.map((x) => {
    const meta = { create: { _index: utilities.getIndex(x.channel) } };
    return JSON.stringify(meta) + '\n' + JSON.stringify(x.message);
  });
  return client.bulk({ operations });
}
