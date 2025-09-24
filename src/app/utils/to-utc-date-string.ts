export const toUTCDateString = (date: Date): string =>
  new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString().split('T')[0];
