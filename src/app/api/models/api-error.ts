export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly error: string;

  constructor(message: string | string[], error: string, statusCode: number) {
    super(Array.isArray(message) ? message.join('\n') : message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.error = error;
  }
}
