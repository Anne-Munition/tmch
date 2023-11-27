import fs from 'fs';
import path from 'path';
import { Logger, createLogger, format, transports } from 'winston';
import channels from '../channels';
import { chatDir } from '../directories';

const { combine, timestamp, printf } = format;

const chatLoggers: { [key: string]: Logger } = {};

const chatLogFormat = printf((info) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { level, ...rest } = info;
  return JSON.stringify(rest);
});

export function getDirName(channel: string) {
  // returns current YYYY-MM
  const curDate = new Date();
  const curMonth = ('0' + (curDate.getMonth() + 1)).slice(-2);
  const curYYYYMM = curDate.getFullYear() + '-' + curMonth;
  return path.join(chatDir, channel, curYYYYMM);
}

function getChatTransport(channel: string) {
  return new transports.DailyRotateFile({
    dirname: getDirName(channel),
    format: combine(timestamp(), chatLogFormat),
    filename: `${channel}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
  });
}

channels.forEach((channel) => {
  let transport = getChatTransport(channel);
  chatLoggers[channel] = createLogger({
    transports: [transport],
  });

  transport.on('rotate', function () {
    if (!fs.existsSync(getDirName(channel))) {
      transport = getChatTransport(channel);
    }
  });
});

export default chatLoggers;
