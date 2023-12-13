import axios from 'axios';
import lodash from 'lodash';
import { DateTime, Duration } from 'luxon';
import utilities from 'utilities';
import * as elastic from '../elastic';
import logger from '../logger';
import * as pushover from '../pushover';
import servers from '../servers';
import { getDatesToProcess, getStartDate, saveAddedLines, saveStartDate } from './dates';

let lastDate: string | null;
let channel: string | undefined;

export default async function () {
  try {
    const result = await consolidate();
    if (result) logger.info(result);
    if (lastDate) saveStartDate(lastDate);
  } catch (err) {
    logger.error(err);
    pushover.send({
      title: 'TMCH Logger - Consolidation Error',
      message: err instanceof Error ? err.message : (err as string),
    });
  }
}

export async function consolidate(
  manualDate?: string,
  manualChannel?: string,
): Promise<void | Result[]> {
  logger.info('Starting log consolidation process...');
  const processStart = Date.now();
  channel = manualChannel || process.env.DEFAULT_CHANNEL;
  if (!channel)
    throw new Error('No channel specified. Check DEFAULT_CHANNEL environment variable.');
  const startDate = manualDate || (await getStartDate());
  const dates = manualDate ? [manualDate] : getDatesToProcess(startDate);

  if (dates.length === 0) {
    logger.info('No log dates to process. Completed.');
    pushover.send({
      title: 'TMCH Logger - Consolidation Results',
      message: 'No dates to process.',
    });
    return;
  }
  lastDate = dates[dates.length - 1];

  const results: Result[] = [];
  for (let i = 0; i < dates.length; i++) {
    results.push(await cycle(dates[i]));
  }

  const processTime = Duration.fromMillis(Date.now() - processStart);
  const seconds = Math.floor(processTime.as('seconds'));

  let message = `Time to complete: <b>${seconds}</b> seconds.\n`;
  results.forEach((cycle) => {
    message += `<b>${cycle.date}</b>
\tCycle Time: ${cycle.cycleTime}
\t# of logs: ${cycle.logCount} of ${servers.length}
\t# of lines: ${cycle.logLines}
\t# of lines/s: ${cycle.linesPerSecond}
\t# of missing lines: ${cycle.missingCount}
\t# of lines added: ${cycle.addedCount}
    `;
  });

  pushover.send({
    title: `TMCH Logger - Consolidation Results - ${channel}`,
    message,
    html: 1,
  });
  logger.info('Log consolidation process completed.');
  if (manualDate) return results;
}

async function cycle(date: string): Promise<Result> {
  logger.info(`Processing: ${date}`);
  const cycleStart = Date.now();
  const logs = await getLogs(date);
  let addedCount = 0;

  // Strict logs have a TMI ID and timestamp in the raw message
  // Loose logs might only have a winston timestamp
  let mergedStrictLines: LogLine[] = [];
  let mergedLooseLines: LogLine[] = [];

  if (logs.length) {
    const { strictLines, looseLines } = splitLogs(logs);
    mergedStrictLines = mergeStrictLines(strictLines);
    mergedLooseLines = mergeLooseLines(looseLines);
    const strictAdded = await processStrictLines(mergedStrictLines);
    const looseAdded = await processLooseLines(mergedLooseLines);
    addedCount = strictAdded.length + looseAdded.length;
    saveAddedLines([...strictAdded, ...looseAdded], date);
  }

  const mergedLength = mergedStrictLines.length + mergedLooseLines.length;
  const missingCount = logs.reduce((prev, next) => {
    const count = next
      .trim()
      .split('\n')
      .filter((x) => x).length;
    const diff = mergedLength - count;
    if (diff < 0) return prev;
    return prev + diff;
  }, 0);
  const cycleTime = Duration.fromMillis(Date.now() - cycleStart);

  return {
    date,
    cycleTime: Math.floor(cycleTime.as('seconds') * 1000) / 1000,
    logCount: logs.length,
    logLines: mergedLength,
    linesPerSecond: Math.floor(mergedLength / cycleTime.as('seconds')),
    missingCount,
    addedCount,
  };
}

async function getLogs(date: string): Promise<string[]> {
  const logPromises = servers.map((server) => {
    const url = `${server}/logs/${channel}/${date}`;
    return axios
      .get(url)
      .then(({ data }) => {
        if (!data) return null;
        if (typeof data === 'object') return JSON.stringify(data);
        return data;
      })
      .catch((err) => {
        if (!err.response || err.response.status === 404) return null;
        throw new Error(`Unable to get logs from ${server}`);
      });
  });
  return (await Promise.all(logPromises)).filter(notEmpty);
}

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return !(value === null || value === undefined);
}

function splitLogs(logs: string[]) {
  const strictLines: LogLine[] = [];
  const looseLines: LogLine[] = [];
  logs.forEach((log) => {
    log
      .trim()
      .split('\n')
      .filter((x) => x)
      .forEach((line) => {
        const json: LogLine = JSON.parse(line);
        const id = json.message.match(/[^-]id=([^;]+)/) || [];
        const ts = json.message.match(/tmi-sent-ts=([^;]+)/) || [];
        if (id[1] && ts[1]) {
          strictLines.push({
            ...json,
            tmiTs: ts[1],
            tmiId: id[1],
          });
        } else {
          looseLines.push(json);
        }
      });
  });
  return { strictLines, looseLines };
}

function mergeStrictLines(lines: LogLine[]): LogLine[] {
  if (!lines.length) return lines;
  return lodash.uniqBy(lines, 'message');
}

function mergeLooseLines(lines: LogLine[]) {
  if (!lines.length) return lines;

  // Group same messages together in smaller arrays mapped to the message
  const items: { [key: string]: LogLine[] } = {};
  for (let i = 0; i < lines.length; i++) {
    if (items[lines[i].message]) {
      items[lines[i].message].push(lines[i]);
    } else {
      items[lines[i].message] = [lines[i]];
    }
  }

  const uniqueLines: LogLine[] = [];

  const seconds = 5;
  for (const item in items) {
    const itemArr = items[item];
    const unique = lodash.uniqWith(itemArr, (arrVal, othVal) => {
      const othTime = DateTime.fromISO(othVal.timestamp);
      const min = DateTime.fromISO(arrVal.timestamp).minus({ seconds });
      const max = DateTime.fromISO(arrVal.timestamp).plus({ seconds });
      return othTime > min && othTime < max;
    });
    uniqueLines.push(...unique);
  }

  return uniqueLines;
}

async function processStrictLines(logs: LogLine[]): Promise<LogLine[]> {
  if (!logs.length) return logs;
  const addedLines: LogLine[] = [];
  const chunkedLogs = lodash.chunk(logs, 100);
  for (let i = 0; i < chunkedLogs.length; i++) {
    const results = await elastic.tmiStrictBulkSearch(channel as string, chunkedLogs[i]);
    const toAdd: LogLine[] = [];
    for (let j = 0; j < results.length; j++) {
      const log = chunkedLogs[i][j];
      const result = results[j] as MsearchResult;
      if (result.status === 200) {
        if (result.hits.total.value === 0) toAdd.push(log);
      } else if (result.status === 404) {
        toAdd.push(log);
      }
    }
    if (toAdd.length) {
      addedLines.push(...toAdd);
      const messages = toAdd.map((x) => elastic.createElasticBody(x));
      await elastic.tmiBulkIndex(channel as string, messages).catch(() => {});
    }
    await utilities.ViewerService.store(
      chunkedLogs[i].map((x) => elastic.createElasticBody(x)),
    ).catch(() => {});
  }
  return addedLines;
}

async function processLooseLines(logs: LogLine[]): Promise<LogLine[]> {
  if (!logs.length) return logs;
  const addedLines: LogLine[] = [];
  const chunkedLogs = lodash.chunk(logs, 100);
  for (let i = 0; i < chunkedLogs.length; i++) {
    const results = await elastic.looseBulkSearch(channel as string, logs);
    const toAdd: LogLine[] = [];
    for (let j = 0; j < results.length; j++) {
      const log = chunkedLogs[i][j];
      const result = results[j] as MsearchResult;
      if (result.status === 200) {
        if (result.hits.total.value === 0) toAdd.push(log);
      } else if (result.status === 404) {
        toAdd.push(log);
      }
    }
    if (toAdd.length) {
      addedLines.push(...toAdd);
      const messages = toAdd.map((x) => createElasticBody(x));
      await elastic.tmiBulkIndex(channel as string, messages).catch(() => {});
    }
    await utilities.ViewerService.store(chunkedLogs[i].map((x) => createElasticBody(x))).catch(
      () => {},
    );
  }
  return addedLines;
}
