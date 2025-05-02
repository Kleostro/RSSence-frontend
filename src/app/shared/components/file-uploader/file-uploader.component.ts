import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, input, Output } from '@angular/core';

import { InputDragAndDropDirective } from '@/app/shared/directives/input-drag-and-drop/input-drag-and-drop.directive';
import { FileHandlingService } from '@/app/shared/services/file-handling/file-handling.service';

@Component({
  selector: 'app-file-uploader',
  imports: [InputDragAndDropDirective, DecimalPipe],
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploaderComponent {
  public readonly inputId = input<string>();
  public readonly label = input<string>();
  public readonly isProcessing = input.required<boolean>();
  public readonly fileUrl = input<string | null>();
  public readonly fileMaxSize = input<number>(5 * 1024 * 1024); // 5 MB

  private readonly fileHandlingService = inject(FileHandlingService);

  @Output() public fileSelectedEvent = new EventEmitter<File[]>();

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
