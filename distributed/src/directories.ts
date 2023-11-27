import fs from 'fs';
import path from 'path';

export const logDir = path.join(process.cwd(), 'logs');
export const chatDir = path.join(process.cwd(), 'chat');

const dirs = [logDir, chatDir];

for (let i = 0; i < dirs.length; i++) {
  try {
    fs.accessSync(dirs[i], fs.constants.F_OK);
  } catch (e) {
    fs.mkdirSync(dirs[i]);
  }
}
