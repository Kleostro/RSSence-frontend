import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appBaseDragAndDrop]',
  standalone: true,
})
export class BaseDragAndDropDirective {
  @Output() public fileDropped = new EventEmitter<File[]>();
  @HostBinding('class.file-over') public fileOver = false;

  @HostListener('dragover', ['$event'])
  public onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.fileOver = true;
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.fileOver = false;
  }

  @HostListener('drop', ['$event'])
  public onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.fileOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const fileList: File[] = Array.from(files);
      this.fileDropped.emit(fileList);
    }
  }
}
