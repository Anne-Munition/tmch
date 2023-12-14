import path from 'path';

export const doWrite = process.env.WRITE === 'true';
export const dataDir = path.join(process.cwd(), 'data');

export function verify() {
  if (!process.env.CHANNELS) throw new Error('Missing CHANNELS environment variable.');
  if (doWrite) {
    if (!process.env.ES_URL) throw new Error('Missing ES_URL environment variable.');
    // if (!process.env.ES_USERNAME) throw new Error('Missing ES_USERNAME environment variable.');
    // if (!process.env.ES_PASSWORD) throw new Error('Missing ES_PASSWORD environment variable.');
  }
}
