import fs from 'fs';
import path from 'path';

const logDir = path.join(process.cwd(), 'logs');
export const appLogDir = path.join(logDir, 'app');
export const chatLogDir = path.join(logDir, 'chat');

const dirs = [logDir, appLogDir, chatLogDir];

for (let i = 0; i < dirs.length; i++) {
  try {
    fs.accessSync(dirs[i], fs.constants.F_OK);
  } catch (e) {
    fs.mkdirSync(dirs[i]);
  }
}
