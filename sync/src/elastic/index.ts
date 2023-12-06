import { Client } from '@elastic/elasticsearch';
import {
  MsearchMultisearchBody,
  MsearchMultisearchHeader,
  MsearchRequestItem,
} from '@elastic/elasticsearch/lib/api/types';
import { DateTime } from 'luxon';
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
  // await client.indices.create({ index: 'tmi-annemunition' });
}

export async function tmiStrictBulkSearch(channel: string, messages: LogLine[]) {
  const searches: MsearchRequestItem[] = [];
  messages.forEach((message) => {
    const header: MsearchMultisearchHeader = { index: `tmi-${channel}` };
    const body: MsearchMultisearchBody = {
      query: {
        bool: {
          must: [
            { match: { 'id.keyword': message.tmiId } },
            { match: { '@timestamp': message.tmiTs } },
          ],
        },
      },
    };
    searches.push(header);
    searches.push(body);
  });
  return client.msearch({ searches }).then((data) => data.responses);
}

export async function tmiBulkIndex(channel: string, messages: ElasticTmi[]) {
  const operations = messages.map((message) => {
    const meta = { create: { _index: `tmi-${channel}` } };
    return JSON.stringify(meta) + '\n' + JSON.stringify(message);
  });
  return client.bulk({ operations });
}

export async function looseBulkSearch(channel: string, messages: LogLine[]) {
  const searches: MsearchRequestItem[] = [];
  messages.forEach((message) => {
    const header: MsearchMultisearchHeader = { index: `tmi-${channel}` };
    const body: MsearchMultisearchBody = {
      query: {
        bool: {
          filter: [
            {
              bool: {
                should: [{ match_phrase: { raw: message.message } }],
                minimum_should_match: 1,
              },
            },
            {
              range: {
                '@timestamp': {
                  gte: DateTime.fromISO(message.timestamp).minus({ seconds: 5 }).toString(),
                  lte: DateTime.fromISO(message.timestamp).plus({ seconds: 5 }).toString(),
                  format: 'strict_date_optional_time',
                },
              },
            },
          ],
        },
      },
    };
    searches.push(header);
    searches.push(body);
  });
  return client.msearch({ searches }).then((data) => data.responses);
}
