import fs from 'fs';
import path from 'path';

export const dataDir = path.join(process.cwd(), 'data');
export const linesDir = path.join(dataDir, 'addedLines');

const dirs = [dataDir, linesDir];

for (let i = 0; i < dirs.length; i++) {
  try {
    fs.accessSync(dirs[i], fs.constants.F_OK);
  } catch (e) {
    fs.mkdirSync(dirs[i]);
  }
}
