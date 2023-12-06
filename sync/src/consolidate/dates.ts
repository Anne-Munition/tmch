import fs from 'fs/promises';
import path from 'path';
import { DateTime } from 'luxon';
import { dataDir, linesDir } from '../directories';

const startDateFile = path.join(dataDir, 'startDate');

export async function getStartDate(): Promise<string> {
  let startDate: string;
  try {
    await fs.access(startDateFile, fs.constants.F_OK);
    startDate = await fs.readFile(startDateFile, { encoding: 'utf8' });
  } catch (e) {
    if (process.env.START_DATE) {
      startDate = process.env.START_DATE;
    } else {
      startDate = DateTime.now().minus({ days: 1 }).toFormat('yyyy-LL-dd');
    }
  }

  if (!/^\d{4}-\d{2}-\d{2}/.test(startDate)) throw new Error('The start date is malformed.');

  return startDate;
}

export function getDatesToProcess(startDate: string): string[] {
  let date = DateTime.fromFormat(startDate, 'yyyy-LL-dd');
  const yesterday = DateTime.now().startOf('day').minus({ days: 1 });
  const datesToProcess = [];
  while (date <= yesterday) {
    datesToProcess.push(date.toFormat('yyyy-LL-dd'));
    date = date.plus({ days: 1 });
  }
  return datesToProcess;
}

export function saveStartDate(date: string): void {
  const tomorrow = DateTime.fromFormat(date, 'yyyy-LL-dd').plus({ days: 1 }).toFormat('yyyy-LL-dd');
  fs.writeFile(startDateFile, tomorrow, { encoding: 'utf8' }).catch(() => {});
}

export function saveAddedLines(lines: LogLine[], date: string): void {
  if (!lines.length) return;
  const fileName = path.join(linesDir, `#annemunition-${date}-${new Date().valueOf()}.log`);
  const data = lines.length ? lines.map((x) => JSON.stringify(x)).join('\n') : 'null';
  fs.writeFile(fileName, data, { encoding: 'utf8' }).catch(() => {});
}
