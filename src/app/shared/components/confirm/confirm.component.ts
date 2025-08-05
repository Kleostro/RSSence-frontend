import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';

import { ButtonModule, ButtonSeverity } from 'primeng/button';
import { Message } from 'primeng/message';
import { RippleModule } from 'primeng/ripple';

import { ModalService } from '@/app/shared/services/modal/modal.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, RippleModule, Message],
  selector: 'app-confirm',
  styleUrl: './confirm.component.scss',
  templateUrl: './confirm.component.html',
})
export class ConfirmComponent {
  public readonly modalService = inject(ModalService);
  public cancelButtonIcon = input<string>('pi pi-arrow-left');
  public cancelButtonSeverity = input<ButtonSeverity>('primary');
  public cancelButtonText = input<string>('Cancel');
  public confirmButtonDisabled = input<boolean>(false);
  public confirmButtonIcon = input<string>('pi pi-times');
  public confirmButtonSeverity = input<ButtonSeverity>('success');
  public confirmButtonText = input<string>('Confirm');
  public confirmEvent = output();
  public infoMessage = input<string>();
  public isProcessing = input<boolean>(false);
  public warningMessage = input<string>();
}
