import { Pipe, PipeTransform } from '@angular/core';

const SECONDS_COUNT = {
  IN_YEAR: 31536000,
  IN_MONTH: 2592000,
  IN_WEEK: 604800,
  IN_DAY: 86400,
  IN_HOUR: 3600,
  IN_MINUTE: 60,
};

@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  public transform(value: Date): string {
    const now = new Date();
    const updatedAt = new Date(value);
    const seconds = Math.floor((now.getTime() - updatedAt.getTime()) / 1000);

    let interval = Math.floor(seconds / SECONDS_COUNT.IN_YEAR);
    if (interval > 1) {
      return `${interval.toString()}y`;
    }

    interval = Math.floor(seconds / SECONDS_COUNT.IN_MONTH);
    if (interval > 1) {
      return `${interval.toString()}mo`;
    }

    interval = Math.floor(seconds / SECONDS_COUNT.IN_WEEK);
    if (interval > 1) {
      return `${interval.toString()}w`;
    }

    interval = Math.floor(seconds / SECONDS_COUNT.IN_DAY);
    if (interval > 1) {
      return `${interval.toString()}d`;
    }

    interval = Math.floor(seconds / SECONDS_COUNT.IN_HOUR);
    if (interval > 1) {
      return `${interval.toString()}h`;
    }

    interval = Math.floor(seconds / SECONDS_COUNT.IN_MINUTE);
    if (interval > 1) {
      return `${interval.toString()}m`;
    }

    return `${seconds.toString()}s`;
  }
}
