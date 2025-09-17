import { HttpParams } from '@angular/common/http';

export function buildHttpParams<T>(params: T, keys: readonly (keyof T & string)[]): HttpParams {
  let httpParams = new HttpParams();

  keys.forEach((key) => {
    const value = params[key];

    if (value == null) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== null && item !== undefined) {
          httpParams = httpParams.append(key, String(item));
        }
      });
    } else {
      httpParams = httpParams.set(key, String(value));
    }
  });

  return httpParams;
}
