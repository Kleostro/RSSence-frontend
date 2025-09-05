import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TextareaModule } from 'primeng/textarea';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';

import { AuthorResponse, hasKeyInAuthorResponse } from '@/app/api/schemas/authors-response';
import { OverriddenHttpErrorResponse } from '@/app/api/schemas/overriden-http-error-response';
import { AuthorsService } from '@/app/api/services/authors/authors.service';
import { UsersService } from '@/app/api/services/users/users.service';
import { AUTHOR_FORM_FIELD_CONFIG, FORM_CONTROL_NAME } from '@/app/constants/author-form';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { AuthorForm } from '@/app/interfaces/author-form';
import { FileUploaderComponent } from '@/app/shared/components/file-uploader/file-uploader.component';
import { FormFieldErrorComponent } from '@/app/shared/components/form-field-error/form-field-error.component';
import { FileHandlingService } from '@/app/shared/services/file-handling/file-handling.service';
import { MessageService } from '@/app/shared/services/message/message.service';
import { usernameAvailability } from '@/app/shared/validators/username-availability';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    FormFieldErrorComponent,
    FileUploaderComponent,
    InputIcon,
    IconField,
    InputTextModule,
    ButtonModule,
    RippleModule,
    TextareaModule,
  ],
  selector: 'app-author-form',
  styleUrl: './author-form.component.scss',
  templateUrl: './author-form.component.html',
})
export class AuthorFormComponent implements OnInit {
  private readonly authorsService = inject(AuthorsService);
  private readonly avatarFile = signal<File | null>(null);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  private readonly fileHandlingService = inject(FileHandlingService);
  private readonly message = inject(MessageService);
  private readonly updatedAuthor = signal<AuthorResponse | null>(null);
  private readonly usersService = inject(UsersService);

  @Input() public author: AuthorResponse | null = null;
  @Output() public backToAuthorPageEvent = new EventEmitter<void>();
  @Output() public formSubmitEvent = new EventEmitter<AuthorResponse>();
  @Output() public updateAuthorForPreviewEvent = new EventEmitter<AuthorResponse | null>();

  public readonly AUTHOR_FORM_FIELD_CONFIG = AUTHOR_FORM_FIELD_CONFIG;
  public readonly navigationService = inject(NavigationService);

  public avatarUrl = signal<null | string>(null);
  public form!: FormGroup<AuthorForm>;
  public hasChanges = signal<boolean>(false);
  public isProcessing = signal<boolean>(false);
  public isUsernameAvailable = signal<boolean | null>(null);

  private createFormData(): FormData {
    const formData = new FormData();

    Object.entries(this.form.value).forEach(([key, value]) => {
      if (value && hasKeyInAuthorResponse(key) && this.isValueChanged(key, value)) {
        formData.append(key, value);
        this.hasChanges.set(true);
      }
    });

    const avatar = this.avatarFile();
    if (avatar) {
      formData.append(FORM_CONTROL_NAME.AVATAR, avatar);
    }

    return formData;
  }

  private disableForm(): void {
    this.isProcessing.set(true);
    this.form.disable();
  }

  private enableForm(): void {
    this.isProcessing.set(false);
    this.form.enable();
  }

  private focusFirstInvalidField(): void {
    const invalidControl = Object.keys(this.form.controls).find((controlName) => this.form.get(controlName)?.invalid);
    if (invalidControl) {
      const element = document.querySelector(`[formControlName="${invalidControl}"]`);
      if (element instanceof HTMLInputElement) {
        element.focus();
      }
    }
  }

  private handleFormSubmit(formData: FormData): void {
    const username = this.author?.username ?? '';
    const action$ = this.author
      ? this.authorsService.updateAuthor(username, formData)
      : this.authorsService.createAuthor(formData);

    action$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((newOrUpdatedAuthor) => {
          this.formSubmitEvent.emit(newOrUpdatedAuthor);
        }),
        switchMap(() => this.usersService.getMe()),
        catchError((error: OverriddenHttpErrorResponse) => {
          this.message.error(error.error.message);
          this.enableForm();
          return EMPTY;
        }),
      )
      .subscribe();
  }

  private initForm(initialValues?: AuthorResponse | null): void {
    this.form = this.fb.nonNullable.group({
      bio: [initialValues?.bio ?? '', [Validators.maxLength(this.AUTHOR_FORM_FIELD_CONFIG.bio.max)]],
      firstname: [
        initialValues?.firstname ?? '',
        [
          Validators.required.bind(this),
          Validators.minLength(this.AUTHOR_FORM_FIELD_CONFIG.firstname.min),
          Validators.maxLength(this.AUTHOR_FORM_FIELD_CONFIG.firstname.max),
        ],
      ],
      lastname: [
        initialValues?.lastname ?? '',
        [
          Validators.required.bind(this),
          Validators.minLength(this.AUTHOR_FORM_FIELD_CONFIG.lastname.min),
          Validators.maxLength(this.AUTHOR_FORM_FIELD_CONFIG.lastname.max),
        ],
      ],
      username: [
        initialValues?.username ?? '',
        [
          Validators.required.bind(this),
          Validators.minLength(this.AUTHOR_FORM_FIELD_CONFIG.username.min),
          Validators.maxLength(this.AUTHOR_FORM_FIELD_CONFIG.username.max),
        ],
        [usernameAvailability(this.authorsService, this.author?.username ?? null)],
      ],
    });
  }

  private isValueChanged(key: string, value: string): boolean {
    if (hasKeyInAuthorResponse(key)) {
      const { author } = this;
      if (!author) {
        return true;
      }

      return author[key] !== value;
    }
    return false;
  }

  private updateAuthorForPreview(): void {
    const { bio, firstname, lastname, username } = this.form.getRawValue();
    this.updatedAuthor.set({
      avatarUrl: this.avatarUrl() ?? this.author?.avatarUrl ?? null,
      bio,
      createdAt: this.author?.createdAt ?? '',
      firstname,
      id: this.author?.id ?? 0,
      lastname,
      updatedAt: this.author?.updatedAt ?? '',
      userId: this.author?.userId ?? 0,
      username,
    });
    this.updateAuthorForPreviewEvent.emit(this.updatedAuthor());
  }

  public ngOnInit(): void {
    this.initForm(this.author);

    if (this.author) {
      this.avatarUrl.set(this.author.avatarUrl);
      this.updatedAuthor.set(this.author);
    }

    this.form.valueChanges.subscribe(() => {
      this.updateAuthorForPreview();
    });
  }

  public onAvatarSelected(files: File[]): void {
    this.avatarFile.set(files[0]);
    this.hasChanges.set(true);

    if (!files[0]) {
      this.avatarUrl.set(null);
      this.updateAuthorForPreview();
      return;
    }

    this.avatarUrl.set(this.fileHandlingService.createObjectURL(files[0]));
    this.updateAuthorForPreview();
  }

  public submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.focusFirstInvalidField();
      return;
    }

    this.disableForm();
    const formData = this.createFormData();
    if (this.author && !this.hasChanges()) {
      this.backToAuthorPageEvent.emit();
      return;
    }

    this.handleFormSubmit(formData);
  }
}
