import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject, ViewChild } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

import { ModalPositionDirective } from '@/app/shared/directives/modal-position/modal-position.directive';
import { ModalService } from '@/app/shared/services/modal/modal.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, ButtonModule, RippleModule, ModalPositionDirective],
  selector: 'app-modal',
  standalone: true,
  styleUrl: './modal.component.scss',
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  @ViewChild('modalDialog') public modalDialog!: ElementRef;

  public modalService = inject(ModalService);

  public onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.modalService.closeModal();
    }
  }

  public outsideClick(event: Event): void {
    if (
      event.target &&
      event.target instanceof HTMLElement &&
      this.modalDialog.nativeElement !== event.target &&
      this.modalDialog.nativeElement instanceof HTMLElement &&
      !this.modalDialog.nativeElement.contains(event.target)
    ) {
      this.modalService.closeModal();
    }
  }
}
