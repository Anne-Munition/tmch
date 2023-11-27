import fs from 'fs';
import path from 'path';

const logDir = path.join(process.cwd(), 'logs');
export const appLogDir = path.join(logDir, 'app');

const dirs = [logDir, appLogDir];

for (let i = 0; i < dirs.length; i++) {
  try {
    fs.accessSync(dirs[i], fs.constants.F_OK);
  } catch (e) {
    fs.mkdirSync(dirs[i]);
  }
}
