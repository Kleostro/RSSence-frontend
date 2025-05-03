import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TextareaModule } from 'primeng/textarea';
import { catchError, EMPTY, Subject, takeUntil } from 'rxjs';

import { AuthorsResponse, hasKeyInAuthorsResponse } from '@/app/api/schemas/authors-response';
import { AUTHOR_FORM_FIELD_CONFIG, FORM_CONTROL_NAME } from '@/app/author/constants/author-form';
import { AuthorForm } from '@/app/author/interfaces/author-form';
import { AuthorFacadeService } from '@/app/author/services/author-facade/author-facade.service';
import { AuthorService } from '@/app/author/services/author/author.service';
import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { FileUploaderComponent } from '@/app/shared/components/file-uploader/file-uploader.component';
import { FormFieldErrorComponent } from '@/app/shared/components/form-field-error/form-field-error.component';
import { FileHandlingService } from '@/app/shared/services/file-handling/file-handling.service';
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
export class AuthorFormComponent implements OnDestroy, OnInit {
  private readonly authorService = inject(AuthorService);
  private readonly avatarFile = signal<File | null>(null);
  private readonly destroy$ = new Subject<void>();
  private readonly facade = inject(AuthorFacadeService);
  private readonly fb = inject(FormBuilder);
  private readonly fileHandlingService = inject(FileHandlingService);
  private readonly updatedAuthor = signal<AuthorsResponse | null>(null);

  @Input() public author: AuthorsResponse | null = null;
  @Output() public backToAuthorPageEvent = new EventEmitter<void>();
  @Output() public formSubmitEvent = new EventEmitter<AuthorsResponse>();
  @Output() public updateAuthorForPreviewEvent = new EventEmitter<AuthorsResponse | null>();

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
      if (value && hasKeyInAuthorsResponse(key) && this.isValueChanged(key, value)) {
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

  private handleFormSubmit(): void {
    const formData = this.createFormData();
    this.facade
      .handleAuthorFormSubmit(formData, !!this.author)
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => {
          this.enableForm();
          return EMPTY;
        }),
      )
      .subscribe((newOrUpdatedAuthor) => {
        this.formSubmitEvent.emit(newOrUpdatedAuthor);
      });
  }

  private initForm(initialValues?: AuthorsResponse | null): void {
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
        [usernameAvailability(this.authorService, this.author?.username ?? null)],
      ],
    });
  }

  private isValueChanged(key: string, value: string): boolean {
    if (hasKeyInAuthorsResponse(key)) {
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
      authoredPosts: this.author?.authoredPosts ?? [],
      avatarUrl: this.avatarUrl() ?? this.author?.avatarUrl ?? null,
      bio,
      coauthoredPosts: this.author?.coauthoredPosts ?? [],
      firstname,
      id: this.author?.id ?? 0,
      lastname,
      userId: this.author?.userId ?? 0,
      username,
    });
    this.updateAuthorForPreviewEvent.emit(this.updatedAuthor());
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
    this.handleFormSubmit();

    if (this.author && !this.hasChanges()) {
      this.backToAuthorPageEvent.emit();
    }
  }
}
