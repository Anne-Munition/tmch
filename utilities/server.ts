import { Server } from 'http';
import { HttpTerminator, createHttpTerminator } from 'http-terminator';
import logger from './logger';
import { Express } from 'express';

let httpTerminator: HttpTerminator;

export default (app: Express) => {
  function start(): void {
    const server = new Server(app);
    const port = process.env.PORT || 3000;
    httpTerminator = createHttpTerminator({ server });
    server.listen(port);
    logger.info(`Listening on port: ${port}`);
  }

  async function stop(): Promise<void> {
    if (httpTerminator)
      httpTerminator
        .terminate()
        .then(() => {
          logger.info('Server connections closed');
        })
        .catch(() => {});
  }

  return {
    start,
    stop,
  };
};
