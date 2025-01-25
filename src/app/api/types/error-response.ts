import { HttpErrorResponse } from '@angular/common/http';

export interface Error {
  message: string;
  reason: string;
}

export interface OverriddenHttpErrorResponse extends HttpErrorResponse {
  error: Error;
}
