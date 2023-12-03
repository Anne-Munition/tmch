import fs from 'fs/promises';
import path from 'path';
import { DateTime } from 'luxon';
import { gzip } from 'node-gzip';
import { Logger, createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import channels from '../channels';
import { chatLogDir } from '../directories';

const { combine, timestamp, printf } = format;

const chatLoggers: { [key: string]: Logger } = {};

const chatLogFormat = printf((info) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { level, ...rest } = info;
  return JSON.stringify(rest);
});

channels.forEach((channel) => {
  const directory = path.join(chatLogDir, channel);
  zipOldLogs(channel, directory).catch(() => {});
  chatLoggers[channel] = createLogger({
    transports: [
      new transports.DailyRotateFile({
        dirname: directory,
        format: combine(timestamp(), chatLogFormat),
        filename: `${channel}-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
      }),
    ],
  });
});

async function zipOldLogs(channel: string, directory: string) {
  const today = DateTime.now().toFormat('yyyy-LL-dd');
  const todayLogPath = `${channel}-${today}.log`;

  const files = await fs.readdir(directory);
  const nonZippedFiles = files.filter((file) => file.endsWith('.log'));
  for (let i = 0; i < nonZippedFiles.length; i++) {
    const file = nonZippedFiles[i];
    if (file === todayLogPath) continue;
    const zipped = await gzip(await fs.readFile(path.join(directory, file)));
    await fs.writeFile(path.join(directory, file + '.gz'), zipped, { encoding: null });
    await fs.rm(path.join(directory, file));
  }
}

export default chatLoggers;
