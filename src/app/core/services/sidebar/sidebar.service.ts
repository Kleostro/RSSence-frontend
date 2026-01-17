import { inject, Injectable, signal } from '@angular/core';
import { WA_LOCAL_STORAGE } from '@ng-web-apis/common';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private readonly key = 'app-sidebar-status';
  private readonly localStorage = inject(WA_LOCAL_STORAGE);
  public isSidebarOpen = signal<boolean>(false);

  constructor() {
    this.isSidebarOpen.set(this.localStorage.getItem(this.key) === 'true');
  }

  public toggle(): void {
    this.isSidebarOpen.set(!this.isSidebarOpen());
    this.localStorage.setItem(this.key, this.isSidebarOpen() ? 'true' : 'false');
  }
}
