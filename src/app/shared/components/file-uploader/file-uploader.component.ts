import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, input, Output } from '@angular/core';

import { InputDragAndDropDirective } from '@/app/shared/directives/input-drag-and-drop/input-drag-and-drop.directive';
import { FileHandlingService } from '@/app/shared/services/file-handling/file-handling.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InputDragAndDropDirective, DecimalPipe],
  selector: 'app-file-uploader',
  styleUrl: './file-uploader.component.scss',
  templateUrl: './file-uploader.component.html',
})
export class FileUploaderComponent {
  private static readonly DEFAULT_MAX_SIZE_MB = 5;
  private static readonly KB = 1024;
  private static readonly MB = FileUploaderComponent.KB ** 2;
  private static readonly DEFAULT_MAX_SIZE_BYTES = FileUploaderComponent.DEFAULT_MAX_SIZE_MB * FileUploaderComponent.MB;

  private readonly fileHandlingService = inject(FileHandlingService);

  @Output() public fileSelectedEvent = new EventEmitter<File[]>();

  public readonly fileMaxSize = input<number>(FileUploaderComponent.DEFAULT_MAX_SIZE_BYTES);
  public readonly fileUrl = input<null | string>();
  public readonly inputId = input<string>();
  public readonly isProcessing = input.required<boolean>();
  public readonly label = input<string>();

  public onFileSelected(event: Event | FileList): void {
    const fileList = event instanceof Event ? this.fileHandlingService.getFileListFromEvent(event) : event;
    const files: File[] = [];

    if (fileList) {
      Array.from(fileList).forEach((file) => {
        if (this.fileHandlingService.isValidFileSize(file, this.fileMaxSize())) {
          files.push(file);
        }
      });
      this.fileSelectedEvent.emit(files);
      return;
    }

    this.fileSelectedEvent.emit([]);
  }
}
