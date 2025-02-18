import { inject, Injectable } from '@angular/core';

import { MessageService as service } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private readonly messageService = inject(service);

  private readonly MESSAGE_DURATION = 3000;

  public success(message: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      life: this.MESSAGE_DURATION,
      detail: message,
    });
  }

  public error(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      life: this.MESSAGE_DURATION,
      detail: message,
    });
  }

  public info(message: string): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      life: this.MESSAGE_DURATION,
      detail: message,
    });
  }

  public warning(message: string): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Warning',
      life: this.MESSAGE_DURATION,
      detail: message,
    });
  }
}
