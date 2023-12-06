import * as elastic from '../elastic';
import logger from '../logger';
import { consolidate } from './index';

async function run() {
  const [, , date, channel = process.env.DEFAULT_CHANNEL] = process.argv;
  if (!date) return logger.error('Missing date argument');
  if (!/\d{4}-\d{2}-\d{2}/.test(date)) return logger.error('Malformed date argument');
  logger.info(`Channel: ${channel} - Date: ${date}`);
  elastic.init();
  await elastic.ping();
  const results = await consolidate(date, channel);
  if (results) console.log({ channel, ...results });
}

run().catch(logger.error);
