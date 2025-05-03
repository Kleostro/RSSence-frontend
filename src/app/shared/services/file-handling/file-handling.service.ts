import { inject, Injectable } from '@angular/core';

import { MessageService } from '@/app/shared/services/message/message.service';

@Injectable({
  providedIn: 'root',
})
export class FileHandlingService {
  private readonly message = inject(MessageService);

  private static readonly KB = 1024;
  private static readonly MB = FileHandlingService.KB ** 2;
  private static readonly DEFAULT_MAX_SIZE_MB = 8;
  private static readonly DEFAULT_MAX_SIZE = FileHandlingService.DEFAULT_MAX_SIZE_MB * FileHandlingService.MB;

  public getFileListFromEvent(event: Event): FileList | null {
    const { target } = event;
    if (target instanceof HTMLInputElement) {
      return target.files;
    }
    return null;
  }

  public isValidFileSize(file: File, maxSize: number = FileHandlingService.DEFAULT_MAX_SIZE): boolean {
    if (file.size > maxSize) {
      const sizeInMB = (maxSize / FileHandlingService.MB).toString();
      this.message.error(`File size exceeds the maximum limit of ${sizeInMB}MB`);
      return false;
    }
    return true;
  }

  public createObjectURL(file: File): string {
    return URL.createObjectURL(file);
  }
}
