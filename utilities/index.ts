import version from './version';
import uptime from './uptime';
import logger from './logger';
import database from './database';
import elastic from './elastic';
import ViewerService from './database/lib/viewers/viewer_service';
import main from './main';

export default {
  version,
  uptime,
  logger,
  database,
  elastic,
  ViewerService,
  main,
};
