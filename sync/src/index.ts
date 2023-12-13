import utilities from 'utilities';
import app from './app';
import logger from './logger';

logger.info(`Starting Sync Application v${utilities.version()}...`);

utilities.main(app, logger);
