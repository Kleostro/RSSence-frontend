import { Pipe, PipeTransform } from '@angular/core';

import { TIME } from '@/app/constants/time';

interface TimeUnit {
  fullLabel: string;
  label: string;
  seconds: number;
}

const TIME_UNITS: TimeUnit[] = [
  { fullLabel: 'year', label: 'y', seconds: TIME.YEAR },
  { fullLabel: 'month', label: 'mo', seconds: TIME.MONTH },
  { fullLabel: 'week', label: 'w', seconds: TIME.WEEK },
  { fullLabel: 'day', label: 'd', seconds: TIME.DAY },
  { fullLabel: 'hour', label: 'h', seconds: TIME.HOUR },
  { fullLabel: 'minute', label: 'm', seconds: TIME.MINUTE },
];

@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  public transform(value: Date): string {
    const now = Date.now();
    const updatedAt = new Date(value).getTime();
    const diffInSeconds = Math.floor((now - updatedAt) / TIME.SECOND);

    for (const unit of TIME_UNITS) {
      const interval = Math.floor(diffInSeconds / unit.seconds);
      if (interval >= 1) {
        const plural = interval === 1 ? unit.fullLabel : `${unit.fullLabel}s`;
        return `${interval} ${plural} ago`;
      }
    }

    return `${diffInSeconds} second${diffInSeconds === 1 ? '' : 's'} ago`;
  }
}
