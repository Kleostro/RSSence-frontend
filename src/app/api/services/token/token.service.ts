import { inject, Injectable } from '@angular/core';
import { WA_LOCAL_STORAGE } from '@ng-web-apis/common';

import { STORE_KEYS } from '@/app/constants/store-keys';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly storage = inject(WA_LOCAL_STORAGE);

  public setToken(token: string): void {
    this.storage.setItem(STORE_KEYS.ACCESS_TOKEN, token);
  }

  public getToken(): string | null {
    const token = this.storage.getItem(STORE_KEYS.ACCESS_TOKEN);
    return token;
  }

  public removeToken(): void {
    this.storage.removeItem(STORE_KEYS.ACCESS_TOKEN);
  }
}
