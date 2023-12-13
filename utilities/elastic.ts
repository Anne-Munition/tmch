import { Client } from '@elastic/elasticsearch';
import winston from 'winston';

export default (client: Client, logger: winston.Logger, esUrl: string) => {
  async function ping(): Promise<void> {
    const { hostname, pathname } = new URL(esUrl);
    const response = await client.ping();
    if (!response)
      throw new Error(`Unable to connect to ElasticSearch server: '${hostname}${pathname}'`);
    logger.info(`Connected to ElasticSearch: '${hostname}'`);
  }

  return {
    ping,
  };
};
