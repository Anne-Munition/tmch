import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import { appLogDir } from '../directories';

const { combine, timestamp, colorize, printf } = format;

const enumerateErrorFormat = format((info) => {
  if (info.message instanceof Error) {
    info.message = Object.assign(
      {
        message: info.message.message,
        stack: info.message.stack,
      },
      info.message,
    );
  }

  if (info instanceof Error) {
    return Object.assign(
      {
        message: info.message,
        stack: info.stack,
      },
      info,
    );
  }

  return info;
});

const logFormat = printf((info) => {
  const log = `${info.timestamp} ${info.level} ${info.message}`;
  return info.stack ? `${log}\n${info.stack}` : log;
});

const logger = createLogger({
  format: combine(timestamp(), enumerateErrorFormat(), logFormat),
  transports: [
    new transports.DailyRotateFile({
      level: 'info',
      dirname: appLogDir,
      filename: '%DATE%-combined.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxFiles: '30d',
    }),
    new transports.DailyRotateFile({
      level: 'error',
      dirname: appLogDir,
      filename: '%DATE%-error.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxFiles: '30d',
    }),
    new transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: combine(timestamp(), enumerateErrorFormat(), colorize(), logFormat),
    }),
  ],
});

export default logger;
