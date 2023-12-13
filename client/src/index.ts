import utilities from 'utilities';
import app from './app';
import logger from './logger';

logger.info(`Starting Client Application v${utilities.version()}...`);

utilities.main(app, logger);
