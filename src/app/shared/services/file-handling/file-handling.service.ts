import { inject, Injectable } from '@angular/core';

import { MessageService } from '@/app/shared/services/message/message.service';

@Injectable({
  providedIn: 'root',
})
export class FileHandlingService {
  private readonly message = inject(MessageService);

  private readonly DEFAULT_MAX_SIZE = 8 * 1024 * 1024;

  public getFileFromEvent(event: Event): File | null {
    const { target } = event;
    if (target instanceof HTMLInputElement) {
      return target.files?.[0] ?? null;
    }
    return null;
  }

  public isValidFileSize(file: File, maxSize: number = this.DEFAULT_MAX_SIZE): boolean {
    if (file.size > maxSize) {
      this.message.error(`File size exceeds the maximum limit of ${(maxSize / 1024 / 1024).toString()}MB`);
      return false;
    }
    return true;
  }

  public createObjectURL(file: File): string {
    return URL.createObjectURL(file);
  }
}
