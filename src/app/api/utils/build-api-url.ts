import { ENVIRONMENT } from '@/environment/environment';

export const buildApiUrl = (...parts: string[]): string => ENVIRONMENT.API_URL + parts.join('/');
