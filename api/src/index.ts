import { logger, main, version } from 'utilities';
import app from './app';

logger.info(`Starting API Application v${version()}...`);

main(app);
