import { inject, Injectable } from '@angular/core';
import { WA_LOCAL_STORAGE } from '@ng-web-apis/common';

import { AuthResponse } from '@/app/api/schemas/auth-response';
import { STORE_KEYS } from '@/app/constants/store-keys';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly storage = inject(WA_LOCAL_STORAGE);

  public setToken(accessToken: string, refreshToken: string): void {
    this.storage.setItem(STORE_KEYS.ACCESS_TOKEN, accessToken);
    this.storage.setItem(STORE_KEYS.REFRESH_TOKEN, refreshToken);
  }

  public getToken(): AuthResponse | null {
    const accessToken = this.storage.getItem(STORE_KEYS.ACCESS_TOKEN);
    const refreshToken = this.storage.getItem(STORE_KEYS.REFRESH_TOKEN);

    if (!accessToken || !refreshToken) {
      return null;
    }
    return { accessToken, refreshToken };
  }

  public removeToken(): void {
    this.storage.removeItem(STORE_KEYS.ACCESS_TOKEN);
    this.storage.removeItem(STORE_KEYS.REFRESH_TOKEN);
  }
}
