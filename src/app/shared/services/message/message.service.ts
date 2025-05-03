import { inject, Injectable } from '@angular/core';

import { MessageService as service } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private readonly MESSAGE_DURATION: number = 3000;
  private readonly messageService = inject(service);

  public error(message: string): void {
    this.messageService.add({
      detail: message,
      life: this.MESSAGE_DURATION,
      severity: 'error',
      summary: 'Error',
    });
  }

  public info(message: string): void {
    this.messageService.add({
      detail: message,
      life: this.MESSAGE_DURATION,
      severity: 'info',
      summary: 'Info',
    });
  }

  public success(message: string): void {
    this.messageService.add({
      detail: message,
      life: this.MESSAGE_DURATION,
      severity: 'success',
      summary: 'Success',
    });
  }

  public warning(message: string): void {
    this.messageService.add({
      detail: message,
      life: this.MESSAGE_DURATION,
      severity: 'warn',
      summary: 'Warning',
    });
  }
}
