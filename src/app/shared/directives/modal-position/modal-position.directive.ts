import { Directive, HostBinding, Input } from '@angular/core';

import { MODAL_POSITION_OFFSETS } from '@/app/shared/constants/modal-position';
import ModalPositionType from '@/app/shared/models/modal-position';

@Directive({
  selector: '[appModalPosition]',
})
export class ModalPositionDirective {
  @Input() public position!: ModalPositionType;

  @HostBinding('style') public get hostStyle(): string {
    return this.calcOffsetsByPosition(this.position);
  }

  public calcOffsetsByPosition(position: ModalPositionType): string {
    return MODAL_POSITION_OFFSETS[position] || MODAL_POSITION_OFFSETS.center;
  }
}
