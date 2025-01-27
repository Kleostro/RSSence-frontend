import { inject, Injectable } from '@angular/core';

import { TuiAlertService } from '@taiga-ui/core';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private readonly alert = inject(TuiAlertService);
  private readonly duration = 3000;

  public showSuccessAlert(message?: string, title = 'Success'): void {
    this.alert
      .open(message, {
        label: title,
        appearance: 'positive',
        autoClose: this.duration,
      })
      .subscribe();
  }

  public showWarningAlert(message?: string, title = 'Warning'): void {
    this.alert
      .open(message, {
        label: title,
        appearance: 'warning',
        autoClose: this.duration,
      })
      .subscribe();
  }

  public showErrorAlert(message?: unknown, title = 'Error'): void {
    const errorMessage = message instanceof Error ? message.message : (message ?? 'An unknown error occurred');
    this.alert
      .open(errorMessage, {
        label: title,
        appearance: 'negative',
        autoClose: this.duration,
      })
      .subscribe();
  }
}
