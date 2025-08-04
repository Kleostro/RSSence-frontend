import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

import { OverriddenHttpErrorResponse } from '@/app/api/schemas/overriden-http-error-response';
import { PostsService } from '@/app/api/services/posts/posts.service';
import { POST_REVISION_FORM_FIELD_CONFIG } from '@/app/constants/post-revision-form';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { ConfirmComponent } from '@/app/shared/components/confirm/confirm.component';
import { FormFieldErrorComponent } from '@/app/shared/components/form-field-error/form-field-error.component';
import { MessageService } from '@/app/shared/services/message/message.service';
import { ModalService } from '@/app/shared/services/modal/modal.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ConfirmComponent,
    ReactiveFormsModule,
    InputTextModule,
    FormFieldErrorComponent,
    TextareaModule,
    FloatLabelModule,
  ],
  selector: 'app-post-revision',
  styleUrl: './post-revision.component.scss',
  templateUrl: './post-revision.component.html',
})
export class PostRevisionComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly message = inject(MessageService);
  private readonly modalService = inject(ModalService);
  private readonly navigationService = inject(NavigationService);
  private readonly postsService = inject(PostsService);
  private fb = inject(FormBuilder).nonNullable;
  public readonly POST_REVISION_FORM_FIELD_CONFIG = POST_REVISION_FORM_FIELD_CONFIG;
  public isProcessing = signal<boolean>(false);
  public postId = input.required<number>();

  public postRevisionEvent = output();

  public revisionForm = this.fb.group({
    comment: ['', [Validators.required, Validators.maxLength(POST_REVISION_FORM_FIELD_CONFIG.comment.max)]],
  });

  public revisionPost(): void {
    const postId = this.postId();
    const { comment } = this.revisionForm.getRawValue();
    if (!postId || !comment) {
      return;
    }
    this.isProcessing.set(true);
    this.postsService
      .revisionPost(postId, comment)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.modalService.closeModal();
          if (this.navigationService.isPostDetailedModerationPage()) {
            this.navigationService.navigateToPostModeration();
          }
          this.postRevisionEvent.emit();
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
