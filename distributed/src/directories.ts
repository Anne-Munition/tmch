import fs from 'fs';
import path from 'path';

export const logDir = path.join(process.cwd(), 'logs');
export const dataDir = path.join(process.cwd(), 'data');

const dirs = [logDir, dataDir];

for (let i = 0; i < dirs.length; i++) {
  try {
    fs.accessSync(dirs[i], fs.constants.F_OK);
  } catch (e) {
    fs.mkdirSync(dirs[i]);
  }
}
