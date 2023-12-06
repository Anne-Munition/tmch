import { DateTime } from 'luxon';

const start = DateTime.now();

export default function getUptime(): string {
  const end = DateTime.now();
  const { days, hours, minutes, seconds } = end.diff(start, [
    'days',
    'hours',
    'minutes',
    'seconds',
  ]);
  return `${days} days ${hours} hours ${minutes} minutes ${Math.floor(seconds)} seconds`;
}
