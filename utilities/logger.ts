import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';

const { combine, timestamp, colorize, printf } = format;
const logDir = path.join(process.cwd(), 'logs');

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
      dirname: logDir,
      filename: '%DATE%-combined.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxFiles: '30d',
    }),
    new transports.DailyRotateFile({
      level: 'error',
      dirname: logDir,
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

class MyStream {
  logFormat = printf((info) => {
    return `${info.timestamp} ${info.message}`;
  });

  logger = createLogger({
    format: combine(timestamp(), this.logFormat),
    transports: [
      new transports.DailyRotateFile({
        level: 'info',
        dirname: logDir,
        filename: '%DATE%-http.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxFiles: '30d',
      }),
    ],
  });

  write(text: string) {
    this.logger.info(text.trim());
  }
}

export const stream = new MyStream();
