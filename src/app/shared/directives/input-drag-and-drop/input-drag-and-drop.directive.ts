import { Directive, ElementRef, inject } from '@angular/core';

import { BaseDragAndDropDirective } from '@/app/shared/directives/base-drag-and-drop/base-drag-and-drop.directive';

@Directive({
  selector: '[appInputDragAndDrop]',
  standalone: true,
})
export class InputDragAndDropDirective extends BaseDragAndDropDirective {
  private el = inject(ElementRef);

  public override onDrop(event: DragEvent): void {
    super.onDrop(event);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0 && this.el.nativeElement instanceof HTMLInputElement) {
      this.el.nativeElement.files = files;
      const changeEvent = new Event('change', { bubbles: true });
      this.el.nativeElement.dispatchEvent(changeEvent);
    }
  }
}
