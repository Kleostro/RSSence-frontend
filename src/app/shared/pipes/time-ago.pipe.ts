import { Pipe, PipeTransform } from '@angular/core';

interface TimeUnit {
  label: string;
  seconds: number;
  fullLabel: string;
}

const SECOND = 1000;

const TIME_UNITS: TimeUnit[] = [
  { label: 'y', seconds: 31_536_000, fullLabel: 'year' },
  { label: 'mo', seconds: 2_592_000, fullLabel: 'month' },
  { label: 'w', seconds: 604_800, fullLabel: 'week' },
  { label: 'd', seconds: 86_400, fullLabel: 'day' },
  { label: 'h', seconds: 3_600, fullLabel: 'hour' },
  { label: 'm', seconds: 60, fullLabel: 'minute' },
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
