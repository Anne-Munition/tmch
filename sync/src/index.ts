import { logger, main, version } from 'utilities';
import app from './app';

logger.info(`Starting Sync Application v${version()}...`);

main(app);
