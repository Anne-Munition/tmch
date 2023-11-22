import fs from 'fs';
import path from 'path';

const packageFile = path.join(process.cwd(), '../package.json');
let version: string;
try {
  const json = JSON.parse(fs.readFileSync(packageFile, { encoding: 'utf8' }));
  version = json.version || '0.0.0';
} catch (e) {
  // Do Nothing
}

export default function () {
  return version;
}
