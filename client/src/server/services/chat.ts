import fs from 'fs';
import path from 'path';
import { ungzip } from 'node-gzip';
import { getDirName } from '../../logger/chat_logger';

async function getChatFileName(channelName: string, date: string): Promise<string | null> {
  const channel = '#' + channelName.toLowerCase().replace('#', '');
  const directory = getDirName(channel);

  const logPath = path.join(directory, `${channel}-${date}.log`);
  const logExists = await exists(logPath);
  if (logExists) return logPath;

  const gzipPath = path.join(directory, `${channel}-${date}.log.gz`);
  const gzipExists = await exists(gzipPath);
  if (gzipExists) return gzipPath;

  return null;
}

async function exists(location: string): Promise<boolean> {
  return new Promise((resolve) => {
    fs.access(location, fs.constants.F_OK, (err) => {
      if (err) {
        resolve(false);
        return;
      }
      resolve(true);
    });
  });
}

async function getChatFileBuffer(location: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    fs.readFile(location, { encoding: null }, async (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      if (location.endsWith('.gz')) {
        data = await ungzip(data);
      }
      resolve(data);
    });
  });
}

export default {
  getChatFileName,
  getChatFileBuffer,
};
