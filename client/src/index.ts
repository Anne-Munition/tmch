import { version } from 'utilities';
import app from './app';
import logger from './logger';

logger.info(`Starting Client Application v${version()}...`);

app
  .start()
  .then(() => {
    logger.info('Startup complete');
  })
  .catch((e: Error) => {
    logger.error(e);
  });

const signals: NodeJS.Signals[] = ['SIGHUP', 'SIGINT', 'SIGTERM'];

signals.forEach((signal) => {
  process.on(signal, () => {
    shutdown(signal);
  });
});

const shutdown = (signal: NodeJS.Signals) => {
  logger.info(`Received a ${signal} signal. Attempting graceful shutdown...`);
  app.stop().finally(() => {
    logger.info(`Shutdown completed. Exiting.`);
    process.exit(0);
  });
};

process.on('uncaughtException', (err) => {
  logException('uncaughtException', err);
});

process.on('unhandledRejection', (err: Error) => {
  logException('unhandledRejection', err);
});

function logException(type: string, err: Error) {
  logger.error(type);
  logger.error(err);
}
