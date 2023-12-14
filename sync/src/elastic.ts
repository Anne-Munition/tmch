import {
  MsearchMultisearchBody,
  MsearchMultisearchHeader,
  MsearchRequestItem,
} from '@elastic/elasticsearch/lib/api/types';
import { DateTime } from 'luxon';
import parser from 'tmi-parser';
import { elastic } from 'utilities';

export async function tmiStrictBulkSearch(channel: string, messages: LogLine[]) {
  const searches: MsearchRequestItem[] = [];
  messages.forEach((message) => {
    const header: MsearchMultisearchHeader = { index: elastic.getIndex(channel) };
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
  return elastic
    .getClient()
    .msearch({ searches })
    .then((data) => data.responses);
}

export async function looseBulkSearch(channel: string, messages: LogLine[]) {
  const searches: MsearchRequestItem[] = [];
  messages.forEach((message) => {
    const header: MsearchMultisearchHeader = { index: elastic.getIndex(channel) };
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
  return elastic
    .getClient()
    .msearch({ searches })
    .then((data) => data.responses);
}

export function createElasticBody(line: LogLine): ElasticTmi {
  return elastic.tmiMessage(parser.msg(line.message));
}
