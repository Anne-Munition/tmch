import logger from './logger';
import servers from './servers';

export const esUrl = process.env.ES_URL || 'http://127.0.0.1:9200';

export function validate() {
  if (servers.length === 0) throw new Error('No Servers set. Check your env variables.');
  logger.info(`Running checks on ${servers.length} servers`);

  if (!process.env.ES_URL) throw new Error('Missing ES_URL environment variable.');
  // if (!process.env.ES_USERNAME) throw new Error('Missing ES_USERNAME environment variable.');
  // if (!process.env.ES_PASSWORD) throw new Error('Missing ES_PASSWORD environment variable.');
}
