import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { TextareaModule } from 'primeng/textarea';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

import { OverriddenHttpErrorResponse } from '@/app/api/schemas/overriden-http-error-response';
import { PostsService } from '@/app/api/services/posts/posts.service';
import { POST_ACTION } from '@/app/constants/post-action';
import { POST_REJECT_FORM_FIELD_CONFIG } from '@/app/constants/post-reject-form';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { ConfirmComponent } from '@/app/shared/components/confirm/confirm.component';
import { FormFieldErrorComponent } from '@/app/shared/components/form-field-error/form-field-error.component';
import { MessageService } from '@/app/shared/services/message/message.service';
import { ModalService } from '@/app/shared/services/modal/modal.service';

interface ReasonOption {
  label: string;
  value: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ConfirmComponent,
    ReactiveFormsModule,
    InputTextModule,
    FormFieldErrorComponent,
    FloatLabelModule,
    TextareaModule,
    ListboxModule,
  ],
  selector: 'app-post-reject',
  styleUrl: './post-reject.component.scss',
  templateUrl: './post-reject.component.html',
})
export class PostRejectComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly message = inject(MessageService);
  private readonly modalService = inject(ModalService);
  private readonly navigationService = inject(NavigationService);
  private readonly postsService = inject(PostsService);
  private fb = inject(FormBuilder).nonNullable;
  public readonly POST_REJECT_FORM_FIELD_CONFIG = POST_REJECT_FORM_FIELD_CONFIG;

  public readonly reasons: ReasonOption[] = [
    { label: 'Spam', value: 'Spam' },
    { label: 'Prohibited content', value: 'Prohibited content' },
    { label: 'Inappropriate title', value: 'Inappropriate title' },
    { label: 'Other', value: 'other' },
  ];
  public isProcessing = signal<boolean>(false);
  public postId = input.required<number>();
  public postRejectEvent = output();

  public rejectForm: FormGroup<{
    comment: FormControl<string>;
    reasons: FormControl<ReasonOption[]>;
  }> = this.fb.group({
    comment: this.fb.control<string>('', Validators.required),
    reasons: this.fb.control<ReasonOption[]>([], Validators.required),
  });

  public rejectPost(): void {
    const postId = this.postId();
    const { comment, reasons } = this.rejectForm.getRawValue();
    if (!postId || !comment || !reasons.length) {
      return;
    }

    this.isProcessing.set(true);
    this.postsService
      .performPostModeratorAction(
        postId,
        POST_ACTION.REJECT,
        comment,
        reasons.map((reason) => reason.value),
      )
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.modalService.closeModal();
          if (this.navigationService.isPostDetailedModerationPage()) {
            this.navigationService.navigateToPostModeration();
          }
          this.postRejectEvent.emit();
        }),
        catchError((error: OverriddenHttpErrorResponse) => {
          this.message.error(error.error.message);
          return EMPTY;
        }),
        finalize(() => {
          this.isProcessing.set(false);
        }),
      )
      .subscribe();
  }
}
