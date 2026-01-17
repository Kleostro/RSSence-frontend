import { Pipe, PipeTransform } from '@angular/core';

import { TIME_SECONDS } from '@/app/constants/time';

interface TimeUnit {
  fullLabel: string;
  seconds: number;
  shortLabel: string;
  useShort: boolean;
}

const TIME_UNITS: TimeUnit[] = [
  { fullLabel: 'year', seconds: TIME_SECONDS.YEAR, shortLabel: 'y', useShort: false },
  { fullLabel: 'month', seconds: TIME_SECONDS.MONTH, shortLabel: 'mo', useShort: false },
  { fullLabel: 'week', seconds: TIME_SECONDS.WEEK, shortLabel: 'w', useShort: true },
  { fullLabel: 'day', seconds: TIME_SECONDS.DAY, shortLabel: 'd', useShort: true },
  { fullLabel: 'hour', seconds: TIME_SECONDS.HOUR, shortLabel: 'h', useShort: true },
  { fullLabel: 'minute', seconds: TIME_SECONDS.MINUTE, shortLabel: 'm', useShort: true },
  { fullLabel: 'second', seconds: TIME_SECONDS.SECOND, shortLabel: 's', useShort: true },
];

const MS_PER_SECOND = 1000;

@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  public transform(value?: Date | null | string): string {
    if (!value) {
      return 'just now';
    }

    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) {
      return 'invalid date';
    }

    const now = Date.now();
    const diffMs = now - date.getTime();

    const diffSeconds = Math.floor(diffMs / MS_PER_SECOND);

    if (diffSeconds >= TIME_SECONDS.YEAR / 2) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${month}.${day}.${year}`;
    }

    for (const unit of TIME_UNITS) {
      if (diffSeconds >= unit.seconds) {
        const interval = Math.floor(diffSeconds / unit.seconds);
        const label = unit.useShort ? unit.shortLabel : interval === 1 ? unit.fullLabel : `${unit.fullLabel}s`;

        return `${interval}${unit.useShort ? label : ` ${label}`} ago`;
      }
    }

    return 'just now';
  }
}
