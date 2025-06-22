import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, forwardRef, inject, signal, viewChild } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import * as marked from 'marked';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { tap } from 'rxjs';

import { ENDPOINTS } from '@/app/api/constants/endpoints';
import { ImageUploadService } from '@/app/shared/services/image-upload/image-upload.service';
import { configurePostMarked } from '@/app/utils/configure-post-marked';
import { ENVIRONMENT } from '@/environment/environment';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, FormsModule, InputTextModule, ButtonModule, RippleModule],
  providers: [
    {
      multi: true,
      provide: NG_VALUE_ACCESSOR,

      useExisting: forwardRef(() => PostEditorComponent),
    },
  ],
  selector: 'app-post-editor',
  styleUrl: './post-editor.component.scss',
  templateUrl: './post-editor.component.html',
})
export class PostEditorComponent implements ControlValueAccessor {
  private readonly imageUploadService = inject(ImageUploadService);
  private readonly sanitizer = inject(DomSanitizer);
  private _onChange!: (_: unknown) => void;
  private _value = '';
  private textarea = viewChild.required<ElementRef<HTMLTextAreaElement>>('textarea');
  private uploadedImages = new Set<string>();

  public formControlName = signal<string>('');
  public id = signal<string>('');

  public isPreviewMode = signal<boolean>(false);

  public isProcessing = signal<boolean>(false);

  public markdownContent = signal<string>('');

  public onTouched!: () => void;
  public previewHtml = signal<SafeHtml>('');

  constructor() {
    configurePostMarked();
  }

  private cleanupUnusedImages(): void {
    const usedImages = this.extractUsedImages();
    const imagesToDelete = Array.from(this.uploadedImages).filter((url) => !usedImages.has(url));

    imagesToDelete.forEach((url) => {
      this.imageUploadService
        .deleteImage(url)
        .pipe(tap(() => this.uploadedImages.delete(url)))
        .subscribe();
    });
  }

  private extractUsedImages(): Set<string> {
    const usedImages = new Set<string>();
    const imgRegex = /!\[.*?\]\((.*?)\)/g;
    const content = this.markdownContent();
    for (let match = imgRegex.exec(content); match !== null; match = imgRegex.exec(content)) {
      usedImages.add(match[1]);
    }

    return usedImages;
  }

  private handleImagePaste(item: DataTransferItem): void {
    const blob = item.getAsFile();
    if (blob) {
      const imgPlaceholder = `![Upload...](${blob.name})`;
      this.markdownContent.update((content) => content + imgPlaceholder);
      const validImgUrl = `${ENVIRONMENT.API_URL}${ENDPOINTS.IMAGES}/${blob.name.replace(/\s+/g, '')}`;
      if (this.uploadedImages.has(validImgUrl)) {
        this.markdownContent.update((content) => content.replace(imgPlaceholder, ''));
        this.insertAtCursor(`![${blob.name}](${validImgUrl})`);
        return;
      }
      this.imageUploadService
        .uploadImage(blob)
        .pipe(
          tap(({ url }) => {
            this.uploadedImages.add(url);
            this.markdownContent.update((content) => content.replace(imgPlaceholder, ''));
            this.insertAtCursor(`![${blob.name}](${url})`);
          }),
        )
        .subscribe();
    }
  }

  public clearContent(): void {
    this.markdownContent.set('');
    this.cleanupUnusedImages();
  }

  public insertAtCursor(text: string): void {
    const start = this.textarea().nativeElement.selectionStart;
    const end = this.textarea().nativeElement.selectionEnd;

    this.markdownContent.update((content) => {
      const before = content.substring(0, start);
      const after = content.substring(end);
      return before + text + after;
    });

    this.textarea().nativeElement.value = this.markdownContent();
    this.textarea().nativeElement.focus();
    this.textarea().nativeElement.setSelectionRange(start + text.length, start + text.length);

    const inputEvent = new Event('input', { bubbles: true });
    this.textarea().nativeElement.dispatchEvent(inputEvent);
  }

  public onInput(event: Event): void {
    const { target } = event;
    if (target instanceof HTMLTextAreaElement) {
      const newContent = target.value;
      this.markdownContent.set(newContent);
      this.cleanupUnusedImages();
    }
  }

  public onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const items = event.clipboardData?.items;
    if (!items) {
      return;
    }

    Array.from(items).forEach((item) => {
      if (item.type.includes('image')) {
        this.handleImagePaste(item);
      } else if (item.type.includes('text/plain')) {
        this.insertAtCursor(event.clipboardData?.getData('text/plain') ?? '');
      }
    });
  }

  public registerOnChange(function_: (_: unknown) => void): void {
    this._onChange = function_;
  }

  public registerOnTouched(function_: () => void): void {
    this.onTouched = function_;
  }

  public async togglePreview(): Promise<void> {
    if (this.isPreviewMode()) {
      this.previewHtml.set('Loading...');
      this.isProcessing.set(true);
      const rawHtml = await marked.parse(this.markdownContent());
      this.isProcessing.set(false);
      this.cleanupUnusedImages();
      this.previewHtml.set(this.sanitizer.bypassSecurityTrustHtml(rawHtml));
    }
  }

  public get value(): string {
    return this._value;
  }

  public set value(value: string) {
    if (value !== this._value) {
      this._value = value;
      this.markdownContent.set(value);
      this._onChange(value);
    }
  }

  public writeValue(value: string): void {
    this._value = value || '';
  }
}
