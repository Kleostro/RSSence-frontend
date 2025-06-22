export const escapeHtml = (unsafe: string): string =>
  unsafe.replace(/&/g, '&amp;').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
