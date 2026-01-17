import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TextareaModule } from 'primeng/textarea';
import { debounceTime, distinctUntilChanged, finalize, switchMap, tap } from 'rxjs';

import { AuthorResponse, hasKeyInAuthorResponse } from '@/app/api/schemas/authors-response';
import { AuthorsService } from '@/app/api/services/authors/authors.service';
import { UsersService } from '@/app/api/services/users/users.service';
import { handleHttpError } from '@/app/api/utils/handle-http-error';
import { AUTHOR_FORM_FIELD_CONFIG, FORM_CONTROL_NAME } from '@/app/constants/form/author-form';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { AuthorForm } from '@/app/interfaces/author-form';
import { FileUploaderComponent } from '@/app/shared/components/file-uploader/file-uploader.component';
import { FormFieldErrorComponent } from '@/app/shared/components/form-field-error/form-field-error.component';
import { FileHandlingService } from '@/app/shared/services/file-handling/file-handling.service';
import { MessageService } from '@/app/shared/services/message/message.service';
import { usernameAvailability } from '@/app/shared/validators/username-availability';

const DEBOUNCE_TIME = 300;

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

  public readonly AUTHOR_FORM_FIELD_CONFIG = AUTHOR_FORM_FIELD_CONFIG;
  public readonly navigationService = inject(NavigationService);
  public author = input<AuthorResponse | null>(null);
  public avatarUrl = signal<null | string>(null);

  public backToAuthorPageEvent = output();
  public form!: FormGroup<AuthorForm>;

  public formSubmitEvent = output<AuthorResponse>();
  public hasChanges = signal<boolean>(false);
  public isProcessing = signal<boolean>(false);
  public isUsernameAvailable = signal<boolean | null>(null);
  public updateAuthorForPreviewEvent = output<AuthorResponse | null>();

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
      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
        element.focus();
      }
    }
  }

  private handleFormSubmit(formData: FormData): void {
    const action$ = this.author()
      ? this.authorsService.updateAuthor(formData)
      : this.authorsService.createAuthor(formData);

    action$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((newOrUpdatedAuthor) => {
          this.formSubmitEvent.emit(newOrUpdatedAuthor);
        }),
        switchMap(() => this.usersService.getMe()),
        handleHttpError(this.message),
        finalize(() => {
          this.enableForm();
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
        [usernameAvailability(this.authorsService, this.author()?.username ?? null)],
      ],
    });
  }

  private isValueChanged(key: string, value: string): boolean {
    if (hasKeyInAuthorResponse(key)) {
      const author = this.author();
      if (!author) {
        return true;
      }

      return author[key] !== value.trim();
    }
    return false;
  }

  private updateAuthorForPreview(author: AuthorResponse | null): void {
    const { bio, firstname, lastname, username } = this.form.getRawValue();

    this.updatedAuthor.set({
      avatarUrl: this.avatarUrl() ?? author?.avatarUrl ?? null,
      bio,
      createdAt: author?.createdAt ?? '',
      firstname,
      id: author?.id ?? 0,
      lastname,
      updatedAt: author?.updatedAt ?? '',
      userId: author?.userId ?? 0,
      username,
    });

    this.updateAuthorForPreviewEvent.emit(this.updatedAuthor());
  }

  public ngOnInit(): void {
    const author = this.author();
    this.initForm(author);

    if (author) {
      this.avatarUrl.set(author.avatarUrl);
      this.updatedAuthor.set(author);
    }

    this.form.valueChanges
      .pipe(debounceTime(DEBOUNCE_TIME), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.updateAuthorForPreview(author);
      });
  }

  public onAvatarSelected(files: File[]): void {
    this.avatarFile.set(files[0]);
    this.hasChanges.set(true);

    const author = this.author();
    if (files[0]) {
      this.avatarUrl.set(this.fileHandlingService.createObjectURL(files[0]));
      this.updateAuthorForPreview(author);
    }
  }

  public submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.focusFirstInvalidField();
      return;
    }

    this.disableForm();
    const formData = this.createFormData();
    if (this.author() && !this.hasChanges()) {
      this.backToAuthorPageEvent.emit();
      return;
    }

    this.handleFormSubmit(formData);
  }
}
