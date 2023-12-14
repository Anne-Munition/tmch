import { logger, main, version } from 'utilities';
import app from './app';

logger.info(`Starting Client Application v${version()}...`);

main(app);
