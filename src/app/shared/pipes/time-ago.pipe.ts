import { Pipe, PipeTransform } from '@angular/core';

interface TimeUnit {
  fullLabel: string;
  label: string;
  seconds: number;
}

const SECOND = 1000;

const TIME_UNITS: TimeUnit[] = [
  { fullLabel: 'year', label: 'y', seconds: 31_536_000 },
  { fullLabel: 'month', label: 'mo', seconds: 2_592_000 },
  { fullLabel: 'week', label: 'w', seconds: 604_800 },
  { fullLabel: 'day', label: 'd', seconds: 86_400 },
  { fullLabel: 'hour', label: 'h', seconds: 3_600 },
  { fullLabel: 'minute', label: 'm', seconds: 60 },
];

@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  public transform(value: Date): string {
    const now = Date.now();
    const updatedAt = new Date(value).getTime();
    const diffInSeconds = Math.floor((now - updatedAt) / SECOND);

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
