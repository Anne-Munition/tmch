import { CronJob } from 'cron';
import cronstrue from 'cronstrue';
import { logger } from 'utilities';
import consolidate from './consolidate';
import dailyReport from './dailyReport';

export default function (): void {
  if (process.env.DAILY_REPORT_CRON) {
    logger.info(
      'Daily Report Schedule: ' +
        cronstrue.toString(process.env.DAILY_REPORT_CRON, { verbose: true }),
    );
    new CronJob(process.env.DAILY_REPORT_CRON, dailyReport, null, true);
  }

  if (process.env.MERGE_CRON) {
    logger.info('Merge Schedule: ' + cronstrue.toString(process.env.MERGE_CRON, { verbose: true }));
    new CronJob(process.env.MERGE_CRON, consolidate, null, true);
  }
}
