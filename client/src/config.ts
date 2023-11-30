export const doWrite = process.env.WRITE === 'true';
export const esUrl = process.env.ES_URL || 'http://127.0.0.1:9200';

export function verify() {
  if (!process.env.CHANNELS) throw new Error('Missing CHANNELS environment variable.');
  if (doWrite) {
    if (!process.env.ES_URL) throw new Error('Missing ES_URL environment variable.');
  }
}
