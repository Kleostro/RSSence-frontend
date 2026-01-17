import { ChangeDetectionStrategy, Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { RippleModule } from 'primeng/ripple';
import { TextareaModule } from 'primeng/textarea';

import { POST_COMMENT_FORM_FIELD_CONFIG } from '@/app/constants/form/post-comment-form';
import { FormFieldErrorComponent } from '@/app/shared/components/form-field-error/form-field-error.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormFieldErrorComponent, ReactiveFormsModule, ButtonModule, RippleModule, TextareaModule, FloatLabelModule],
  selector: 'app-post-comment-form',
  styleUrl: './post-comment-form.component.scss',
  templateUrl: './post-comment-form.component.html',
})
export class PostCommentFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder).nonNullable;
  public readonly POST_COMMENT_FORM_FIELD_CONFIG = POST_COMMENT_FORM_FIELD_CONFIG;
  public createCommentEvent = output<{ content: string; parentId?: number }>();
  public form = this.fb.group({
    content: ['', [Validators.required, Validators.maxLength(POST_COMMENT_FORM_FIELD_CONFIG.content.max)]],
  });
  public initialContent = input<string>('');
  public isDisabled = input<boolean>(false);
  public isProcessing = input<boolean>(false);

  public mode = input<'COMMENT' | 'EDIT' | 'REPLY'>('COMMENT');
  public parentId = input<number>();
  public updateCommentEvent = output<{ content: string }>();

  public ngOnInit(): void {
    this.form.controls.content.setValue(this.initialContent());
  }

  public submit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      if (this.initialContent().length) {
        this.updateCommentEvent.emit({ content: this.form.getRawValue().content });
      } else {
        this.createCommentEvent.emit({
          content: this.form.getRawValue().content,
          parentId: this.parentId(),
        });
      }
      this.form.reset();
      this.form.markAsUntouched();
    }
  }
}
