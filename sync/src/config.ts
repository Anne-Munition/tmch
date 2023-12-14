import servers from './servers';

export function verify() {
  if (servers.length === 0) throw new Error('No Servers set. Check your env variables.');
  if (!process.env.ES_URL) throw new Error('Missing ES_URL environment variable.');
  // if (!process.env.ES_USERNAME) throw new Error('Missing ES_USERNAME environment variable.');
  // if (!process.env.ES_PASSWORD) throw new Error('Missing ES_PASSWORD environment variable.');
}
